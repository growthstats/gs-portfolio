import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { contactFormSchema, HONEYPOT_FIELD, type ContactFormValues } from '@/lib/contactForm'
import { writeClient } from '@/sanity/lib/writeClient'

const { RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL } = process.env

export async function POST(request: Request) {
  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL || !CONTACT_TO_EMAIL) {
    console.error(
      'Contact endpoint is missing RESEND_API_KEY, CONTACT_FROM_EMAIL or CONTACT_TO_EMAIL',
    )
    return NextResponse.json({ error: 'Contact endpoint is not configured.' }, { status: 500 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }

  // Pretend success so bots don't learn to skip the field.
  if (body?.[HONEYPOT_FIELD]) {
    return NextResponse.json({ ok: true }, { status: 200 })
  }

  const parsed = contactFormSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  const lead = parsed.data
  const sourcePath = getSourcePath(request)

  const [stored, notified] = await Promise.all([
    storeLead(lead, sourcePath),
    notifyTeam(lead, sourcePath),
  ])

  if (stored) {
    await writeClient
      .patch(stored)
      .set({ notified })
      .commit()
      .catch((error) => console.error('Contact: failed to record notification status', error))
  }

  // The lead is safe as long as one channel captured it.
  if (!stored && !notified) {
    return NextResponse.json({ error: 'Unable to submit form.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}

/** Returns the new document ID, or null on failure. */
async function storeLead(lead: ContactFormValues, sourcePath: string | null) {
  try {
    const doc = await writeClient.create({
      // Dotted IDs are private in a public dataset (token required to read).
      _id: `contact-submission.${crypto.randomUUID()}`,
      _type: 'contact.submission',
      status: 'new',
      ...lead,
      sourcePath,
      submittedAt: new Date().toISOString(),
      notified: false,
    })
    return doc._id
  } catch (error) {
    console.error('Contact: failed to store lead in Sanity', error)
    return null
  }
}

async function notifyTeam(lead: ContactFormValues, sourcePath: string | null) {
  const resend = new Resend(RESEND_API_KEY)

  try {
    const { error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL!,
      to: CONTACT_TO_EMAIL!.split(',').map((address) => address.trim()),
      replyTo: lead.email,
      subject: `New enquiry from ${lead.name}`,
      text: [
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        `Phone: ${lead.phone}`,
        sourcePath && `Submitted from: ${sourcePath}`,
        '',
        lead.message,
      ]
        .filter((line) => line !== null)
        .join('\n'),
      html: `
        <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>
        ${sourcePath ? `<p><strong>Submitted from:</strong> ${escapeHtml(sourcePath)}</p>` : ''}
        <p><strong>Message:</strong><br>${escapeHtml(lead.message).replace(/\n/g, '<br>')}</p>
      `,
    })

    if (error) throw error
    return true
  } catch (error) {
    console.error('Contact: failed to send notification via Resend', error)
    return false
  }
}

function getSourcePath(request: Request) {
  const referer = request.headers.get('referer')
  if (!referer) return null

  try {
    return new URL(referer).pathname
  } catch {
    return null
  }
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

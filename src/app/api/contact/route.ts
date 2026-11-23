import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createContactFormSchema, HONEYPOT_FIELD, type ContactFormValues } from '@/lib/contactForm'
import { DEFAULT_LANG } from '@/lib/i18n'
import { getDictionary } from '@/i18n'

const { RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL, CONTACT_APPS_SCRIPT_URL } =
  process.env

// The form validates before it posts, so these messages never reach a visitor; the default language will do.
const contactFormSchema = createContactFormSchema(getDictionary(DEFAULT_LANG).contactForm.errors)

export async function POST(request: Request) {
  if (!RESEND_API_KEY || !CONTACT_FROM_EMAIL || !CONTACT_TO_EMAIL || !CONTACT_APPS_SCRIPT_URL) {
    console.error(
      'Contact endpoint is missing RESEND_API_KEY, CONTACT_FROM_EMAIL, CONTACT_TO_EMAIL or CONTACT_APPS_SCRIPT_URL',
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

  // The Apps Script logs the lead and emails the team from Google Workspace, which Gmail trusts.
  // Resend mail from send.growthstats.io landed in spam, so Resend is only the fallback now.
  const sheet = await logToSheet(lead, sourcePath)
  const notified = sheet.emailed || (await notifyTeam(lead, sourcePath))

  // The lead is safe as long as one channel captured it.
  if (!sheet.logged && !notified) {
    return NextResponse.json({ error: 'Unable to submit form.' }, { status: 502 })
  }

  return NextResponse.json({ ok: true }, { status: 200 })
}

/**
 * Sends the lead to the sheet's Apps Script web app (see docs/contact-form.md), which appends a row
 * and emails the team. `emailed` is false when the script could not send mail, or is an older
 * version that only logs, so the caller falls back to Resend.
 */
async function logToSheet(lead: ContactFormValues, sourcePath: string | null) {
  try {
    const response = await fetch(CONTACT_APPS_SCRIPT_URL!, {
      method: 'POST',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...lead, sourcePath }),
    })

    // Apps Script answers 200 even when the script throws, so trust only the flags in its body.
    const result = await response.json().catch(() => null)
    const logged = response.ok && result?.ok === true
    const emailed = response.ok && result?.emailed === true

    if (!logged || !emailed) {
      console.error(
        `Contact: Apps Script responded ${response.status} (logged: ${logged}, emailed: ${emailed})`,
        JSON.stringify(result),
      )
    }

    return { logged, emailed }
  } catch (error) {
    console.error('Contact: failed to reach the Apps Script', error)
    return { logged: false, emailed: false }
  }
}

async function notifyTeam(lead: ContactFormValues, sourcePath: string | null) {
  const resend = new Resend(RESEND_API_KEY)

  try {
    const { data, error } = await resend.emails.send({
      from: CONTACT_FROM_EMAIL!,
      to: CONTACT_TO_EMAIL!.split(',').map((address) => address.trim()),
      replyTo: lead.email,
      subject: `[Website lead] ${lead.name}`,
      text: [
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        `Phone: ${lead.phone}`,
        lead.website && `Website: ${lead.website}`,
        sourcePath && `Submitted from: ${sourcePath}`,
        '',
        lead.message,
      ]
        .filter((line) => typeof line === 'string')
        .join('\n'),
      html: `
        <p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(lead.phone)}</p>
        ${lead.website ? `<p><strong>Website:</strong> ${escapeHtml(lead.website)}</p>` : ''}
        ${sourcePath ? `<p><strong>Submitted from:</strong> ${escapeHtml(sourcePath)}</p>` : ''}
        <p><strong>Message:</strong><br>${escapeHtml(lead.message).replace(/\n/g, '<br>')}</p>
      `,
    })

    if (error) throw error
    console.info('Contact: fallback notification sent via Resend', data?.id)
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

import { NextResponse } from 'next/server'
import { contactFormSchema } from '@/lib/contactForm'

export async function POST(request: Request) {
  const webhookUrl = process.env.CONTACT_APPS_SCRIPT_URL

  if (!webhookUrl) {
    return NextResponse.json({ error: 'Contact endpoint is not configured.' }, { status: 500 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }

  const parsed = contactFormSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid form data.' }, { status: 400 })
  }

  try {
    const upstream = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parsed.data),
    })

    if (!upstream.ok) {
      return NextResponse.json({ error: 'Submission failed upstream.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (error) {
    console.error('Contact submission error:', error)
    return NextResponse.json({ error: 'Unable to submit form.' }, { status: 502 })
  }
}

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const send = vi.fn()
vi.mock('resend', () => ({
  Resend: vi.fn(function () {
    return { emails: { send } }
  }),
}))

const lead = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  phone: '+91 98765 43210',
  website: '',
  message: 'We would like a quote.',
}

function appsScriptAnswers(body: unknown, status = 200) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => new Response(JSON.stringify(body), { status })),
  )
}

async function submit(body: unknown = lead) {
  const { POST } = await import('./route')
  return POST(
    new Request('https://growthstats.io/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', referer: 'https://growthstats.io/contact' },
      body: JSON.stringify(body),
    }),
  )
}

beforeEach(() => {
  vi.resetModules()
  vi.spyOn(console, 'error').mockImplementation(() => {})
  vi.spyOn(console, 'info').mockImplementation(() => {})
  vi.stubEnv('RESEND_API_KEY', 're_test')
  vi.stubEnv('CONTACT_FROM_EMAIL', 'Website <website@send.example.com>')
  vi.stubEnv('CONTACT_TO_EMAIL', 'info@example.com')
  vi.stubEnv('CONTACT_APPS_SCRIPT_URL', 'https://script.google.com/macros/s/test/exec')
  send.mockResolvedValue({ data: { id: 'email_1' }, error: null })
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  send.mockReset()
})

describe('POST /api/contact', () => {
  it('skips Resend when the Apps Script logged and emailed the lead', async () => {
    appsScriptAnswers({ ok: true, emailed: true })

    const response = await submit()

    expect(response.status).toBe(200)
    expect(send).not.toHaveBeenCalled()
    const [, init] = vi.mocked(fetch).mock.calls[0]
    expect(JSON.parse(init!.body as string)).toMatchObject({ ...lead, sourcePath: '/contact' })
  })

  it('falls back to Resend when the Apps Script logged but did not email', async () => {
    appsScriptAnswers({ ok: true, emailed: false, error: 'quota' })

    const response = await submit()

    expect(response.status).toBe(200)
    expect(send).toHaveBeenCalledOnce()
    expect(send.mock.calls[0][0]).toMatchObject({
      to: ['info@example.com'],
      replyTo: 'jane@example.com',
      subject: '[Website lead] Jane Doe',
    })
  })

  it('falls back to Resend when an older script answers without the emailed flag', async () => {
    appsScriptAnswers({ ok: true })

    expect((await submit()).status).toBe(200)
    expect(send).toHaveBeenCalledOnce()
  })

  it('succeeds through Resend when the Apps Script is unreachable', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        throw new Error('network down')
      }),
    )

    expect((await submit()).status).toBe(200)
    expect(send).toHaveBeenCalledOnce()
  })

  it('answers 502 when neither the sheet nor any email captured the lead', async () => {
    appsScriptAnswers({ ok: false, error: 'boom' })
    send.mockResolvedValue({ data: null, error: { message: 'rejected' } })

    expect((await submit()).status).toBe(502)
  })

  it('drops honeypot submissions without calling either channel', async () => {
    appsScriptAnswers({ ok: true, emailed: true })

    const response = await submit({ ...lead, fax: 'bot' })

    expect(response.status).toBe(200)
    expect(fetch).not.toHaveBeenCalled()
    expect(send).not.toHaveBeenCalled()
  })
})

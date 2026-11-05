import { afterEach, describe, expect, it, vi } from 'vitest'

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com'
})

import robots from './robots'

afterEach(() => vi.unstubAllEnvs())

describe('robots', () => {
  it('allows crawling and lists the sitemap in production', () => {
    vi.stubEnv('VERCEL_ENV', 'production')

    expect(robots()).toEqual({
      rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
      sitemap: 'https://example.com/sitemap.xml',
    })
  })

  it.each(['preview', 'development', undefined])(
    'disallows everything when VERCEL_ENV is %s',
    (env) => {
      vi.stubEnv('VERCEL_ENV', env)

      expect(robots()).toEqual({ rules: { userAgent: '*', disallow: '/' } })
    },
  )
})

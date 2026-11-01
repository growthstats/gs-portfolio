import { beforeAll, describe, expect, it, vi } from 'vitest'

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com'
})

const page = (_type: string, slug: string) =>
  ({ _type, metadata: { slug: { current: slug } } }) as unknown as Sanity.PageBase

let resolveUrl: typeof import('./resolveUrl').default
beforeAll(async () => {
  resolveUrl = (await import('./resolveUrl')).default
})

describe('resolveUrl', () => {
  it('keeps English URLs unprefixed', () => {
    expect(resolveUrl(page('page', 'index'))).toBe('https://example.com/')
    expect(resolveUrl(page('page', 'services'), { base: false })).toBe('/services')
    expect(resolveUrl(page('blog.post', 'a-post'), { language: 'en' })).toBe(
      'https://example.com/blog/a-post',
    )
  })

  it('prefixes other languages', () => {
    expect(resolveUrl(page('page', 'index'), { base: false, language: 'de' })).toBe('/de')
    expect(resolveUrl(page('page', 'services'), { base: false, language: 'de' })).toBe(
      '/de/services',
    )
    expect(resolveUrl(page('blog.post', 'a-post'), { base: false, language: 'de' })).toBe(
      '/de/blog/a-post',
    )
  })

  it('appends params after the path and ignores unsupported languages', () => {
    expect(
      resolveUrl(page('page', 'services'), { base: false, language: 'de', params: '#faq' }),
    ).toBe('/de/services#faq')
    expect(resolveUrl(page('page', 'services'), { base: false, language: 'fr' })).toBe('/services')
  })
})

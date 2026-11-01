import { beforeAll, describe, expect, it, vi } from 'vitest'

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com'
})

const BASE = 'https://example.com'

const doc = (
  _type: string,
  slug: string,
  language: string | undefined,
  translations: Sanity.TranslationLink[],
) =>
  ({
    _type,
    language,
    metadata: { slug: { current: slug } },
    isFallback: false,
    translations,
  }) as unknown as Sanity.Localized<Sanity.PageBase>

let seo: typeof import('./seo')
beforeAll(async () => {
  seo = await import('./seo')
})

describe('buildAlternates', () => {
  const both: Sanity.TranslationLink[] = [
    { lang: 'en', url: '/services' },
    { lang: 'de', url: '/de/services' },
  ]

  it('links every translation and x-default from the English page', () => {
    expect(seo.buildAlternates(doc('page', 'services', 'en', both), BASE)).toEqual({
      lang: 'en',
      canonical: 'https://example.com/services',
      languages: {
        en: 'https://example.com/services',
        de: 'https://example.com/de/services',
        'x-default': 'https://example.com/services',
      },
      locale: 'en_US',
      alternateLocales: ['de_DE'],
    })
  })

  it('canonicalises a translation to its own prefixed URL', () => {
    const result = seo.buildAlternates(doc('page', 'services', 'de', both), BASE)
    expect(result.canonical).toBe('https://example.com/de/services')
    expect(result.languages['x-default']).toBe('https://example.com/services')
    expect(result.locale).toBe('de_DE')
    expect(result.alternateLocales).toEqual(['en_US'])
  })

  it('canonicalises a fallback to the English URL, with no German alternate', () => {
    // `/de/pricing` renders the English document: it has no German translation.
    const fallback = {
      ...doc('page', 'pricing', 'en', [{ lang: 'en', url: '/pricing' }]),
      isFallback: true,
    }
    expect(seo.buildAlternates(fallback, BASE)).toEqual({
      lang: 'en',
      canonical: 'https://example.com/pricing',
      languages: {
        en: 'https://example.com/pricing',
        'x-default': 'https://example.com/pricing',
      },
      locale: 'en_US',
      alternateLocales: [],
    })
  })

  it('handles the homepage and blog posts', () => {
    const home = seo.buildAlternates(
      doc('page', 'index', 'de', [
        { lang: 'en', url: '/' },
        { lang: 'de', url: '/de' },
      ]),
      BASE,
    )
    expect(home.canonical).toBe('https://example.com/de')
    expect(home.languages.en).toBe('https://example.com/')

    const post = seo.buildAlternates(
      doc('blog.post', 'a-post', 'de', [{ lang: 'de', url: '/de/blog/a-post' }]),
      BASE,
    )
    expect(post.canonical).toBe('https://example.com/de/blog/a-post')
    // A German-only post has no English URL to point x-default at.
    expect(post.languages).toEqual({ de: 'https://example.com/de/blog/a-post' })
  })

  it('treats a document without a language as English', () => {
    const result = seo.buildAlternates(
      doc('page', 'about', undefined, [{ lang: 'en', url: '/about' }]),
      BASE,
    )
    expect(result.canonical).toBe('https://example.com/about')
    expect(result.locale).toBe('en_US')
  })
})

describe('documentLanguage', () => {
  it('falls back to English for missing or unsupported languages', () => {
    expect(seo.documentLanguage({ language: 'de' })).toBe('de')
    expect(seo.documentLanguage({})).toBe('en')
    expect(seo.documentLanguage({ language: 'xx' })).toBe('en')
  })
})

it('has an Open Graph locale for every supported language', async () => {
  const { supportedLanguages } = await import('./i18n')
  for (const { id } of supportedLanguages) expect(seo.OG_LOCALES[id]).toMatch(/^[a-z]{2}_[A-Z]{2}$/)
})

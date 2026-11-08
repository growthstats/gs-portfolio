import { describe, expect, it, vi } from 'vitest'
import { buildAlternates, documentLanguage, markdownUrl, socialProfileUrls } from './seo'
import type { TranslationLink } from '@/sanity/lib/localized'

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com'
})

const doc = (
  _type: string,
  slug: string,
  language: string | undefined,
  translations: TranslationLink[],
) =>
  ({
    _type,
    language,
    metadata: { slug: { current: slug } },
    isFallback: false,
    translations,
  }) as Parameters<typeof buildAlternates>[0]

describe('buildAlternates', () => {
  const both: TranslationLink[] = [
    { lang: 'en', url: '/services' },
    { lang: 'de', url: '/de/services' },
  ]

  it('links every translation and x-default from the English page', () => {
    expect(buildAlternates(doc('page', 'services', 'en', both))).toEqual({
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
    const result = buildAlternates(doc('page', 'services', 'de', both))
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
    expect(buildAlternates(fallback)).toEqual({
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
    const home = buildAlternates(
      doc('page', 'index', 'de', [
        { lang: 'en', url: '/' },
        { lang: 'de', url: '/de' },
      ]),
    )
    expect(home.canonical).toBe('https://example.com/de')
    expect(home.languages.en).toBe('https://example.com/')

    const post = buildAlternates(
      doc('blog.post', 'a-post', 'de', [{ lang: 'de', url: '/de/blog/a-post' }]),
    )
    expect(post.canonical).toBe('https://example.com/de/blog/a-post')
    // A German-only post has no English URL to point x-default at.
    expect(post.languages).toEqual({ de: 'https://example.com/de/blog/a-post' })
  })

  it('treats a document without a language as English', () => {
    const result = buildAlternates(doc('page', 'about', undefined, [{ lang: 'en', url: '/about' }]))
    expect(result.canonical).toBe('https://example.com/about')
    expect(result.locale).toBe('en_US')
  })
})

describe('documentLanguage', () => {
  it('falls back to English for missing or unsupported languages', () => {
    expect(documentLanguage({ language: 'de' })).toBe('de')
    expect(documentLanguage({})).toBe('en')
    expect(documentLanguage({ language: 'xx' })).toBe('en')
  })
})

describe('markdownUrl', () => {
  it('appends .md to a page URL', () => {
    expect(markdownUrl('https://example.com/de/services')).toBe(
      'https://example.com/de/services.md',
    )
  })

  it('uses index.md for a homepage', () => {
    expect(markdownUrl('https://example.com/', { isHome: true })).toBe(
      'https://example.com/index.md',
    )
    expect(markdownUrl('https://example.com/de', { isHome: true })).toBe(
      'https://example.com/de/index.md',
    )
  })
})

describe('socialProfileUrls', () => {
  it('keeps plain links, whose projection has links: null', () => {
    expect(
      socialProfileUrls([
        { _type: 'link', external: 'https://www.linkedin.com/company/x', links: null },
        { _type: 'link', external: 'https://x.com/x', links: null },
      ]),
    ).toEqual(['https://www.linkedin.com/company/x', 'https://x.com/x'])
  })

  it('flattens link lists', () => {
    expect(
      socialProfileUrls([
        {
          _type: 'link.list',
          external: 'https://ignored.example',
          links: [{ external: 'https://github.com/x' }, { external: 'http://example.org' }],
        },
        { _type: 'link.list', links: null },
      ]),
    ).toEqual(['https://github.com/x', 'http://example.org'])
  })

  it('drops non-http(s) and empty URLs', () => {
    expect(
      socialProfileUrls([
        { _type: 'link', external: 'mailto:hi@example.com' },
        { _type: 'link', external: '' },
        { _type: 'link', external: null },
        { _type: 'link' },
      ]),
    ).toEqual([])
    expect(socialProfileUrls(undefined)).toEqual([])
  })
})

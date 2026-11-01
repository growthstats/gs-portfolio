import { evaluate, parse } from 'groq-js'
import { describe, expect, it, vi } from 'vitest'

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com'
  process.env.NEXT_PUBLIC_ENABLED_LANGUAGES = 'de'
})

import {
  IN_LANGUAGE,
  LOCALIZED_FIELDS,
  localizedRef,
  localizedRefs,
  staticSlugs,
  withTranslationLinks,
} from './localized'

const ref = (id: string) => ({ _type: 'reference', _ref: id })

// The plugin's format: one entry per language, keyed by its code, holding a weak reference.
const metadata = (id: string, translations: Record<string, string>) => ({
  _id: id,
  _type: 'translation.metadata',
  translations: Object.entries(translations).map(([lang, docId]) => ({
    _key: lang,
    _type: 'internationalizedArrayReferenceValue',
    value: { ...ref(docId), _weak: true },
  })),
})

const page = (id: string, slug: string, language?: string) => ({
  _id: id,
  _type: 'page',
  language,
  metadata: { slug: { current: slug } },
})

const dataset = [
  // Translated: English and German.
  page('services-en', 'services', 'en'),
  page('services-de', 'services', 'de'),
  metadata('services-meta', { en: 'services-en', de: 'services-de' }),
  // English only.
  page('about-en', 'about', 'en'),
  // Written before the language backfill.
  page('legacy', 'legacy'),
  // The German translation is an unpublished draft, so not in the published dataset.
  page('pricing-en', 'pricing', 'en'),
  metadata('pricing-meta', { en: 'pricing-en', de: 'pricing-de' }),

  { _id: 'nav-en', _type: 'navigation', language: 'en', title: 'Menu' },
  { _id: 'nav-de', _type: 'navigation', language: 'de', title: 'Menü' },
  metadata('nav-meta', { en: 'nav-en', de: 'nav-de' }),
  { _id: 'cat-en', _type: 'blog.category', language: 'en', title: 'News' },
  { _id: 'cat-de', _type: 'blog.category', language: 'de', title: 'Neuigkeiten' },
  metadata('cat-meta', { en: 'cat-en', de: 'cat-de' }),
  { _id: 'cat-tips', _type: 'blog.category', language: 'en', title: 'Tips' },
  {
    _id: 'site',
    _type: 'site',
    headerMenu: ref('nav-en'),
    categories: [ref('cat-en'), ref('cat-tips')],
  },
]

async function query(q: string, lang: string) {
  return (await evaluate(parse(q), { dataset, params: { lang } })).get()
}

describe('IN_LANGUAGE', () => {
  const slugs = (lang: string) =>
    query(`*[_type == 'page' && ${IN_LANGUAGE}] | order(_id) { _id }._id`, lang)

  it('keeps German documents and English ones without a German translation', async () => {
    expect(await slugs('de')).toEqual(['about-en', 'legacy', 'pricing-en', 'services-de'])
  })

  it('keeps every English document in English', async () => {
    expect(await slugs('en')).toEqual(['about-en', 'legacy', 'pricing-en', 'services-en'])
  })

  it('finds one document per slug', async () => {
    const find = (slug: string, lang: string) =>
      query(`*[_type == 'page' && metadata.slug.current == '${slug}' && ${IN_LANGUAGE}]._id`, lang)

    expect(await find('services', 'de')).toEqual(['services-de'])
    expect(await find('services', 'en')).toEqual(['services-en'])
    expect(await find('about', 'de')).toEqual(['about-en'])
  })
})

describe('LOCALIZED_FIELDS', () => {
  const fields = (id: string, lang: string) =>
    query(`*[_id == '${id}'][0]{ ${LOCALIZED_FIELDS} }`, lang)

  it('marks a translation as not a fallback and lists its languages', async () => {
    expect(await fields('services-de', 'de')).toEqual({
      isFallback: false,
      translations: [
        { lang: 'en', slug: 'services' },
        { lang: 'de', slug: 'services' },
      ],
    })
  })

  it('marks English shown for German as a fallback', async () => {
    expect(await fields('about-en', 'de')).toEqual({
      isFallback: true,
      translations: [{ lang: 'en', slug: 'about' }],
    })
  })

  it('leaves out translations that are not published', async () => {
    expect(await fields('pricing-en', 'de')).toMatchObject({
      isFallback: true,
      translations: [{ lang: 'en', slug: 'pricing' }],
    })
  })

  it('treats a document without a language as English', async () => {
    expect(await fields('legacy', 'en')).toEqual({
      isFallback: false,
      translations: [{ lang: 'en', slug: 'legacy' }],
    })
  })
})

describe('localizedRef and localizedRefs', () => {
  const site = (lang: string) =>
    query(
      `*[_id == 'site'][0]{
				'menu': ${localizedRef('headerMenu')}.title,
				'categories': ${localizedRefs('categories')}.title
			}`,
      lang,
    )

  it('follows references to their German translation', async () => {
    expect(await site('de')).toEqual({ menu: 'Menü', categories: ['Neuigkeiten', 'Tips'] })
  })

  it('keeps the referenced document in English', async () => {
    expect(await site('en')).toEqual({ menu: 'Menu', categories: ['News', 'Tips'] })
  })
})

describe('withTranslationLinks', () => {
  const doc = (translations: { lang: string; slug?: string }[]) =>
    ({ _type: 'page', isFallback: false, translations }) as unknown as Sanity.PageBase & {
      isFallback: boolean
      translations: { lang: string; slug?: string }[]
    }

  it('builds language-prefixed paths for enabled languages', () => {
    expect(
      withTranslationLinks(
        doc([
          { lang: 'en', slug: 'services' },
          { lang: 'de', slug: 'services' },
          { lang: 'fr', slug: 'services' },
        ]),
      ).translations,
    ).toEqual([
      { lang: 'en', url: '/services' },
      { lang: 'de', url: '/de/services' },
    ])
  })

  it('maps the index slug to the root and blog posts under the blog', () => {
    expect(withTranslationLinks(doc([{ lang: 'en', slug: 'index' }])).translations).toEqual([
      { lang: 'en', url: '/' },
    ])

    const post = { ...doc([{ lang: 'en', slug: 'a-post' }]), _type: 'blog.post' }
    expect(withTranslationLinks(post).translations).toEqual([{ lang: 'en', url: '/blog/a-post' }])
  })
})

describe('staticSlugs', () => {
  const docs = [
    { slug: 'services', language: 'en' },
    { slug: 'services', language: 'de' },
    { slug: 'about', language: 'en' },
    { slug: 'impressum', language: 'de' },
  ]

  it('prerenders English documents in every language, as themselves or as fallbacks', () => {
    expect(staticSlugs(docs, 'de')).toEqual(['services', 'about', 'impressum'])
  })

  it('leaves out other languages’ documents', () => {
    expect(staticSlugs(docs, 'en')).toEqual(['services', 'about'])
  })
})

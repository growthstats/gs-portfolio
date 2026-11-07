import { stegaClean } from 'next-sanity'
import resolveUrl, { type UrlSource } from './resolveUrl'
import { BASE_URL } from './env'
import { DEFAULT_LANG, isSupportedLanguage, type Lang } from './i18n'

/** `og:locale` per language. */
export const OG_LOCALES: Record<Lang, string> = {
  en: 'en_US',
  de: 'de_DE',
}

/** What the SEO helpers read from a blog post: `Sanity.Page` has none of the post fields. */
export type PostSeoSource = {
  _createdAt: string
  _updatedAt?: string
  publishDate?: string | null
  authors?: ({ name?: string | null } | null)[] | null
}

/** A document's language; documents written before the backfill count as English. */
export function documentLanguage(doc: { language?: string | null }): Lang {
  const language = stegaClean(doc.language)
  return isSupportedLanguage(language) ? language : DEFAULT_LANG
}

/**
 * A document's absolute URL in its own language. A fallback is the English
 * document, so its canonical is the English URL (ADR 0002).
 */
export function canonicalUrl(doc: UrlSource & { language?: string | null }) {
  return BASE_URL + resolveUrl(doc, { base: false, language: documentLanguage(doc) })
}

/**
 * Canonical URL, hreflang alternates and Open Graph locales for a document
 * fetched for a language (ADR 0002). Everything follows the document's own
 * language, so a fallback (the English document under `/de/`) canonicalises
 * to the English URL, and `translations` has no German entry to link to.
 */
export function buildAlternates(
  doc: UrlSource & { language?: string | null; translations: Sanity.TranslationLink[] },
) {
  const lang = documentLanguage(doc)

  const languages: Record<string, string> = Object.fromEntries(
    doc.translations.map(({ lang, url }) => [lang, BASE_URL + url]),
  )
  if (languages[DEFAULT_LANG]) languages['x-default'] = languages[DEFAULT_LANG]

  return {
    canonical: canonicalUrl(doc),
    languages,
    locale: OG_LOCALES[lang],
    alternateLocales: doc.translations
      .filter((t) => t.lang !== lang)
      .map((t) => OG_LOCALES[t.lang]),
  }
}

/** A blog post's publish and modified dates, falling back to the document's own timestamps. */
export function postDates(post: PostSeoSource) {
  const published = stegaClean(post.publishDate) || post._createdAt
  return { published, modified: post._updatedAt || published }
}

/** The names of a blog post's authors, without stega markers or missing references. */
export function postAuthorNames(post: PostSeoSource): string[] {
  return (post.authors ?? [])
    .map((author) => stegaClean(author?.name))
    .filter((name): name is string => Boolean(name))
}

/**
 * The `.md` copy of a URL or path: `/services` → `/services.md`. A homepage
 * (`/`, `/de`) has no slug to append to, so it gets `index.md`.
 */
export function markdownUrl(url: string, { isHome = false } = {}) {
  const trimmed = url.replace(/\/$/, '')
  return isHome ? `${trimmed}/index.md` : `${trimmed}.md`
}

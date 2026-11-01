import { stegaClean } from 'next-sanity'
import resolveUrl from './resolveUrl'
import { DEFAULT_LANG, isSupportedLanguage, type Lang } from './i18n'

/** `og:locale` per language. */
export const OG_LOCALES: Record<Lang, string> = {
  en: 'en_US',
  de: 'de_DE',
}

/** A document's language; documents written before the backfill count as English. */
export function documentLanguage(doc: { language?: string }): Lang {
  const language = stegaClean(doc.language)
  return isSupportedLanguage(language) ? language : DEFAULT_LANG
}

/**
 * Canonical URL, hreflang alternates and Open Graph locales for a document
 * fetched for a language (ADR 0002). Everything follows the document's own
 * language, so a fallback (the English document under `/de/`) canonicalises
 * to the English URL, and `translations` has no German entry to link to.
 */
export function buildAlternates(doc: Sanity.Localized<Sanity.PageBase>, baseUrl: string) {
  const lang = documentLanguage(doc)
  const absolute = (path: string) => baseUrl + path

  const languages: Record<string, string> = Object.fromEntries(
    doc.translations.map(({ lang, url }) => [lang, absolute(url)]),
  )
  if (languages[DEFAULT_LANG]) languages['x-default'] = languages[DEFAULT_LANG]

  return {
    lang,
    canonical: absolute(resolveUrl(doc, { base: false, language: lang })),
    languages,
    locale: OG_LOCALES[lang],
    alternateLocales: doc.translations
      .filter((t) => t.lang !== lang)
      .map((t) => OG_LOCALES[t.lang]),
  }
}

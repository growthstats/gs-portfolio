import { groq } from 'next-sanity'
import { BLOG_DIR } from '@/lib/env'
import { DEFAULT_LANG, isSupportedLanguage, localizePath, supportedLanguages } from '@/lib/i18n'

/** GROQ: the document is in `lang`. Documents from before the migration have no language and are English. */
const inLanguage = (lang: string) => `coalesce(language, '${DEFAULT_LANG}') == '${lang}'`

/**
 * Which document Presentation edits for a URL, per language: `/about` is the English page,
 * `/de/about` the German one with the same slug.
 * Presentation uses the first route that matches, and English `/:slug` also matches `/de`,
 * so the prefixed languages come first.
 */
const languagesPrefixedFirst = [...supportedLanguages].sort(
  (a, b) => Number(a.id === DEFAULT_LANG) - Number(b.id === DEFAULT_LANG),
)

export const mainDocuments = languagesPrefixedFirst.flatMap(({ id: lang }) => [
  {
    route: localizePath('/', lang),
    filter: groq`_type == 'page' && metadata.slug.current == 'index' && ${inLanguage(lang)}`,
  },
  {
    route: localizePath('/:slug', lang),
    filter: groq`_type == 'page' && metadata.slug.current == $slug && ${inLanguage(lang)}`,
  },
  {
    route: localizePath(`/${BLOG_DIR}/:slug`, lang),
    filter: groq`_type == 'blog.post' && metadata.slug.current == $slug && ${inLanguage(lang)}`,
  },
])

/** A document's English path, localized to its own language. */
export function documentHref(path: string, language?: string | null) {
  return localizePath(path, isSupportedLanguage(language) ? language : DEFAULT_LANG)
}

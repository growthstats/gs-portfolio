const LANGUAGES = [
  { id: 'en', title: 'English' },
  { id: 'de', title: 'Deutsch' },
] as const

export type Lang = (typeof LANGUAGES)[number]['id']

export const DEFAULT_LANG: Lang = 'en'

/**
 * Every language the code can render, and the Studio can hold content in (ADR 0001, 0002).
 * The Studio uses the supported list, not the enabled one, so editors can prepare German before launch.
 */
export const supportedLanguages: { id: Lang; title: string }[] = [...LANGUAGES]

const supportedIds = supportedLanguages.map(({ id }) => id)

export function isSupportedLanguage(value: unknown): value is Lang {
  return supportedIds.includes(value as Lang)
}

/**
 * Parses a comma-separated list such as `NEXT_PUBLIC_ENABLED_LANGUAGES`.
 * The default language is always enabled; unknown codes are ignored.
 */
export function parseEnabledLanguages(value = ''): Lang[] {
  const requested = value.split(',').map((code) => code.trim().toLowerCase())
  return supportedIds.filter((lang) => lang === DEFAULT_LANG || requested.includes(lang))
}

export const enabledLanguages = parseEnabledLanguages(process.env.NEXT_PUBLIC_ENABLED_LANGUAGES)

export function isEnabledLanguage(value: unknown): value is Lang {
  return enabledLanguages.includes(value as Lang)
}

/**
 * Splits a supported-language prefix off a pathname.
 * `/de/services` → `{ lang: 'de', path: '/services' }`; `/services` → `{ path: '/services' }`.
 */
export function parseLangFromPath(pathname: string): { lang?: Lang; path: string } {
  const [, first, ...rest] = pathname.split('/')
  if (!isSupportedLanguage(first)) return { path: pathname }
  return { lang: first, path: `/${rest.join('/')}` }
}

/** Prefixes a path with its language; the default language has no prefix. */
export function localizePath(path: string, lang: Lang = DEFAULT_LANG) {
  if (lang === DEFAULT_LANG) return path
  return path === '/' ? `/${lang}` : `/${lang}${path}`
}

/**
 * Localizes an English href, keeping its query or hash: `/?a=1` → `/de?a=1`.
 * Anything that isn't a root-relative path (`https:`, `mailto:`, `//cdn`, `#top`) is returned as is.
 */
export function localizeHref(href: string, lang: Lang = DEFAULT_LANG) {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  const end = href.search(/[?#]/)
  if (end === -1) return localizePath(href, lang)
  return localizePath(href.slice(0, end), lang) + href.slice(end)
}

/** Site settings singleton per language: `site` for English, `site-<lang>` for the rest (ADR 0002). */
export function siteDocumentId(lang: string) {
  return lang === DEFAULT_LANG ? 'site' : `site-${lang}`
}

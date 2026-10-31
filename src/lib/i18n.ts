const LANGUAGES = [
  { id: 'en', title: 'English' },
  { id: 'de', title: 'Deutsch' },
] as const

export type Lang = (typeof LANGUAGES)[number]['id']

export const DEFAULT_LANG: Lang = 'en'

/** Every language the code can render. Sanity's translation plugin reads this list too. */
export const supportedLanguages: { id: Lang; title: string }[] = [...LANGUAGES]

const supportedIds = supportedLanguages.map(({ id }) => id)

export const languages: string[] = supportedIds

/** @deprecated The blog modules still read this cookie; #65 replaces it with the route's `lang`. */
export const langCookieName = `sanitypress-${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}-lang`

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

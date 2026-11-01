import { localizePath, parseLangFromPath, supportedLanguages, type Lang } from '@/lib/i18n'

/**
 * The current page in each language. Every language shares the same slug (ADR 0002),
 * so `/services` and `/de/services` are the same page. The server sees English pages
 * under their `/en/...` rewrite, which `parseLangFromPath` strips too.
 */
export function languageLinks(pathname: string, languages: Lang[]) {
  const { path } = parseLangFromPath(pathname)

  return supportedLanguages
    .filter(({ id }) => languages.includes(id))
    .map(({ id, title }) => ({ lang: id, title, href: localizePath(path, id) }))
}

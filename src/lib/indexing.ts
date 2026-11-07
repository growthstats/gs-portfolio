import { DEFAULT_LANG, supportedLanguages } from './i18n'

/**
 * Only the production deployment may be indexed. `VERCEL_ENV` is `preview` on the `develop` deploy
 * and previews, and unset locally; `NEXT_PUBLIC_BASE_URL` can't tell them apart, since `develop`
 * may point it at the production domain too.
 */
export function isIndexable(vercelEnv = process.env.VERCEL_ENV) {
  return vercelEnv === 'production'
}

/**
 * The homepage's slug is `index` (see `resolveUrl`), so `/index` would serve it a second time.
 * English has no prefix (ADR 0001), so `/en/index` goes straight to `/`.
 */
export function indexRedirects() {
  return [
    { source: '/index', destination: '/', permanent: true },
    ...supportedLanguages.map(({ id }) => ({
      source: `/${id}/index`,
      destination: id === DEFAULT_LANG ? '/' : `/${id}`,
      permanent: true,
    })),
  ]
}

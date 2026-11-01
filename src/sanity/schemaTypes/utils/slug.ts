import type { CustomValidator, SlugValue } from 'sanity'

/**
 * Slug validation: a path without a leading or trailing `/`. Next.js redirects
 * `/technical-seo/` to `/technical-seo`, which no slug matches, so the page 404s (#100).
 */
export const noEdgeSlashes: CustomValidator<SlugValue | undefined> = (slug) => {
  const current = slug?.current ?? ''
  if (!current.startsWith('/') && !current.endsWith('/')) return true
  return 'Remove the "/" at the start or end. A slug looks like "technical-seo".'
}

import type { CustomValidator, SlugValue } from 'sanity'

/**
 * Slug validation: a path with no empty segment, so no leading, trailing or
 * double `/`. Next.js redirects `/technical-seo/` to `/technical-seo`, which no
 * slug matches, so the page 404s (#100).
 */
export const noEmptySegments: CustomValidator<SlugValue | undefined> = (slug) => {
  const current = slug?.current
  if (!current || !current.split('/').includes('')) return true
  return 'Remove the extra "/". A slug looks like "technical-seo" or "services/seo".'
}

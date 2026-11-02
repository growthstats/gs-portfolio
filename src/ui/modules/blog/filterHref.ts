import { BLOG_DIR } from '@/lib/env'

/** The blog list filtered by `key`, as an English path for `LocalizedLink` to localize. */
export function filterHref(key: 'category' | 'author', slug?: string) {
  return slug ? `/${BLOG_DIR}?${key}=${encodeURIComponent(slug)}` : `/${BLOG_DIR}`
}

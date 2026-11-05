'use server'

import { updateTag } from 'next/cache'

/**
 * `<SanityLive>`'s action in `next dev` outside draft mode. The site shows drafts there, from the
 * same `'use cache'` entries production uses, and the default "refresh" would re-render them unchanged.
 */
export async function refreshDrafts() {
  if (process.env.NODE_ENV !== 'development') return
  updateTag('sanity')
  return 'refresh' as const
}

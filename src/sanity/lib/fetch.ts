import { client } from '@/sanity/lib/client'
import { token } from '@/sanity/lib/token'
import { dev } from '@/lib/env'
import { draftMode } from 'next/headers'
import { type QueryParams } from 'next-sanity'
import { defineLive } from 'next-sanity/live'

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})

type FetchArgs = {
  query: string
  params?: Partial<QueryParams>
}

// `draftMode()` can't be read inside `'use cache'`, so what it decides is passed in and joins the
// cache key. The `sanity` tag is what `/api/revalidate` expires when a document is published.
async function cachedFetch({
  query,
  params = {},
  perspective,
  stega,
}: FetchArgs & { perspective: 'drafts' | 'published'; stega: boolean }) {
  'use cache'
  const { data } = await sanityFetch({ query, params, perspective, stega, tags: ['sanity'] })
  return data
}

export async function fetchSanityLive<T = unknown>(args: FetchArgs) {
  const { isEnabled } = await draftMode()

  return (await cachedFetch({
    ...args,
    perspective: isEnabled || dev ? 'drafts' : 'published',
    stega: isEnabled,
  })) as T
}

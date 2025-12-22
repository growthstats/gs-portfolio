'use server'

import { client } from '@/sanity/lib/client'
import { token } from '@/sanity/lib/token'
import { dev } from '@/lib/env'
import { draftMode } from 'next/headers'
import { type QueryOptions, type QueryParams } from 'next-sanity'
import { defineLive } from 'next-sanity/live'

type SanityNextOptions = QueryOptions['next']

export async function fetchSanity<T = unknown>({
  query,
  params = {},
  next,
}: {
  query: string
  params?: Partial<QueryParams>
  next?: SanityNextOptions
}) {
  const preview = dev || (await draftMode()).isEnabled
  const prodTags = ['sanity', ...(next?.tags ?? [])]

  return client.fetch<T>(
    query,
    params,
    preview
      ? {
          stega: true,
          perspective: 'drafts',
          useCdn: false,
          token,
          next: {
            revalidate: 0,
            ...next,
          },
        }
      : {
          perspective: 'published',
          useCdn: true,
          next: {
            revalidate: 3600, // every hour
            ...next,
            tags: prodTags,
          },
        },
  )
}

export const { sanityFetch, SanityLive } = defineLive({
  client,
  serverToken: token,
  browserToken: token,
})

type SanityFetchArgs = Parameters<typeof sanityFetch>[0] & {
  next?: SanityNextOptions
}

export async function fetchSanityLive<T = unknown>(args: SanityFetchArgs) {
  const preview = dev || (await draftMode()).isEnabled

  const { data } = await sanityFetch({
    ...args,
    perspective: preview ? 'drafts' : 'published',
  })

  return data as T
}

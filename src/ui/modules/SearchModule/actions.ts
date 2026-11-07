'use server'

import { fetchSanityLive } from '@/sanity/lib/fetch'
import { SEARCH_QUERY } from '@/sanity/queries/search.groq'
import type { SEARCH_QUERY_RESULT } from '@/sanity/sanity.types'
import type { SearchScope } from './store'

export async function search({
  query,
  scope,
  path,
}: {
  query: string
  scope: SearchScope
  path?: string
}) {
  return fetchSanityLive<SEARCH_QUERY_RESULT>({
    query: SEARCH_QUERY,
    params: {
      searchQuery: `*${query}*`,
      scope: scope ?? 'all',
      path: path ?? '',
    },
  })
}

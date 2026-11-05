'use server'

import { groq } from 'next-sanity'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import type { SearchResults, SearchScope } from './store'

const SCOPE_MAP = {
  pages: groq`_type == 'page'`,
  path: groq`
		_type == 'page' &&
		metadata.slug.current match $path &&
		!(metadata.slug.current in ['404'])
	`,
  'blog posts': groq`_type == 'blog.post'`,
  all: groq`
		_type in ['page', 'blog.post'] &&
		!(metadata.slug.current in ['404'])
	`,
} as const

export async function search({
  query,
  scope,
  path,
}: {
  query: string
  scope: SearchScope
  path?: string
}) {
  const scopeQuery = SCOPE_MAP[scope as keyof typeof SCOPE_MAP] || SCOPE_MAP.all

  return fetchSanityLive<SearchResults>({
    query: groq`*[
			${scopeQuery} &&
			[
				body[].children[].text,
				modules[].content[].children[].text,
				modules[].intro[].children[].text,
				title,
				metadata.title,
				metadata.description
			] match $searchQuery
		]{
			_id,
			_type,
			title,
			metadata
		}`,
    params: {
      searchQuery: `*${query}*`,
      path,
    },
  })
}

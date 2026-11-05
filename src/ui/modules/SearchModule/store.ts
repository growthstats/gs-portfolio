import { useQueryState } from 'nuqs'
import { create } from 'zustand'
import { search } from './actions'

export type SearchScope = 'all' | 'pages' | 'path' | 'blog posts' | undefined

export type SearchResults = Sanity.PageBase[]

export const useQuery = () => {
  const [query, setQuery] = useQueryState('query', {
    defaultValue: '',
  })

  return { query, setQuery }
}

export const searchStore = create<{
  loading: boolean
  setLoading: (loading: boolean) => void
  results: SearchResults
  setResults: (results: SearchResults) => void
}>((set) => ({
  loading: false,
  setLoading: (loading) => set({ loading }),
  results: [],
  setResults: (results) => set({ results }),
}))

export async function handleSearch({
  query,
  scope,
  path,
  setQuery,
  setLoading,
  setResults,
}: {
  query: string
  scope: SearchScope
  path?: string
  setQuery: (query: string) => void
  setLoading: (loading: boolean) => void
  setResults: (results: SearchResults) => void
}) {
  if (!query) setResults([])

  setQuery(query)
  setLoading(true)
  setResults([])

  const results = await search({ query, scope, path })

  setLoading(false)
  setResults(results)
}

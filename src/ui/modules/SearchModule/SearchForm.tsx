'use client'

import { useQuery, searchStore, handleSearch, type SearchScope } from './store'
import { cn, debounce } from '@/lib/utils'
import { VscSearch } from 'react-icons/vsc'
import Loading from '@/ui/Loading'
import resolveUrl from '@/lib/resolveUrl'
import SearchGoogle from './SearchGoogle'
import css from './SearchForm.module.css'
import { useDictionary, useLang } from '@/i18n/DictionaryProvider'
import { plural } from '@/i18n/format'

const PLACEHOLDERS = {
  all: 'all',
  pages: 'pages',
  path: 'pages',
  'blog posts': 'blogPosts',
} as const satisfies Record<NonNullable<SearchScope>, string>

/**
 * @note Remember to wrap this component in a Suspense
 */
export default function SearchForm({
  className,
  scope,
  path,
  ...props
}: Partial<{
  scope: SearchScope
  path: string
}> &
  React.ComponentProps<'search'>) {
  const { query, setQuery } = useQuery()
  const { loading, setLoading, results, setResults } = searchStore()
  const lang = useLang()
  const { search } = useDictionary()

  return (
    <search className={cn(css.root, 'relative', className)} {...props}>
      <label className="relative z-[2] flex items-center gap-2 input focus-within:border-ink/50">
        <VscSearch />

        <input
          className="grow outline-none"
          name="query"
          type="search"
          placeholder={search.placeholder[PLACEHOLDERS[scope ?? 'all'] ?? 'all']}
          defaultValue={query}
          onChange={debounce((e: React.ChangeEvent<HTMLInputElement>) =>
            handleSearch({
              query: e.target.value,
              scope,
              path,
              setQuery,
              setLoading,
              setResults,
            }),
          )}
        />
      </label>

      {query && (
        <div className={cn(css.results, 'absolute inset-x-0 top-full z-[1] anim-fade-to-b')}>
          <div className="mt-1 max-h-[20em] space-y-2 overflow-y-auto rounded border border-ink/10 bg-canvas py-2 shadow-md frosted-glass *:px-3">
            {loading ? (
              <Loading className="justify-center p-4 text-sm text-ink/50">
                {search.searching}
              </Loading>
            ) : (
              <>
                <p className="text-center text-sm text-ink/50">
                  <span className="line-clamp-1">
                    {plural(lang, results.length, search.resultsFor)}{' '}
                    <output>&quot;{query}&quot;</output>
                  </span>
                </p>

                {results.length > 0 && (
                  <ul>
                    {results.map((result) => (
                      <li key={result._id}>
                        <a
                          className="group flex gap-2 py-px"
                          href={
                            resolveUrl(result, { base: false, language: lang }) +
                            `#:~:text=${encodeURIComponent(query)}`
                          }
                        >
                          <span className="line-clamp-1 grow group-hover:underline">
                            {result.title || result.metadata?.title}
                          </span>

                          <small className="shrink-0 text-xs technical text-accent/50">
                            {result._type === 'blog.post' ? search.typeBlog : search.typePage}
                          </small>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}

                <SearchGoogle query={query} scope={scope} path={path} />
              </>
            )}
          </div>
        </div>
      )}
    </search>
  )
}

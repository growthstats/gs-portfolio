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
  const placeholder =
    scope === 'pages' || scope === 'path'
      ? search.placeholder.pages
      : scope === 'blog posts'
        ? search.placeholder.blogPosts
        : search.placeholder.all

  return (
    <search className={cn(css.root, 'relative', className)} {...props}>
      <label className="input focus-within:border-ink/50 relative z-[2] flex items-center gap-2">
        <VscSearch />

        <input
          className="grow outline-none"
          name="query"
          type="search"
          placeholder={placeholder}
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
        <div className={cn(css.results, 'anim-fade-to-b absolute inset-x-0 top-full z-[1]')}>
          <div className="frosted-glass bg-canvas border-ink/10 mt-1 max-h-[20em] space-y-2 overflow-y-auto rounded border py-2 shadow-md *:px-3">
            {loading ? (
              <Loading className="text-ink/50 justify-center p-4 text-sm">
                {search.searching}
              </Loading>
            ) : (
              <>
                <p className="text-ink/50 text-center text-sm">
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
                          href={resolveUrl(result, { base: false }) + `#:~:text=${query}`}
                        >
                          <span className="line-clamp-1 grow group-hover:underline">
                            {result.title || result.metadata.title}
                          </span>

                          <small className="technical text-accent/50 shrink-0 text-xs">
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

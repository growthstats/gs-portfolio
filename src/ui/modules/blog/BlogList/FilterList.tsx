import { Suspense } from 'react'
import Filter from './Filter'
import { cn } from '@/lib/utils'
import { getDictionary } from '@/i18n'
import type { Lang } from '@/lib/i18n'

/** Filters by the categories the listed posts show. */
export default function FilterList({ lang, posts }: { lang: Lang; posts: Sanity.BlogPost[] }) {
  const { blog } = getDictionary(lang)

  const categories = [
    ...new Map(
      posts
        .flatMap((post) => post.categories ?? [])
        .filter(Boolean)
        .map((category) => [category._id, category]),
    ).values(),
  ].sort((a, b) => a.title.localeCompare(b.title))

  return (
    <fieldset>
      <legend className="sr-only">{blog.filterByCategory}</legend>

      <div
        aria-label={blog.categories}
        className={cn(
          // container padding + safe scroll area
          'w-full px-2 py-1',
        )}
      >
        <div
          className={cn(
            // horizontal layout + auto scroll
            'flex items-center gap-2 overflow-x-auto md:gap-3',
            // smooth mobile scroll
            'touch-pan-x scroll-smooth',
            // prevent scrollbars from overlapping layout
            'pb-1',
            // hide scrollbar visually but keep accessibility (optional but clean)
            '[&::-webkit-scrollbar]:h-1.5',
            '[&::-webkit-scrollbar-thumb]:rounded-full',
            '[&::-webkit-scrollbar-thumb]:bg-neutral-300/40',
            'dark:[&::-webkit-scrollbar-thumb]:bg-neutral-700/40',
          )}
        >
          <Suspense>
            <Filter value="All" />

            {categories.map((category) => (
              <Filter
                key={category._id ?? category.title}
                label={category.title}
                value={category.slug?.current ?? category.title}
              />
            ))}
          </Suspense>
        </div>
      </div>
    </fieldset>
  )
}

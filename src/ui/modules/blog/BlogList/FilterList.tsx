import { fetchSanityLive } from '@/sanity/lib/fetch'
import { groq } from 'next-sanity'
import { Suspense } from 'react'
import Filter from './Filter'
import { cn } from '@/lib/utils'
import { IN_LANGUAGE, localizedRefs } from '@/sanity/lib/localized'
import type { Lang } from '@/lib/i18n'

export default async function FilterList({ lang }: { lang: Lang }) {
  const categories = await fetchSanityLive<Sanity.BlogCategory[]>({
    // Categories in `lang` that a listed post shows, whichever language the post references.
    query: groq`*[
      _type == 'blog.category'
      && ${IN_LANGUAGE}
      && count(*[_type == 'blog.post' && ${IN_LANGUAGE} && ^._id in ${localizedRefs('categories')}._id]) > 0
    ]|order(title)`,
    params: { lang },
  })

  if (!categories) return null

  return (
    <fieldset>
      <legend className="sr-only">Filter by category</legend>

      <div
        aria-label="Blog categories"
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
            <Filter label="All" value="All" />

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

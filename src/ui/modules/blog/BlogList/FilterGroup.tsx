'use client'

import { cn } from '@/lib/utils'
import { useDictionary } from '@/i18n/DictionaryProvider'

/** The labelled, horizontally scrolling row that holds the category filters. */
export default function FilterGroup({ children }: { children: React.ReactNode }) {
  const { blog } = useDictionary()

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
          {children}
        </div>
      </div>
    </fieldset>
  )
}

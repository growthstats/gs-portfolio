// src/ui/modules/blog/BlogList/Filter.tsx
'use client'

import { useBlogFilters } from '../store'
import { usePageState } from '@/lib/usePagination'
import Category from '../Category'
import { cn } from '@/lib/utils'

export default function Filter({
  label,
  value = 'All',
}: {
  label: string
  value?: 'All' | string
}) {
  const { category, setCategory } = useBlogFilters()
  const { setPage } = usePageState()

  const isActive = category === value

  return (
    <button
      type="button"
      aria-pressed={isActive}
      className={cn(
        'inline-flex min-w-max items-center gap-2 rounded-3xl px-3 py-1 transition select-none',
        'shadow-[var(--shadow-badge)]',
        isActive
          ? 'bg-gray-900 text-white shadow-none'
          : 'border border-transparent bg-transparent hover:border-neutral-200',
        'flex-shrink-0',
      )}
      onClick={() => {
        setCategory(value)
        setPage(1)
      }}
    >
      <Category label={label} />
    </button>
  )
}

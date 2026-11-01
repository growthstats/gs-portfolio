'use client'

import { useBlogFilters } from '../store'
import { usePageState } from '@/lib/usePagination'
import Category from '../Category'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useDictionary } from '@/i18n/DictionaryProvider'

export default function Filter({
  label,
  value = 'All',
}: Readonly<{
  /** Defaults to the "All" label. */
  label?: string
  value?: 'All' | string
}>) {
  const { blog } = useDictionary()
  const { category, setCategory } = useBlogFilters()
  const { setPage } = usePageState()

  const isActive = category === value

  return (
    <Button
      type="button"
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      aria-pressed={isActive}
      className={cn('min-w-max flex-shrink-0 rounded-3xl', '!h-auto px-3 py-1 shadow-none')}
      onClick={() => {
        setCategory(value)
        setPage(1)
      }}
    >
      <Category label={label ?? blog.allCategories} />
    </Button>
  )
}

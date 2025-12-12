'use client'

import { useBlogFilters } from '../store'
import { usePageState } from '@/lib/usePagination'
import Category from '../Category'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

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
    <Button
      type="button"
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      aria-pressed={isActive}
      className={cn(
        'min-w-max flex-shrink-0 rounded-3xl',
        '!h-auto px-3 py-1',
        isActive && 'bg-gray-900 text-white shadow-none',
      )}
      onClick={() => {
        setCategory(value)
        setPage(1)
      }}
    >
      <Category label={label} />
    </Button>
  )
}

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import LocalizedLink from '@/ui/LocalizedLink'
import { filterHref } from './filterHref'

/** The category fields the blog reads. */
export type CategoryValue = { title?: string | null; slug?: { current?: string } | null }

export default function Category({
  value,
  label,
  linked,
}: {
  value?: CategoryValue | null
  label?: string
  linked?: boolean
}) {
  const props = {
    className: cn('before:text-current/50 hover:*:underline', !linked && 'pointer-events-none'),
    children: <span>{label || value?.title}</span>,
  }

  return linked ? (
    <Badge variant={'secondary'}>
      <LocalizedLink href={filterHref('category', value?.slug?.current)} {...props} />
    </Badge>
  ) : (
    <div {...props} />
  )
}

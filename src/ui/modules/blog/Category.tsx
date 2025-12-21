import Link from 'next/link'
import { BLOG_DIR } from '@/lib/env'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export default function Category({
  value,
  label,
  linked,
}: {
  value?: Sanity.BlogCategory
  label?: string
  linked?: boolean
}) {
  const props = {
    className: cn('before:text-current/50 hover:*:underline', !linked && 'pointer-events-none'),
    children: <span>{label || value?.title}</span>,
  }

  return linked ? (
    <Badge variant={'secondary'}>
      <Link
        href={{
          pathname: `/${BLOG_DIR}`,
          query: { category: value?.slug.current },
        }}
        {...props}
      />
    </Badge>
  ) : (
    <div {...props} />
  )
}

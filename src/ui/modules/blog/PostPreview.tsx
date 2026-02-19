import Link from 'next/link'

import resolveUrl from '@/lib/resolveUrl'
import { cn } from '@/lib/utils'
import Date from '@/ui/Date'
import { Img } from '@/ui/Img'
import Heading from '@/ui/Heading'
import Category from './Category'
import Authors from './Authors'

export default function PostPreview({
  post,
  skeleton,
}: Readonly<{
  post?: Sanity.BlogPost
  skeleton?: boolean
}>) {
  if (!post && !skeleton) return null

  const primaryCategory = post?.categories?.[0]
  const displayTitle = post?.title || post?.metadata.title

  return (
    <figure
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-2xl p-3 shadow-(--shadow-card)',
      )}
      aria-hidden={skeleton ? true : undefined}
    >
      {/* IMAGE CONTAINER */}
      <div className="relative">
        <Img
          className="aspect-video w-full rounded-2xl object-cover shadow-(--shadow-card) transition-all group-hover:scale-105 group-hover:brightness-110"
          image={post?.metadata.image}
          width={520}
          alt={displayTitle}
        />

        {/* CATEGORY PILL */}
        <div className="absolute top-3 right-3 z-10">
          {primaryCategory ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-medium shadow shadow-black/25">
              <Category value={primaryCategory} linked />
            </span>
          ) : skeleton ? (
            <span className="skeleton-2 inline-block h-6 w-20 rounded-full" />
          ) : null}
        </div>
      </div>

      {/* META ROW */}
      <div className="text-ink/80 mt-4 flex items-center justify-between gap-4 text-sm">
        <Authors authors={post?.authors} skeleton={skeleton} className="flex items-center gap-2" />
        <div className="text-right">
          {skeleton ? (
            <span className="skeleton-2 inline-block h-4 w-16 rounded-full" />
          ) : (
            <Date value={post?.publishDate} />
          )}
        </div>
      </div>

      {/* TITLE */}
      <Heading as="h3" variant="h4" className={cn('mt-4 rounded-lg', skeleton && 'skeleton-2')}>
        <Link className="m-1 block p-1" href={resolveUrl(post, { base: false })}>
          {displayTitle}
        </Link>
      </Heading>
    </figure>
  )
}

import { Img } from '@/ui/Img'
import Link from 'next/link'
import resolveUrl from '@/lib/resolveUrl'
import Authors from './Authors'
import Date from '@/ui/Date'
import Categories from './Categories'
import { cn } from '@/lib/utils'

export default function PostPreview({
  post,
  skeleton,
}: {
  post?: Sanity.BlogPost
  skeleton?: boolean
}) {
  if (!post && !skeleton) return null

  return (
    <>
      <div
        className={cn(
          'group flex h-full flex-col overflow-hidden rounded-2xl p-3 shadow-(--shadow-badge)',
        )}
        aria-hidden={skeleton ? true : undefined}
      >
        {/* IMAGE CONTAINER - Add relative positioning here */}
        <div className="relative">
          <Img
            className="aspect-video w-full rounded-2xl object-cover shadow-(--shadow-badge)"
            image={post?.metadata.image}
            width={520}
            alt={post?.metadata.title}
          />

          {/* DATE PILL - Positioned relative to image container */}
          <div className="absolute top-3 right-3 z-0">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3 py-1 text-xs font-medium shadow">
              <Date value={post?.publishDate} />
            </span>
          </div>
        </div>

        {/* TITLE - Cleaned up styling */}
        <h3
          className={cn(
            'mt-3 mt-6 rounded-lg leading-tight font-semibold shadow-(--shadow-badge)',
            skeleton && 'skeleton-2',
          )}
        >
          <Link
            className="m-1 block p-1 transition-colors duration-200 group-hover:text-blue-600"
            href={resolveUrl(post, { base: false })}
          >
            {post?.metadata.title}
          </Link>
        </h3>
      </div>
    </>
  )
}

import Link from 'next/link'
import resolveUrl from '@/lib/resolveUrl'
import { Img } from '@/ui/Img'
import Date from '@/ui/Date'
import Categories from './Categories'
import Authors from './Authors'

export default function PostPreviewLarge({ post }: { post: Sanity.BlogPost }) {
  if (!post) return null

  return (
    <Link href={resolveUrl(post, { base: false })} className="group block">
      <article className="relative overflow-hidden rounded-3xl bg-white shadow-(--shadow-badge) transition-all hover:shadow-lg">
        {/* IMAGE */}
        <div className="relative aspect-video overflow-hidden rounded-3xl">
          <Img
            className="size-full object-cover transition-all group-hover:scale-105 group-hover:brightness-110"
            image={post.metadata.image}
            width={1600}
            alt={post.metadata.title}
            loading="eager"
          />

          {/* DARK GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

          {/* TOP RIGHT DATE */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs shadow backdrop-blur-sm">
              <Date value={post.publishDate} />
            </span>
          </div>

          {/* TOP LEFT FEATURED BADGE */}
          {post.featured && (
            <span className="absolute top-4 left-4 rounded-full bg-amber-400/90 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase shadow">
              ⭐ Featured
            </span>
          )}

          {/* BOTTOM CONTENT*/}
          <div className="absolute inset-x-0 bottom-0 flex flex-col px-4 pt-12 pb-4 text-white sm:px-6 sm:pb-6">
            <h2 className="text-xl leading-tight font-bold drop-shadow-md sm:text-3xl">
              {post.metadata.title}
            </h2>

            <p className="mt-2 line-clamp-3 max-w-full text-sm text-white/90 drop-shadow-sm sm:text-base">
              {post.metadata.description}
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3">
              <Categories
                categories={post.categories}
                className="rounded-lg !text-white shadow-(--shadow-badge)"
              />
            </div>

            {post.authors?.length > 0 && (
              <Authors
                authors={post.authors}
                className="mt-3 flex items-center gap-3 text-white sm:gap-4"
              />
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}

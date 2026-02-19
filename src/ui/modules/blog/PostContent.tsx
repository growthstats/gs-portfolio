import moduleProps from '@/lib/moduleProps'
import Date from '@/ui/Date'
import Categories from './Categories'
import Authors from './Authors'
import ReadTime from './ReadTime'
import TableOfContents from '@/ui/modules/RichtextModule/TableOfContents'
import Content from '@/ui/modules/RichtextModule/Content'
import { cn } from '@/lib/utils'
import css from './PostContent.module.css'
import { Img } from '@/ui/Img'
import Social from '@/ui/Social'
import { BASE_URL, BLOG_DIR } from '@/lib/env'

export default function PostContent({
  post,
  ...props
}: { post?: Sanity.BlogPost } & Sanity.Module) {
  if (!post) return null

  const showTOC = !post.hideTableOfContents || !!post.headings?.length
  const displayTitle = post.title || post.metadata.title
  const postSlug = post.metadata?.slug?.current
  const blogPath = postSlug ? `/${BLOG_DIR}/${postSlug}` : ''
  const localizedPath = post.language ? `/${post.language}${blogPath}` : blogPath
  const shareUrl = localizedPath ? `${BASE_URL}${localizedPath}` : BASE_URL

  return (
    <article {...moduleProps(props)}>
      <header className="section space-y-6 text-center">
        <h1 className="h1 text-balance">{displayTitle}</h1>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Date value={post.publishDate} />
          <Categories className="flex flex-wrap gap-x-2" categories={post.categories} linked />
          <ReadTime value={post.readTime} />
        </div>

        <div className="mx-auto flex max-w-[710px] justify-between">
          {!!post.authors?.length && (
            <Authors
              className="flex flex-wrap items-center justify-center gap-4"
              authors={post.authors}
              linked
            />
          )}

          <Social className="justify-center gap-2" shareUrl={shareUrl} shareText={displayTitle} />
        </div>

        {/* Image container */}
        <figure className={cn(css.headerImg, 'relative mx-auto max-w-[710px] rounded-xl')}>
          <picture>
            <Img
              image={post.metadata.image}
              className="relative aspect-video rounded-xl object-cover"
            />
          </picture>
        </figure>
      </header>

      <div className={cn('section grid gap-8', showTOC && 'lg:grid-cols-[auto_1fr]')}>
        {showTOC && (
          <aside className="lg:sticky-below-header mx-auto w-full max-w-lg self-start [--offset:1rem] lg:w-3xs">
            <TableOfContents headings={post.headings} />
          </aside>
        )}

        <Content value={post.body} className={cn(css.body, 'ml-0 grid max-w-[780px]')}>
          <hr />
        </Content>
      </div>
    </article>
  )
}

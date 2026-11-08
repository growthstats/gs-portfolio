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
import { BASE_URL } from '@/lib/env'
import resolveUrl from '@/lib/resolveUrl'
import Faq from '@/ui/modules/Faq'
import type { ModuleProps } from '@/sanity/queries/page.groq'

export default function PostContent({ lang, post, ...props }: ModuleProps<'blog-post-content'>) {
  if (!post) return null

  const showTOC = !post.hideTableOfContents || !!post.headings?.length
  const displayTitle = post.title || post.metadata?.title
  const shareUrl = post.metadata?.slug?.current
    ? BASE_URL + resolveUrl(post, { base: false, language: lang })
    : BASE_URL

  return (
    <article {...moduleProps(props)}>
      <header className="section space-y-6 text-center">
        <h1 className="h1 text-balance">{displayTitle}</h1>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          <Date value={post.publishDate} />
          <Categories className="flex flex-wrap gap-x-2" categories={post.categories} linked />
          <ReadTime lang={lang} value={post.readTime} />
        </div>

        <div className="mx-auto flex max-w-[710px] justify-between">
          {!!post.authors?.length && (
            <Authors
              className="flex flex-wrap items-center justify-center gap-4"
              authors={post.authors}
              linked
            />
          )}

          <Social
            lang={lang}
            className="justify-center gap-2"
            shareUrl={shareUrl}
            shareText={displayTitle}
          />
        </div>

        {/* Image container */}
        <figure className={cn(css.headerImg, 'relative mx-auto max-w-[710px] rounded-xl')}>
          <picture>
            <Img
              image={post.metadata?.image}
              className="relative aspect-video rounded-xl object-cover"
            />
          </picture>
        </figure>
      </header>

      <div className={cn('section grid gap-8', showTOC && 'lg:grid-cols-[auto_1fr]')}>
        {showTOC && (
          <aside className="mx-auto w-full max-w-lg self-start [--offset:1rem] lg:sticky-below-header lg:w-3xs">
            <TableOfContents headings={post.headings} />
          </aside>
        )}

        <div className="space-y-12">
          <Content value={post.body ?? []} className={cn(css.body, 'ml-0 grid max-w-[780px]')}>
            <hr />
          </Content>

          {post.faq && <Faq {...post.faq} />}
        </div>
      </div>
    </article>
  )
}

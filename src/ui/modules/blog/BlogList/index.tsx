import { stegaClean } from 'next-sanity'
import { Suspense } from 'react'

import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { BLOG_LIST_QUERY } from '@/sanity/queries/blog.groq'
import type { BLOG_LIST_QUERY_RESULT } from '@/sanity/sanity.types'
import FilterList from '@/ui/modules/blog/BlogList/FilterList'
import Pretitle from '@/ui/Pretitle'
import CTAList from '@/ui/CTAList'
import BlogListSchema from '@/ui/BlogListSchema'

import PostPreview from '../PostPreview'
import List from './List'
import PortableText from '@/ui/PortableText'
import type { ModuleProps } from '@/sanity/queries/page.groq'

export default async function BlogList({
  lang,
  pretitle,
  intro,
  ctas,
  layout,
  limit,
  showFeaturedPostsFirst,
  displayFilters,
  filteredCategory,
  ...props
}: ModuleProps<'blog-list'>) {
  const posts = await fetchSanityLive<BLOG_LIST_QUERY_RESULT>({
    query: BLOG_LIST_QUERY,
    params: {
      lang,
      filteredCategory: filteredCategory?._id || '',
      featuredFirst: !!showFeaturedPostsFirst,
      last: limit ? limit - 1 : -1,
    },
  })

  const listClassName = cn(
    'items-stretch gap-x-8 gap-y-12',
    stegaClean(layout) === 'grid'
      ? 'grid md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]'
      : 'carousel max-xl:full-bleed md:overflow-fade-r pb-4 [--size:320px] max-xl:px-4',
  )

  return (
    <section className="section space-y-8" {...moduleProps(props)}>
      <BlogListSchema posts={posts} />

      {intro && (
        <header className="richtext">
          <Pretitle>{pretitle}</Pretitle>
          {intro && <PortableText value={intro ?? []} />}
        </header>
      )}

      {displayFilters && !filteredCategory && <FilterList lang={lang} posts={posts} />}

      <Suspense
        fallback={
          <ul className={listClassName}>
            {Array.from({ length: limit ?? 6 }).map((_, i) => (
              <li key={i}>
                <PostPreview skeleton />
              </li>
            ))}
          </ul>
        }
      >
        <List posts={posts} className={listClassName} />
      </Suspense>

      {!!ctas?.length && <CTAList ctas={ctas} className="justify-center" />}
    </section>
  )
}

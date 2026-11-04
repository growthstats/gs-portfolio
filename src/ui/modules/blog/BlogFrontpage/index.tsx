import { stegaClean } from 'next-sanity'
import { Suspense } from 'react'

import type { Lang } from '@/lib/i18n'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { BLOG_FRONTPAGE_QUERY } from '@/sanity/queries/blog.groq'
import type { BLOG_FRONTPAGE_QUERY_RESULT } from '@/sanity/sanity.types'

import FilterList from '../BlogList/FilterList'
import PostPreview from '../PostPreview'
import PostPreviewLarge from '../PostPreviewLarge'
import Paginated from './Paginated'
import sortFeaturedPosts from './sortFeaturedPosts'
import BlogListSchema from '@/ui/BlogListSchema'

export default async function BlogFrontpage({
  lang,
  mainPost,
  showFeaturedPostsFirst,
  itemsPerPage,
}: Readonly<
  { lang: Lang } & Partial<{
    mainPost: 'recent' | 'featured'
    showFeaturedPostsFirst: boolean
    itemsPerPage: number
  }>
>) {
  const posts = await fetchSanityLive<BLOG_FRONTPAGE_QUERY_RESULT>({
    query: BLOG_FRONTPAGE_QUERY,
    params: { lang },
  })

  const [firstPost, ...otherPosts] =
    stegaClean(mainPost) === 'featured' ? sortFeaturedPosts(posts) : posts

  return (
    <section className="section space-y-8">
      <BlogListSchema posts={posts} />

      <PostPreviewLarge lang={lang} post={firstPost} />

      <hr />

      <FilterList lang={lang} posts={posts} />

      <Suspense
        fallback={
          <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
            {Array.from({ length: itemsPerPage ?? 6 }).map((_, i) => (
              <li key={i}>
                <PostPreview skeleton />
              </li>
            ))}
          </ul>
        }
      >
        <Paginated
          posts={sortFeaturedPosts(otherPosts, showFeaturedPostsFirst)}
          itemsPerPage={itemsPerPage}
        />
      </Suspense>
    </section>
  )
}

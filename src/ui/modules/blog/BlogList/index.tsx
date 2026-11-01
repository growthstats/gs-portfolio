import { groq, stegaClean } from 'next-sanity'
import { Suspense } from 'react'

import { DEFAULT_LANG, type Lang } from '@/lib/i18n'
import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { IMAGE_QUERY } from '@/sanity/lib/queries'
import { IN_LANGUAGE, localizedRefs } from '@/sanity/lib/localized'
import FilterList from '@/ui/modules/blog/BlogList/FilterList'
import Pretitle from '@/ui/Pretitle'
import CTAList from '@/ui/CTAList'
import BlogListSchema from '@/ui/BlogListSchema'

import PostPreview from '../PostPreview'
import List from './List'
import PortableText from '@/ui/PortableText'

export default async function BlogList({
  lang = DEFAULT_LANG,
  pretitle,
  intro,
  ctas,
  layout,
  limit,
  showFeaturedPostsFirst,
  displayFilters,
  filteredCategory,
  ...props
}: Partial<{
  pretitle: string
  intro: Sanity.PortableText
  ctas: Sanity.CTA[]
  layout: 'grid' | 'carousel'
  limit: number
  showFeaturedPostsFirst: boolean
  displayFilters: boolean
  filteredCategory: Sanity.BlogCategory
  /** Set by the module query. */
  lang: Lang
}> &
  Sanity.Module) {
  const posts = await fetchSanityLive<Sanity.BlogPost[]>({
    query: groq`
			*[
				_type == 'blog.post'
				&& ${IN_LANGUAGE}
				${!!filteredCategory ? `&& $filteredCategory in ${localizedRefs('categories')}._id` : ''}
			]|order(
				${showFeaturedPostsFirst ? 'featured desc, ' : ''}
				publishDate desc
			)
			${limit ? `[0...${limit}]` : ''}
			{
				...,
				'categories': ${localizedRefs('categories')},
				authors[]->,
				metadata{
					...,
					image { ${IMAGE_QUERY} }
				}
			}
		`,
    params: {
      lang,
      filteredCategory: filteredCategory?._id || '',
      limit: limit ?? 0,
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

      {displayFilters && !filteredCategory && <FilterList posts={posts} />}

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

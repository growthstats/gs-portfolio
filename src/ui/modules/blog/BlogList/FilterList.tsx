import { fetchSanityLive } from '@/sanity/lib/fetch'
import { groq } from 'next-sanity'
import { Suspense } from 'react'
import Filter from './Filter'
import FilterGroup from './FilterGroup'

export default async function FilterList() {
  const categories = await fetchSanityLive<Sanity.BlogCategory[]>({
    query: groq`*[
      _type == 'blog.category' &&
      count(*[_type == 'blog.post' && references(^._id)]) > 0
    ]|order(title)`,
  })

  if (!categories) return null

  return (
    <FilterGroup>
      <Suspense>
        <Filter value="All" />

        {categories.map((category) => (
          <Filter
            key={category._id ?? category.title}
            label={category.title}
            value={category.slug?.current ?? category.title}
          />
        ))}
      </Suspense>
    </FilterGroup>
  )
}

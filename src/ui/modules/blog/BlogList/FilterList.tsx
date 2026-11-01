import { Suspense } from 'react'
import Filter from './Filter'
import FilterGroup from './FilterGroup'

/** Filters by the categories the listed posts show. */
export default function FilterList({ posts }: { posts: Sanity.BlogPost[] }) {
  const categories = [
    ...new Map(
      posts
        .flatMap((post) => post.categories ?? [])
        .filter(Boolean)
        .map((category) => [category._id, category]),
    ).values(),
  ].sort((a, b) => a.title.localeCompare(b.title))

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

'use client'

import PostPreview from '../PostPreview'
import { useBlogFilters } from '../store'
import { filterPosts } from './filterPosts'

export default function List({
  posts,
  ...props
}: {
  posts: Sanity.BlogPost[]
} & React.ComponentProps<'ul'>) {
  const filtered = filterPosts(posts, useBlogFilters())

  if (!filtered.length) {
    return <div>No posts found...</div>
  }

  return (
    <ul {...props}>
      {filtered?.map((post) => (
        <li className="anim-fade" key={post._id}>
          <PostPreview post={post} />
        </li>
      ))}
    </ul>
  )
}

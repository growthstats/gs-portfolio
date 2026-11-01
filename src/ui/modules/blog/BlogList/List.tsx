'use client'

import PostPreview from '../PostPreview'
import { useBlogFilters } from '../store'
import { filterPosts } from './filterPosts'
import { useDictionary } from '@/i18n/DictionaryProvider'

export default function List({
  posts,
  ...props
}: {
  posts: Sanity.BlogPost[]
} & React.ComponentProps<'ul'>) {
  const filtered = filterPosts(posts, useBlogFilters())
  const { blog } = useDictionary()

  if (!filtered.length) {
    return <div>{blog.noPosts}</div>
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

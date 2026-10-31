import type { useBlogFilters } from '../store'

export function filterPosts(
  posts: Sanity.BlogPost[],
  { category, author }: Pick<ReturnType<typeof useBlogFilters>, 'category' | 'author'>,
) {
  return posts.filter(
    (post) =>
      (category === 'All' || post.categories?.some(({ slug }) => slug?.current === category)) &&
      (!author || post.authors?.some(({ slug }) => slug?.current === author)),
  )
}

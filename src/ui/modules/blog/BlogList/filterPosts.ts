export function filterPosts(
  posts: Sanity.BlogPost[],
  { category, author }: { category: string; author: string | null },
) {
  return posts.filter((post) => {
    if (category !== 'All' && author)
      return (
        post.authors?.some(({ slug }) => slug?.current === author) &&
        post.categories?.some(({ slug }) => slug?.current === category)
      )

    if (category !== 'All') return post.categories?.some(({ slug }) => slug?.current === category)

    if (author) return post.authors?.some(({ slug }) => slug?.current === author)

    return true
  })
}

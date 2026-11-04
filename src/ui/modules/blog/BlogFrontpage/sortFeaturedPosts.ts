import type { BlogPostPreview } from '@/sanity/queries/blog.groq'
export default function (posts: BlogPostPreview[], showFeaturedPostsFirst: boolean = true) {
  if (showFeaturedPostsFirst)
    return posts.sort((a, b) => (b.featured ? 1 : -1) - (a.featured ? 1 : -1))

  return posts
}

import resolveUrl from '@/lib/resolveUrl'
import { BASE_URL } from '@/lib/env'
import { stegaClean } from 'next-sanity'
import JsonLd from './JsonLd'

export default function BlogListSchema({ posts }: { posts: Sanity.BlogPost[] }) {
  const blogPost = (posts ?? [])
    .map((post) => {
      const url = resolveUrl(post)
      if (!url) return null

      const headline = stegaClean(post.title || post.metadata?.title)
      const description = stegaClean(post.metadata?.description)
      const image = post.metadata?.ogimage
      const datePublished = post.publishDate || post._createdAt
      const dateModified = post._updatedAt || datePublished

      const authors = (post.authors ?? [])
        .map((a) => stegaClean(a?.name))
        .filter(Boolean)
        .map((name) => ({ '@type': 'Person', name }))

      return {
        '@type': 'BlogPosting',
        headline,
        url,
        mainEntityOfPage: { '@type': 'WebPage', '@id': url },
        ...(description && { description }),
        ...(image && { image }),
        ...(datePublished && { datePublished }),
        ...(dateModified && { dateModified }),
        ...(authors.length && { author: authors }),
        publisher: { '@id': `${BASE_URL}/#organization` },
      }
    })
    .filter(Boolean)

  if (!blogPost.length) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${BASE_URL}/blog#blog`,
    url: `${BASE_URL}/blog`,
    publisher: { '@id': `${BASE_URL}/#organization` },
    blogPost,
  }

  return <JsonLd schema={schema} />
}

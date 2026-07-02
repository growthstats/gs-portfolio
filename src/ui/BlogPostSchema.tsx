import resolveUrl from '@/lib/resolveUrl'
import { BASE_URL } from '@/lib/env'
import { stegaClean } from 'next-sanity'
import JsonLd from './JsonLd'

export default function BlogPostSchema({ post }: { post: Sanity.BlogPost }) {
  const url = resolveUrl(post)
  const headline = stegaClean(post.metadata?.title || post.title)
  const description = stegaClean(post.metadata?.description)
  const image = post.metadata?.ogimage
  const datePublished = post.publishDate || post._createdAt
  const dateModified = post._updatedAt || datePublished

  const authors = (post.authors ?? [])
    .map((a) => stegaClean(a?.name))
    .filter(Boolean)
    .map((name) => ({ '@type': 'Person', name }))

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    ...(description && { description }),
    ...(image && { image }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    ...(authors.length && { author: authors }),
    publisher: { '@id': `${BASE_URL}/#organization` },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  }

  return <JsonLd schema={schema} />
}

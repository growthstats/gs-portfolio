import { BASE_URL } from '@/lib/env'
import { canonicalUrl, documentLanguage, postAuthorNames, postDates } from '@/lib/seo'
import { stegaClean } from 'next-sanity'
import JsonLd from './JsonLd'
import type { BlogPost } from '@/sanity/queries/blog.groq'

export default function BlogPostSchema({ post }: { post: BlogPost }) {
  const url = canonicalUrl(post)
  const inLanguage = documentLanguage(post)
  const headline = stegaClean(post.metadata?.title || post.title)
  const description = stegaClean(post.metadata?.description)
  const image = post.metadata?.ogimage
  const { published: datePublished, modified: dateModified } = postDates(post)
  const authors = postAuthorNames(post).map((name) => ({ '@type': 'Person', name }))

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    inLanguage,
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

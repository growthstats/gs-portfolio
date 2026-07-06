import resolveUrl from '@/lib/resolveUrl'
import { stegaClean } from 'next-sanity'
import JsonLd from './JsonLd'

export default function BlogListSchema({ posts }: { posts: Sanity.BlogPost[] }) {
  const itemListElement = (posts ?? [])
    .map((post, i) => {
      const url = resolveUrl(post)
      if (!url) return null
      return {
        '@type': 'ListItem',
        position: i + 1,
        url,
        name: stegaClean(post.title || post.metadata?.title),
      }
    })
    .filter(Boolean)

  if (!itemListElement.length) return null

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement,
  }

  return <JsonLd schema={schema} />
}

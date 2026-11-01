import { BASE_URL } from '@/lib/env'
import { canonicalUrl, documentLanguage } from '@/lib/seo'
import { stegaClean } from 'next-sanity'
import JsonLd from './JsonLd'

export default function WebPageSchema({ page }: { page: Sanity.Page }) {
  const url = canonicalUrl(page)
  const name = stegaClean(page.metadata?.title || page.title)
  const description = stegaClean(page.metadata?.description)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url,
    ...(name && { name }),
    ...(description && { description }),
    inLanguage: documentLanguage(page),
    isPartOf: { '@id': `${BASE_URL}/#website` },
  }

  return <JsonLd schema={schema} />
}

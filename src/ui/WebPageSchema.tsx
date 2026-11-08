import { BASE_URL } from '@/lib/env'
import { canonicalUrl, documentLanguage } from '@/lib/seo'
import type { UrlSource } from '@/lib/resolveUrl'
import { stegaClean } from 'next-sanity'
import JsonLd from './JsonLd'

/** What the WebPage schema reads from a page. */
type WebPageSource = UrlSource & {
  title?: string | null
  language?: string | null
  metadata?: { title?: string | null; description?: string | null } | null
}

export default function WebPageSchema({ page }: { page: WebPageSource }) {
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

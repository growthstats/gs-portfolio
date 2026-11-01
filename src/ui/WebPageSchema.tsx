import { BASE_URL } from '@/lib/env'
import { buildAlternates } from '@/lib/seo'
import { stegaClean } from 'next-sanity'
import JsonLd from './JsonLd'

export default function WebPageSchema({ page }: { page: Sanity.Localized<Sanity.Page> }) {
  const { canonical, lang } = buildAlternates(page, BASE_URL)
  const name = stegaClean(page.metadata?.title || page.title)
  const description = stegaClean(page.metadata?.description)

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': canonical,
    url: canonical,
    ...(name && { name }),
    ...(description && { description }),
    inLanguage: lang,
    isPartOf: { '@id': `${BASE_URL}/#website` },
  }

  return <JsonLd schema={schema} />
}

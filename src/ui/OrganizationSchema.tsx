import { getSite } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { BASE_URL } from '@/lib/env'
import { stegaClean } from 'next-sanity'
import JsonLd from './JsonLd'

export default async function OrganizationSchema() {
  const site = await getSite()

  const name = stegaClean(site.title)
  const logoImage = site.logo?.image?.default || site.logo?.image?.dark
  const logo = logoImage ? urlFor(logoImage).url() : undefined

  const sameAs = (site.social?.items ?? [])
    .flatMap((item) => ('links' in item ? (item.links ?? []) : [item]))
    .map((link) => stegaClean((link as Sanity.Link).external))
    .filter((url): url is string => !!url && /^https?:\/\//.test(url))

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${BASE_URL}/#organization`,
        name,
        url: BASE_URL,
        ...(logo && { logo }),
        ...(sameAs.length && { sameAs }),
      },
      {
        '@type': 'WebSite',
        '@id': `${BASE_URL}/#website`,
        name,
        url: BASE_URL,
        publisher: { '@id': `${BASE_URL}/#organization` },
      },
    ],
  }

  return <JsonLd schema={schema} />
}

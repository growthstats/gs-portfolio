import { getSite } from '@/sanity/lib/queries'
import { urlFor } from '@/sanity/lib/image'
import { BASE_URL } from '@/lib/env'
import { stegaClean } from 'next-sanity'
import JsonLd from './JsonLd'

export default async function LocalBusinessSchema() {
  const site = await getSite()
  const b = site.localBusiness

  // Render nothing unless a physical address is configured.
  if (!b || !stegaClean(b.streetAddress)) return null

  const logoImage = site.logo?.image?.default || site.logo?.image?.dark
  const logo = logoImage ? urlFor(logoImage).url() : undefined

  const openingHours = (b.openingHours ?? [])
    .filter((h) => h?.days?.length && h?.opens && h?.closes)
    .map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: (h.days ?? []).map((d) => stegaClean(d)),
      opens: stegaClean(h.opens),
      closes: stegaClean(h.closes),
    }))

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${BASE_URL}/#localbusiness`,
    name: stegaClean(site.title),
    url: BASE_URL,
    ...(logo && { image: logo, logo }),
    ...(stegaClean(b.telephone) && { telephone: stegaClean(b.telephone) }),
    ...(stegaClean(b.email) && { email: stegaClean(b.email) }),
    ...(stegaClean(b.priceRange) && { priceRange: stegaClean(b.priceRange) }),
    address: {
      '@type': 'PostalAddress',
      streetAddress: stegaClean(b.streetAddress),
      ...(stegaClean(b.addressLocality) && {
        addressLocality: stegaClean(b.addressLocality),
      }),
      ...(stegaClean(b.addressRegion) && {
        addressRegion: stegaClean(b.addressRegion),
      }),
      ...(stegaClean(b.postalCode) && {
        postalCode: stegaClean(b.postalCode),
      }),
      ...(stegaClean(b.addressCountry) && {
        addressCountry: stegaClean(b.addressCountry),
      }),
    },
    ...(b.geo?.latitude != null &&
      b.geo?.longitude != null && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: b.geo.latitude,
          longitude: b.geo.longitude,
        },
      }),
    ...(openingHours.length && { openingHoursSpecification: openingHours }),
  }

  return <JsonLd schema={schema} />
}

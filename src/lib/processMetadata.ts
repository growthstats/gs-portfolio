import { BASE_URL, BLOG_DIR, vercelPreview } from './env'
import { buildAlternates } from './seo'
import type { Metadata } from 'next'

export default async function processMetadata(
  page: Sanity.Localized<Sanity.PageBase>,
): Promise<Metadata> {
  const { canonical, languages, locale, alternateLocales } = buildAlternates(page, BASE_URL)
  const { title, description, ogimage, noIndex } = page.metadata

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      locale,
      alternateLocale: alternateLocales,
      images: ogimage || `${BASE_URL}/api/og?title=${encodeURIComponent(title)}`,
    },
    robots: {
      index: noIndex || vercelPreview ? false : undefined,
    },
    alternates: {
      canonical,
      languages,
      // The feed stays English-only.
      types: {
        'application/rss+xml': `/${BLOG_DIR}/rss.xml`,
      },
    },
  }
}

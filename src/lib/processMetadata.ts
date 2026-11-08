import { stegaClean } from 'next-sanity'
import { BASE_URL, BLOG_DIR, vercelPreview } from './env'
import { buildAlternates, markdownUrl, postAuthorNames, postDates, type PostSeoSource } from './seo'
import type { Metadata } from 'next'

/** What page metadata is built from: `Sanity.Localized<Sanity.Page>`, or a TypeGen result. */
type MetadataSource = PostSeoSource & {
  _type: string
  language?: string | null
  translations: Sanity.TranslationLink[]
  metadata?: {
    slug?: { current?: string } | null
    title?: string | null
    description?: string | null
    ogimage?: string | null
    noIndex?: boolean | null
  } | null
}

/** `article` with dates and authors for blog posts, `website` for everything else. */
function openGraphType(page: MetadataSource) {
  if (page._type !== 'blog.post') return { type: 'website' } as const

  const { published, modified } = postDates(page)
  const authors = postAuthorNames(page)

  return {
    type: 'article',
    publishedTime: published,
    modifiedTime: modified,
    ...(authors.length && { authors }),
  } as const
}

export default async function processMetadata(page: MetadataSource): Promise<Metadata> {
  const { canonical, languages, locale, alternateLocales } = buildAlternates(page)
  const metadata = page.metadata
  const title = metadata?.title ?? undefined
  const description = metadata?.description ?? undefined
  const noIndex = metadata?.noIndex

  return {
    metadataBase: new URL(BASE_URL),
    title,
    description,
    openGraph: {
      ...openGraphType(page),
      url: canonical,
      title,
      description,
      locale,
      alternateLocale: alternateLocales,
      images: metadata?.ogimage || `${BASE_URL}/api/og?title=${encodeURIComponent(title ?? '')}`,
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
        // The page's Markdown copy, for LLM crawlers and agents (#138). Hidden pages have none.
        ...(!noIndex && {
          'text/markdown': markdownUrl(canonical, {
            isHome: stegaClean(metadata?.slug?.current) === 'index',
          }),
        }),
      },
    },
  }
}

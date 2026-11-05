import { stegaClean } from 'next-sanity'
import { BASE_URL, BLOG_DIR, vercelPreview } from './env'
import { buildAlternates, markdownUrl, postAuthorNames, postDates } from './seo'
import type { Metadata } from 'next'

const isBlogPost = (page: Sanity.PageBase): page is Sanity.BlogPost => page._type === 'blog.post'

/** `article` with dates and authors for blog posts, `website` for everything else. */
function openGraphType(page: Sanity.PageBase) {
  if (!isBlogPost(page)) return { type: 'website' } as const

  const { published, modified } = postDates(page)
  const authors = postAuthorNames(page)

  return {
    type: 'article',
    publishedTime: published,
    modifiedTime: modified,
    ...(authors.length && { authors }),
  } as const
}

export default async function processMetadata(
  page: Sanity.Localized<Sanity.PageBase>,
): Promise<Metadata> {
  const { canonical, languages, locale, alternateLocales } = buildAlternates(page)
  const { title, description, ogimage, noIndex } = page.metadata

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
        // The page's Markdown copy, for LLM crawlers and agents (#138).
        'text/markdown': markdownUrl(canonical, {
          isHome: stegaClean(page.metadata.slug?.current) === 'index',
        }),
      },
    },
  }
}

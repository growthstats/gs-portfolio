import { stegaClean } from 'next-sanity'
import { BASE_URL, BLOG_DIR, vercelPreview } from './env'
import { buildAlternates } from './seo'
import type { Metadata } from 'next'

type OpenGraphType = Pick<
  Extract<NonNullable<Metadata['openGraph']>, { type: 'article' }>,
  'type' | 'publishedTime' | 'modifiedTime' | 'authors'
>

const isBlogPost = (page: Sanity.PageBase): page is Sanity.BlogPost => page._type === 'blog.post'

/** `article` with dates and authors for blog posts, `website` for everything else. */
function openGraphType(page: Sanity.PageBase): OpenGraphType | { type: 'website' } {
  if (!isBlogPost(page)) return { type: 'website' }

  // Same fallbacks as the BlogPosting JSON-LD in `BlogPostSchema`.
  const publishedTime = page.publishDate || page._createdAt
  const authors = (page.authors ?? [])
    .map((author) => stegaClean(author?.name))
    .filter((name): name is string => Boolean(name))

  return {
    type: 'article',
    publishedTime,
    modifiedTime: page._updatedAt || publishedTime,
    ...(authors.length && { authors }),
  }
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
      },
    },
  }
}

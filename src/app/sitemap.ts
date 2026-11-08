import { fetchSanityLive } from '@/sanity/lib/fetch'
import { DEFAULT_LANG, enabledLanguages } from '@/lib/i18n'
import { buildAlternates } from '@/lib/seo'
import { withTranslationLinks } from '@/sanity/lib/localized'
import { SITEMAP_QUERY } from '@/sanity/queries/feeds.groq'
import type { SITEMAP_QUERY_RESULT } from '@/sanity/sanity.types'
import type { MetadataRoute } from 'next'

/**
 * Every published document in an enabled language, each with its hreflang
 * alternates. Fallbacks have no document of their own, so they are never listed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await fetchSanityLive<SITEMAP_QUERY_RESULT>({
    query: SITEMAP_QUERY,
    // `$lang` only feeds `isFallback`, which the sitemap doesn't read.
    params: { languages: enabledLanguages, lang: DEFAULT_LANG },
  })

  // `blog/*`-style slugs are templates, not pages.
  return docs
    .filter((doc) => !doc.metadata?.slug?.current?.includes('*'))
    .map((doc) => {
      const { canonical, languages } = buildAlternates(withTranslationLinks(doc))

      return {
        url: canonical,
        lastModified: doc._updatedAt,
        priority: priority(doc),
        alternates: { languages },
      }
    })
}

function priority({ _type, metadata }: SITEMAP_QUERY_RESULT[number]) {
  if (_type === 'blog.post') return 0.4
  return metadata?.slug?.current === 'index' ? 1 : 0.5
}

import { fetchSanityLive } from '@/sanity/lib/fetch'
import { groq } from 'next-sanity'
import { DEFAULT_LANG, enabledLanguages } from '@/lib/i18n'
import { buildAlternates } from '@/lib/seo'
import {
  LANGUAGE,
  LOCALIZED_FIELDS,
  withTranslationLinks,
  type LocalizedResult,
} from '@/sanity/lib/localized'
import type { MetadataRoute } from 'next'

type Entry = LocalizedResult<Sanity.PageBase>

/**
 * Every published document in an enabled language, each with its hreflang
 * alternates. Fallbacks have no document of their own, so they are never listed.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const docs = await fetchSanityLive<Entry[]>({
    query: groq`*[
			_type in ['page', 'blog.post']
			&& defined(metadata.slug.current)
			&& !(metadata.slug.current in ['404'])
			&& metadata.noIndex != true
			&& ${LANGUAGE} in $languages
		]|order(_type desc, metadata.slug.current){
			_type,
			_updatedAt,
			language,
			metadata { slug },
			${LOCALIZED_FIELDS}
		}`,
    // `$lang` only feeds `isFallback`, which the sitemap doesn't read.
    params: { languages: enabledLanguages, lang: DEFAULT_LANG },
  })

  return docs.map((doc) => {
    const { canonical, languages } = buildAlternates(withTranslationLinks(doc))

    return {
      url: canonical,
      lastModified: doc._updatedAt,
      priority: priority(doc),
      alternates: { languages },
    }
  })
}

function priority({ _type, metadata }: Entry) {
  if (_type === 'blog.post') return 0.4
  return metadata.slug.current === 'index' ? 1 : 0.5
}

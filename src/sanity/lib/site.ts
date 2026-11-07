import { cache } from 'react'
import errors from '@/lib/errors'
import { DEFAULT_LANG, type Lang } from '@/lib/i18n'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { SITE_QUERY } from '@/sanity/queries/site.groq'
import type { SITE_QUERY_RESULT } from '@/sanity/sanity.types'

/**
 * Site settings in `lang`: `site-<lang>` when it exists, else the English `site`.
 * Menus follow their references to the `lang` translation. Business details
 * for structured data always come from the English `site`: call it without `lang`.
 */
export function getSite(lang: Lang = DEFAULT_LANG) {
  return fetchSite(lang)
}

const fetchSite = cache(async (lang: Lang) => {
  const site = await fetchSanityLive<SITE_QUERY_RESULT>({
    query: SITE_QUERY,
    params: { lang },
  })

  if (!site) throw new Error(errors.missingSiteSettings)

  return site
})

import Modules from '@/ui/modules'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { groq } from 'next-sanity'
import { NOT_FOUND_MODULES_QUERY } from '@/sanity/lib/queries'
import { IN_LANGUAGE, PREFER_LANGUAGE } from '@/sanity/lib/localized'
import type { Lang } from '@/lib/i18n'

/** The site's 404 page in `lang`, else English, with a bare heading when it doesn't exist. */
export default async function NotFoundModules({ lang }: { lang: Lang }) {
  const page = await get404(lang)
  if (!page) return <h1 className="section text-center text-5xl">404</h1>
  return <Modules lang={lang} modules={page.modules} />
}

export async function get404(lang: Lang) {
  return await fetchSanityLive<Sanity.Page>({
    query: groq`*[_type == 'page' && metadata.slug.current == '404' && ${IN_LANGUAGE}] | ${PREFER_LANGUAGE}[0]{
			...,
			'modules': ${NOT_FOUND_MODULES_QUERY}
		}`,
    params: { lang },
  })
}

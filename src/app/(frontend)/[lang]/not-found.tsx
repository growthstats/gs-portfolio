import Modules from '@/ui/modules'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { groq } from 'next-sanity'
import { MODULES_QUERY, withGlobalModules } from '@/sanity/lib/queries'
import { IN_LANGUAGE } from '@/sanity/lib/localized'
import { DEFAULT_LANG } from '@/lib/i18n'

export default async function NotFound() {
  const page = await get404()
  if (!page) return <h1 className="section text-center text-5xl">404</h1>
  return <Modules modules={page?.modules} />
}

export async function generateMetadata() {
  return (await get404())?.metadata
}

// `not-found` gets no route params, so the 404 page is English for now.
async function get404() {
  return await fetchSanityLive<Sanity.Page>({
    query: groq`*[_type == 'page' && metadata.slug.current == '404' && ${IN_LANGUAGE}][0]{
			...,
			'modules': ${withGlobalModules(`modules[]{ ${MODULES_QUERY} }`)}
		}`,
    params: { lang: DEFAULT_LANG },
  })
}

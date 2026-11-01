import { notFound } from 'next/navigation'
import Modules from '@/ui/modules'
import processMetadata from '@/lib/processMetadata'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { MODULES_QUERY, GLOBAL_MODULE_PATH_QUERY } from '@/sanity/lib/queries'
import {
  IN_LANGUAGE,
  LOCALIZED_FIELDS,
  staticSlugs,
  withTranslationLinks,
  type LocalizedResult,
} from '@/sanity/lib/localized'
import type { Lang } from '@/lib/i18n'
import errors from '@/lib/errors'

export default async function Page({ params }: Props) {
  const page = await getPage(await params)
  if (!page) notFound()
  return <Modules modules={page.modules} page={page} />
}

export async function generateMetadata({ params }: Props) {
  const page = await getPage(await params)
  if (!page) notFound()
  // `processMetadata` doesn't read the new `translations` shape yet (#68).
  return processMetadata({ ...page, translations: undefined })
}

export async function generateStaticParams({ params: { lang } }: { params: { lang: Lang } }) {
  const docs = await client.fetch<{ slug: string; language: string }[]>(
    groq`*[
			_type == 'page'
			&& defined(metadata.slug.current)
			&& !(metadata.slug.current in ['index'])
		]{
			'slug': metadata.slug.current,
			'language': coalesce(language, 'en')
		}`,
  )

  return staticSlugs(docs, lang).map((slug) => ({ slug: slug.split('/') }))
}

async function getPage({ lang, slug: segments }: Params) {
  const slug = segments?.join('/') ?? 'index'

  const page = await fetchSanityLive<LocalizedResult<Sanity.Page>>({
    query: groq`*[
			_type == 'page'
			&& metadata.slug.current == $slug
			&& ${IN_LANGUAGE}
		][0]{
			...,
			'modules': (
				// global modules (before)
				*[_type == 'global-module' && path == '*' && ${IN_LANGUAGE}].before[]{ ${MODULES_QUERY} }
				// path modules (before)
				+ *[_type == 'global-module' && path != '*' && ${GLOBAL_MODULE_PATH_QUERY} && ${IN_LANGUAGE}].before[]{ ${MODULES_QUERY} }
				// page modules
				+ modules[]{ ${MODULES_QUERY} }
				// path modules (after)
				+ *[_type == 'global-module' && path != '*' && ${GLOBAL_MODULE_PATH_QUERY} && ${IN_LANGUAGE}].after[]{ ${MODULES_QUERY} }
				// global modules (after)
				+ *[_type == 'global-module' && path == '*' && ${IN_LANGUAGE}].after[]{ ${MODULES_QUERY} }
			),
			metadata {
				...,
				'ogimage': image.asset->url + '?w=1200'
			},
			${LOCALIZED_FIELDS}
		}`,
    params: { lang, slug },
  })

  if (slug === 'index' && !page) throw new Error(errors.missingHomepage)

  return page && withTranslationLinks(page)
}

type Params = { lang: Lang; slug?: string[] }

type Props = {
  params: Promise<Params>
}

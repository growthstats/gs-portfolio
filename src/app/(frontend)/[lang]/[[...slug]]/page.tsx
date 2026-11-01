import { notFound } from 'next/navigation'
import Modules from '@/ui/modules'
import processMetadata from '@/lib/processMetadata'
import { client } from '@/sanity/lib/client'
import { groq } from 'next-sanity'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { MODULES_QUERY, GLOBAL_MODULE_PATH_QUERY, withGlobalModules } from '@/sanity/lib/queries'
import {
  IN_LANGUAGE,
  LANGUAGE,
  LOCALIZED_FIELDS,
  withTranslationLinks,
  type LocalizedResult,
} from '@/sanity/lib/localized'
import { DEFAULT_LANG, type Lang } from '@/lib/i18n'
import { cache } from 'react'
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
  // Each language's own documents, plus the English ones it renders as fallbacks.
  const slugs = await client.fetch<string[]>(
    groq`array::unique(*[
			_type == 'page'
			&& defined(metadata.slug.current)
			&& !(metadata.slug.current in ['index'])
			&& ${LANGUAGE} in [$lang, '${DEFAULT_LANG}']
		].metadata.slug.current)`,
    { lang },
  )

  return slugs.map((slug) => ({ slug: slug.split('/') }))
}

function getPage({ lang, slug }: Params) {
  return fetchPage(lang, slug?.join('/') ?? 'index')
}

// Keyed by strings so `Page` and `generateMetadata` share one fetch.
const fetchPage = cache(async (lang: Lang, slug: string) => {
  const page = await fetchSanityLive<LocalizedResult<Sanity.Page>>({
    query: groq`*[
			_type == 'page'
			&& metadata.slug.current == $slug
			&& ${IN_LANGUAGE}
		][0]{
			...,
			'modules': ${withGlobalModules(`modules[]{ ${MODULES_QUERY} }`, GLOBAL_MODULE_PATH_QUERY)},
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
})

type Params = { lang: Lang; slug?: string[] }

type Props = {
  params: Promise<Params>
}

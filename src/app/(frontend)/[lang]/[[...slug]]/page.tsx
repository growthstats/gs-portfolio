import { notFound } from 'next/navigation'
import Modules from '@/ui/modules'
import FallbackNotice from '@/ui/FallbackNotice'
import WebPageSchema from '@/ui/WebPageSchema'
import processMetadata from '@/lib/processMetadata'
import { client } from '@/sanity/lib/client'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { withTranslationLinks } from '@/sanity/lib/localized'
import { PAGE_QUERY, PAGE_SLUGS_QUERY, type PageResult } from '@/sanity/queries/page.groq'
import type { PAGE_SLUGS_QUERY_RESULT } from '@/sanity/sanity.types'
import { isEnabledLanguage, type Lang } from '@/lib/i18n'
import { cache } from 'react'
import errors from '@/lib/errors'

export default async function Page({ params }: Props) {
  const { lang, slug } = await params
  // Next types route params as strings; the proxy only lets enabled languages through.
  if (!isEnabledLanguage(lang)) notFound()
  const page = await getPage({ lang, slug })
  if (!page) notFound()
  return (
    <>
      {page.isFallback && <FallbackNotice key={page._id} />}
      <WebPageSchema page={page} />
      <Modules lang={lang} modules={page.modules} page={page} />
    </>
  )
}

export async function generateMetadata({ params }: Props) {
  const page = await getPage(await params)
  if (!page) notFound()
  return processMetadata(page)
}

export async function generateStaticParams({ params: { lang } }: { params: { lang: string } }) {
  // Each language's own documents, plus the English ones it renders as fallbacks.
  const slugs = await client.fetch<PAGE_SLUGS_QUERY_RESULT>(PAGE_SLUGS_QUERY, { lang })

  // The homepage has no slug segments.
  return [
    { slug: undefined },
    ...slugs.flatMap((slug) => (slug ? [{ slug: slug.split('/') }] : [])),
  ]
}

function getPage({ lang, slug }: Params) {
  if (!isEnabledLanguage(lang)) notFound()
  return fetchPage(lang, slug?.join('/') ?? 'index')
}

// Keyed by strings so `Page` and `generateMetadata` share one fetch.
const fetchPage = cache(async (lang: Lang, slug: string) => {
  const page = await fetchSanityLive<PageResult | null>({
    query: PAGE_QUERY,
    params: { lang, slug },
  })

  if (slug === 'index' && !page) throw new Error(errors.missingHomepage)

  return page && withTranslationLinks(page)
})

type Params = { lang: string; slug?: string[] }

type Props = {
  params: Promise<Params>
}

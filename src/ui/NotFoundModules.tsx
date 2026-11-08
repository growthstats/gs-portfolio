import Modules from '@/ui/modules'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { NOT_FOUND_PAGE_QUERY, type NotFoundPage } from '@/sanity/queries/page.groq'
import type { Lang } from '@/lib/i18n'

/** The site's 404 page in `lang`, else English, with a bare heading when it doesn't exist. */
export default async function NotFoundModules({ lang }: { lang: Lang }) {
  const page = await get404(lang)
  if (!page) return <h1 className="section text-center text-5xl">404</h1>
  return <Modules lang={lang} modules={page.modules} />
}

export async function get404(lang: Lang) {
  return await fetchSanityLive<NotFoundPage>({ query: NOT_FOUND_PAGE_QUERY, params: { lang } })
}

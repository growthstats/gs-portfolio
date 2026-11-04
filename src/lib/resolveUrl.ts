import { BLOG_DIR } from './env'
import { isSupportedLanguage, localizeHref } from './i18n'
import { stegaClean } from 'next-sanity'

/** What a URL is built from: a page or post, from hand-written types or a TypeGen result. */
export type UrlSource = {
  _type?: string
  metadata?: { slug?: { current?: string } | null } | null
}

export default function resolveUrl(
  page?: UrlSource | null,
  {
    base = true,
    params,
    language,
  }: {
    base?: boolean
    params?: string
    language?: string
  } = {},
) {
  const segment = page?._type === 'blog.post' ? `/${BLOG_DIR}/` : '/'
  const slug = page?.metadata?.slug?.current
  const path = slug === 'index' ? '' : (slug ?? '')
  const lang = isSupportedLanguage(language) ? language : undefined

  // Localize after appending params: editors also use them for paths (`/` + `services`).
  const href = localizeHref(segment + path + (stegaClean(params) ?? ''), lang)

  return [base && process.env.NEXT_PUBLIC_BASE_URL, href].filter(Boolean).join('')
}

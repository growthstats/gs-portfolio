import { BLOG_DIR } from './env'
import { isSupportedLanguage, localizeHref } from './i18n'
import { stegaClean } from 'next-sanity'

export default function resolveUrl(
  page?: Sanity.PageBase,
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

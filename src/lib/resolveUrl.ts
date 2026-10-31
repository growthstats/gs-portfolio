import { BLOG_DIR } from './env'
import { isSupportedLanguage, localizePath } from './i18n'
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

  return [
    base && process.env.NEXT_PUBLIC_BASE_URL,
    localizePath(segment + path, lang),
    stegaClean(params),
  ]
    .filter(Boolean)
    .join('')
}

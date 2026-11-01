import { BLOG_DIR } from '@/lib/env'
import type { SearchScope } from './store'
import { useDictionary } from '@/i18n/DictionaryProvider'

export default function SearchGoogle({
  query,
  scope,
  path,
}: {
  query: string
  scope: SearchScope
  path?: string
}) {
  const { search } = useDictionary()
  const href = [
    `https://www.google.com/search?q=${query} `,
    `site:${process.env.NEXT_PUBLIC_BASE_URL}`,
    scope === 'path' && path
      ? `/${path.replace(/\/?\*$/, '')}`
      : scope === 'blog posts'
        ? `/${BLOG_DIR}`
        : '',
  ].join('')

  return (
    <p className="text-ink/50 text-center text-sm">
      <a className="hover:underline" href={href} target="_blank">
        {search.google}
      </a>
    </p>
  )
}

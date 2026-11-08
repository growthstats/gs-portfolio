'use client'

import { usePathname } from 'next/navigation'
import CTA, { type LinkValue } from '@/ui/CTA'
import resolveUrl from '@/lib/resolveUrl'
import { localizePath, parseLangFromPath, type Lang } from '@/lib/i18n'
import { useLang } from '@/i18n/DictionaryProvider'
import { stegaClean } from 'next-sanity'
import type { SITE_QUERY_RESULT } from '@/sanity/sanity.types'

type FooterNavigationProps = {
  footerMenu: NonNullable<SITE_QUERY_RESULT>['footerMenu']
}

function normalizePathname(pathname: string) {
  const url = new URL(pathname, 'http://localhost')
  const normalized =
    url.pathname.endsWith('/') && url.pathname !== '/' ? url.pathname.slice(0, -1) : url.pathname

  return normalized || '/'
}

function getLinkPathname(link?: LinkValue | null, language?: Lang) {
  if (!link) return null

  if (link.type === 'internal' && link.internal) {
    return normalizePathname(
      resolveUrl(link.internal, {
        base: false,
        params: link.params,
        language,
      }),
    )
  }

  if (link.type === 'external' && link.external) {
    if (/^[a-z][a-z0-9+.-]*:/i.test(link.external) || link.external.startsWith('//')) return null
    return normalizePathname(link.external)
  }

  return null
}

export default function Menu({ footerMenu }: FooterNavigationProps) {
  const pathname = usePathname()
  // CTA localizes links with the provider's language, so compare against the same one.
  const language = useLang()
  // A prerendered page sees its rewritten `/en/...` path on the server, so drop the prefix.
  const { path } = parseLangFromPath(normalizePathname(pathname))
  const currentPath = localizePath(path, language)

  const isCurrentLink = (link?: LinkValue | null) => getLinkPathname(link, language) === currentPath

  return (
    <nav className="flex flex-wrap items-start gap-x-12 gap-y-6 max-sm:flex-col">
      {footerMenu?.items?.map((item, key) => {
        switch (item._type) {
          case 'link':
            if (isCurrentLink(item)) return null
            return <CTA className="text-primary hover:link" link={item} key={key} />

          case 'link.list': {
            const headerIsCurrent = isCurrentLink(item.link)
            const filteredLinks = item.links?.filter((link) => !isCurrentLink(link)) ?? []

            if ((headerIsCurrent || !item.link) && filteredLinks.length === 0) return null

            return (
              <div className="space-y-2 text-start" key={key}>
                {!headerIsCurrent && item.link && (
                  <div className="text-xs technical text-canvas/50">
                    <CTA link={item.link} style="link" className="text-primary">
                      {stegaClean(item.link?.label) || item.link?.internal?.title}
                    </CTA>
                  </div>
                )}

                {filteredLinks.length > 0 && (
                  <ul>
                    {filteredLinks.map((link, key) => (
                      <li key={key}>
                        <CTA
                          className="inline-block py-px text-primary hover:underline"
                          link={link}
                          style="link"
                        />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )
          }

          default:
            return null
        }
      })}
    </nav>
  )
}

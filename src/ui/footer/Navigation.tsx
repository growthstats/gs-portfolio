'use client'

import { usePathname } from 'next/navigation'
import CTA from '@/ui/CTA'
import resolveUrl from '@/lib/resolveUrl'
import { languages } from '@/lib/i18n'
import { stegaClean } from 'next-sanity'

type FooterNavigationProps = {
  footerMenu?: Sanity.Navigation | null
}

function normalizePathname(pathname: string) {
  const url = new URL(pathname, 'http://localhost')
  const normalized =
    url.pathname.endsWith('/') && url.pathname !== '/' ? url.pathname.slice(0, -1) : url.pathname

  return normalized || '/'
}

function getLanguageFromPathname(pathname: string) {
  if (languages.length === 0) return undefined

  const firstSegment = pathname.split('/').filter(Boolean)[0]
  if (!firstSegment) return undefined

  return languages.includes(firstSegment) ? firstSegment : undefined
}

function getLinkPathname(link?: Sanity.Link, language?: string) {
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
  const currentPath = normalizePathname(pathname)
  const language = getLanguageFromPathname(currentPath)

  const isCurrentLink = (link?: Sanity.Link) => getLinkPathname(link, language) === currentPath

  return (
    <nav className="flex flex-wrap items-start gap-x-12 gap-y-6 max-sm:flex-col">
      {footerMenu?.items?.map((item, key) => {
        switch (item._type) {
          case 'link':
            if (isCurrentLink(item)) return null
            return <CTA className="hover:link text-primary" link={item} key={key} />

          case 'link.list': {
            const headerIsCurrent = isCurrentLink(item.link)
            const filteredLinks = item.links?.filter((link) => !isCurrentLink(link)) ?? []

            if ((headerIsCurrent || !item.link) && filteredLinks.length === 0) return null

            return (
              <div className="space-y-2 text-start" key={key}>
                {!headerIsCurrent && item.link && (
                  <div className="technical text-canvas/50 text-xs">
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
                          className="text-primary inline-block py-px hover:underline"
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

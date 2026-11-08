import CTA from '@/ui/CTA'
import { stegaClean } from 'next-sanity'
import { getDictionary } from '@/i18n'
import type { Lang } from '@/lib/i18n'

export default async function Breadcrumbs({
  lang,
  crumbs,
  hideCurrent,
  currentPage,
}: Readonly<
  Partial<{
    crumbs: Sanity.Link[]
    hideCurrent?: boolean
    /** The page or post the trail ends at. */
    currentPage: { title?: string | null; metadata?: { title?: string | null } | null }
  }>
> & { lang: Lang }) {
  const { common } = getDictionary(lang)

  return (
    <nav aria-label={common.breadcrumbs} className="section py-4 text-sm">
      <ol
        className="flex flex-wrap items-center gap-x-2 gap-y-1"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {crumbs?.map((crumb, key) => (
          <Crumb key={key} link={crumb} position={key + 1} withSeparator={key > 0} />
        ))}

        <Crumb
          position={(crumbs?.length || 0) + 1}
          hidden={hideCurrent}
          withSeparator={(crumbs?.length || 0) > 0}
        >
          {currentPage?.title || currentPage?.metadata?.title}
        </Crumb>
      </ol>
    </nav>
  )
}

function Crumb({
  link,
  position,
  children,
  hidden,
  withSeparator,
}: {
  link?: Omit<Sanity.Link, '_type'>
  position: number
  hide?: boolean
  withSeparator?: boolean
} & React.ComponentProps<'li'>) {
  const content = (
    <>
      <span itemProp="name" hidden={hidden}>
        {
          stegaClean(
            children || link?.label || link?.internal?.title || link?.external,
          ) as React.ReactNode
        }
      </span>
      <meta itemProp="position" content={position.toString()} />
    </>
  )

  return (
    <li
      className="line-clamp-1 flex items-center"
      itemProp="itemListElement"
      itemScope
      itemType="https://schema.org/ListItem"
    >
      {withSeparator && (
        <span className="mx-2 shrink-0 text-ink/20" aria-hidden="true">
          /
        </span>
      )}

      {link ? (
        <CTA
          className="hover:underline"
          link={{ _type: 'link', ...link }}
          itemProp="item"
          style={'link'}
        >
          {content}
        </CTA>
      ) : (
        content
      )}
    </li>
  )
}

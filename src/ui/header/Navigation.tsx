import { getSite } from '@/sanity/lib/queries'
import CTA from '@/ui/CTA'
import LinkList from './LinkList'
import { cn } from '@/lib/utils'
import type { Lang } from '@/lib/i18n'

export default async function Menu({ lang }: { lang: Lang }) {
  const { headerMenu } = await getSite(lang)

  const parentClassName = cn('md:px-3 md:text-center md:leading-tight')

  return (
    <nav
      className="max-md:anim-fade-to-r max-md:header-closed:hidden flex gap-y-2 [grid-area:nav] max-md:my-4 max-md:flex-col md:justify-center md:gap-x-2"
      role="navigation"
    >
      {headerMenu?.items?.map((item, key) => {
        switch (item._type) {
          case 'link':
            return (
              <CTA
                className={cn(parentClassName, 'hover:link md:grid md:place-content-center')}
                link={item}
                key={key}
                style={'ghost'}
              />
            )

          case 'link.list':
            return <LinkList summaryClassName={parentClassName} {...item} key={key} />

          default:
            return null
        }
      })}
    </nav>
  )
}

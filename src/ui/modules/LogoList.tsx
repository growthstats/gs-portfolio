import { fetchSanityLive } from '@/sanity/lib/fetch'
import Pretitle from '@/ui/Pretitle'
import { Img } from '@/ui/Img'
import { cn } from '@/lib/utils'
import css from './LogoList.module.css'
import PortableText from '@/ui/PortableText'
import { LOGOS_QUERY } from '@/sanity/queries/logo.groq'
import type { LOGOS_QUERY_RESULT } from '@/sanity/sanity.types'

export default async function LogoList({
  pretitle,
  intro,
  logos,
  logoType = 'default',
  autoScroll,
  duration = 12,
}: Readonly<
  Partial<{
    pretitle: string
    intro: Sanity.PortableText
    logos: LOGOS_QUERY_RESULT
    logoType: 'default' | 'light' | 'dark'
    autoScroll?: boolean
    duration?: number
  }>
>) {
  const allLogos =
    logos ||
    (await fetchSanityLive<LOGOS_QUERY_RESULT>({
      query: LOGOS_QUERY,
    }))

  return (
    <section className="section space-y-8">
      {(pretitle || intro) && (
        <header className="mx-auto max-w-screen-sm richtext text-center text-balance">
          <Pretitle>{pretitle}</Pretitle>
          {intro && <PortableText value={intro ?? []} />}
        </header>
      )}

      <figure
        className={cn(
          'mx-auto flex items-center gap-y-8 pb-4',
          autoScroll
            ? `${css.track} max-w-max overflow-hidden overflow-fade`
            : 'flex-wrap justify-center gap-x-4',
        )}
        style={
          {
            '--count': allLogos?.length,
            '--dur': `${duration}s`,
          } as React.CSSProperties
        }
      >
        {allLogos.map(
          (logo, key) =>
            logo && (
              <Img
                className="h-[2.5em] w-[200px] shrink-0 object-contain px-4 max-sm:w-[150px]"
                style={{ '--index': key } as React.CSSProperties}
                image={logo.image?.[logoType] || logo.image?.default}
                width={400}
                alt={logo.name}
                key={key}
              />
            ),
        )}
      </figure>
    </section>
  )
}

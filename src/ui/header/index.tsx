import { getSite } from '@/sanity/lib/queries'
import Wrapper from './Wrapper'
import Link from 'next/link'
import { Img } from '@/ui/Img'
import Navigation from './Navigation'
import CTAList from '@/ui/CTAList'
import Toggle from './Toggle'
import { cn } from '@/lib/utils'
import css from './Header.module.css'

export default async function Header() {
  const { title, logo, ctas } = await getSite()

  const logoImage = logo?.image?.dark || logo?.image?.default

  return (
    <Wrapper
      className="glass-panel bg-canvas/20 max-md:header-open:shadow-lg sticky top-0 z-10 border-b-2 border-white/30 md:py-2"
      style={{
        backdropFilter: 'blur(16px) saturate(140%)',
        WebkitBackdropFilter: 'blur(16px) saturate(140%)',
        backgroundColor: 'rgba(255,255,255,0.7)',
      }}
    >
      <div className={cn(css.header, 'mx-auto grid max-w-screen-xl items-center gap-x-6 p-4')}>
        <div className="[grid-area:logo]">
          <Link className={cn('h4 md:h3 grid', logo?.image && 'max-w-3xs')} href="/">
            {logoImage ? (
              <Img
                className="inline-block max-h-[1.2em] w-auto"
                image={logoImage}
                alt={logo?.name || title}
              />
            ) : (
              <span className="text-gradient">{title}</span>
            )}
          </Link>
        </div>

        <Navigation />

        <CTAList
          ctas={ctas}
          className="max-md:header-closed:hidden [grid-area:ctas] max-md:*:w-full md:ms-auto"
        />

        <Toggle />
      </div>
    </Wrapper>
  )
}

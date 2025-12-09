import clsx from 'clsx'
import Heading from '@/ui/Heading'
import CTA from '@/ui/CTA'
import { PortableText } from 'next-sanity'
import type { PortableTextBlock } from 'sanity'

import { loadIcon } from '@/ui/modules/Section'
import { Img } from '@/ui/Img'
import type { LucideIcon } from 'lucide-react'

/* ---------------- SANITY TYPES ---------------- */

interface ServiceItem {
  _key: string
  title?: string
  description?: PortableTextBlock[]
  keywords?: string[]
  image?: Sanity.Image
  icon?: string | null
  ctas?: Sanity.CTA[]
  accentIconSize?: number
  accentBg?: boolean
  layout?: 'text-left' | 'text-right'
}

interface Props {
  layout?: 'text-left' | 'text-right'
  services?: ServiceItem[]
}

export default async function ServiceList({ layout = 'text-left', services = [] }: Props) {
  // Properly typed icon map
  const iconMap: Record<string, LucideIcon | null> = {}

  await Promise.all(
    services.map(async (s) => {
      if (!s.icon) return
      const icon = await loadIcon(s.icon.trim())
      iconMap[s._key] = icon ?? null
    }),
  )

  return (
    <div className="w-full py-10">
      <div className="mx-auto max-w-7xl space-y-12 px-4">
        {services.map((s) => {
          const effectiveLayout = s.layout ?? layout
          const isTextRight = effectiveLayout === 'text-right'

          const IconComponent = iconMap[s._key]

          return (
            <div
              key={s._key}
              className={clsx(
                'w-full rounded-4xl p-4 shadow-(--shadow-badge)',
                'flex flex-col gap-8 md:flex-row',
                isTextRight ? 'md:flex-row-reverse' : 'md:flex-row',
              )}
            >
              {/* ---------------- LEFT CONTENT ---------------- */}
              <div className="flex flex-1 flex-col justify-between gap-4 p-10">
                {/* Icon + Title */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-full p-3 shadow-(--shadow-badge)">
                    {IconComponent ? (
                      <IconComponent className="size-6" />
                    ) : (
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="7.2" stroke="black" strokeWidth="1.4" />
                        <path
                          d="M21 21L16.65 16.65"
                          stroke="black"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    )}
                  </div>

                  <Heading as="h2" variant="h2">
                    {s.title}
                  </Heading>
                </div>

                {/* Description */}
                <div className="max-w-xl leading-relaxed text-black">
                  <PortableText value={s.description ?? []} />
                </div>

                {/* Keywords */}
                <div className="flex flex-wrap justify-center gap-3">
                  {(s.keywords ?? []).map((k, i) => (
                    <div
                      key={i}
                      className="rounded-full px-4 py-2 text-sm text-black shadow-(--shadow-badge)"
                    >
                      {k}
                    </div>
                  ))}
                </div>
              </div>

              {/* ---------------- RIGHT IMAGE BLOCK ---------------- */}
              <div className="flex flex-1 items-center justify-center rounded-4xl p-7 shadow-(--shadow-badge)">
                <div className="flex h-full flex-col items-center justify-center">
                  <div className="relative flex items-center justify-center rounded-4xl p-4 shadow-(--shadow-badge)">
                    {s.image ? (
                      <Img
                        image={s.image}
                        width={200}
                        height={200}
                        className="relative z-0 rounded-xl object-contain"
                        alt={s.title || 'Service image'}
                      />
                    ) : (
                      <div className="relative z-0 text-4xl opacity-60">⚙</div>
                    )}
                  </div>

                  {/* CTA buttons */}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                    {(s.ctas ?? []).map((cta) => {
                      const label = cta.link?.label
                      const slug = cta.link?.internal?.metadata?.slug?.current

                      const href =
                        cta.link?.external || (slug ? (slug === 'index' ? '/' : `/${slug}`) : null)

                      if (!href || !label) return null

                      return (
                        <CTA
                          key={cta._key}
                          href={href}
                          style={cta.style ?? 'ghost'}
                          className="rounded-full px-8 py-3 font-medium shadow-(--shadow-badge)"
                        >
                          {label}
                        </CTA>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

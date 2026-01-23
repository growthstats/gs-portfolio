import clsx from 'clsx'

import CTA from '@/ui/CTA'
import Heading from '@/ui/Heading'
import { Img } from '@/ui/Img'
import { loadIcon, sanitizeString } from '@/ui/modules/Section'

import type { PortableTextBlock } from 'sanity'

import type { LucideIcon } from 'lucide-react'
import PortableText from '@/ui/PortableText'

interface ServiceItem {
  _key: string
  title?: string
  description?: PortableTextBlock[]
  keywords?: string[]
  image?: Sanity.Image
  icon?: string | null
  ctas?: Sanity.CTA[]
  layout?: 'text-left' | 'text-right'
}

interface Props {
  layout?: 'text-left' | 'text-right'
  services?: ServiceItem[]
}

export default async function ServiceList({
  layout = 'text-left',
  services = [],
}: Readonly<Props>) {
  // Properly typed icon map
  const iconMap: Record<string, LucideIcon | null> = {}

  await Promise.all(
    services.map(async (s) => {
      if (!s.icon) return
      const iconName = sanitizeString(s.icon)
      const IconComponent = iconName ? await loadIcon(iconName) : null

      iconMap[s._key] = IconComponent ?? null
    }),
  )

  return (
    <div className="mx-auto w-full max-w-5xl space-y-12 px-4 py-10">
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
            <div className="flex basis-[60%] flex-col justify-between gap-4 p-10 md:basis-[60%]">
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
            <div className="flex basis-[40%] items-center justify-center rounded-4xl p-7 shadow-(--shadow-badge) md:basis-[40%]">
              <div className="flex h-full flex-col items-center justify-center">
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

                {/* CTA buttons */}
                <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                  {(s.ctas ?? []).map((cta) => {
                    return (
                      <CTA
                        key={cta._key}
                        link={cta.link}
                        style={cta.style ?? 'ghost'}
                        className="px-8 py-3 font-medium shadow-(--shadow-badge)"
                      />
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

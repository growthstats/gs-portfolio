'use client'

import React from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import Heading from '@/ui/Heading'
import CTA from '@/ui/CTA'
import { PortableText } from 'next-sanity'
import * as LucideIcons from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { urlFor } from '@/sanity/lib/image'
import type { PortableTextBlock } from 'sanity'

/* ---------------- SANITY TYPES ---------------- */

interface SanityImage {
  _type: 'image'
  asset: {
    _ref?: string
    url?: string
  }
  lqip?: string
}

type CTAStyle = 'default' | 'link' | 'destructive' | 'outline' | 'secondary' | 'ghost'

interface SanityCTA {
  _key: string
  label?: string
  href?: string
  style?: CTAStyle | null
  link?: {
    _type: string
    url?: string
    label?: string
    internal?: {
      title?: string
      metadata?: {
        slug?: {
          current?: string
        }
      }
    }
  }
}

interface ServiceItem {
  _key: string
  title?: string
  description?: PortableTextBlock[]
  keywords?: string[]
  image?: SanityImage
  icon?: string | null
  ctas?: SanityCTA[]
  accentIconSize?: number
  accentBg?: boolean
  layout?: 'text-left' | 'text-right'
}

interface Props {
  layout?: 'text-left' | 'text-right'
  services?: ServiceItem[]
}

/* ---------------- COMPONENT ---------------- */

export default function ServiceList({ layout = 'text-left', services = [] }: Props) {
  return (
    <div className="w-full py-10">
      <div className="mx-auto max-w-7xl space-y-12 px-4">
        {services.map((s) => {
          const effectiveLayout = s.layout ?? layout
          const isTextRight = effectiveLayout === 'text-right'

          const IconComponent: LucideIcon | null =
            s.icon && LucideIcons[s.icon as keyof typeof LucideIcons]
              ? (LucideIcons[s.icon as keyof typeof LucideIcons] as LucideIcon)
              : null

          /* Build Sanity image URL safely */
          let imgUrl: string | null = null
          if (s.image?.asset?._ref) {
            imgUrl = urlFor(s.image.asset).width(400).height(400).url()
          } else if (s.image?.asset?.url) {
            imgUrl = s.image.asset.url
          } else if (s.image?.lqip) {
            imgUrl = s.image.lqip
          }

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
                      <IconComponent size={22} strokeWidth={2} />
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
                  {/* Main card */}
                  <div className="relative flex items-center justify-center rounded-4xl p-4 shadow-(--shadow-badge)">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={s.title || ''}
                        width={120}
                        height={120}
                        className="relative z-0 object-contain"
                      />
                    ) : (
                      <div className="relative z-0 text-4xl opacity-60">⚙</div>
                    )}
                  </div>

                  {/* CTA buttons below icon */}
                  <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                    {(s.ctas ?? []).map((cta) => {
                      const label = cta.label || cta.link?.label
                      const slug = cta.link?.internal?.metadata?.slug?.current
                      const href =
                        cta.href ||
                        cta.link?.url ||
                        (slug ? (slug === 'index' ? '/' : `/${slug}`) : null)

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

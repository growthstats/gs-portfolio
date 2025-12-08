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

// TODO: This type can be centralized in types.d.ts, do this later
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

function CustomIcon() {
  return (
    <svg width="24" height="26" viewBox="0 0 24 26" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.5713 0.5C15.8328 0.5 16.7331 1.73926 16.3672 2.95508L16.3271 3.07324L14.96 6.75977L14.71 7.43359H21.5469C21.9271 7.43359 22.2996 7.54595 22.6182 7.75781C22.9369 7.96986 23.1882 8.27293 23.3398 8.62891C23.4914 8.98473 23.5365 9.37786 23.4697 9.75977C23.4026 10.143 23.2277 10.4963 22.9658 10.7764L9.88281 24.7822C9.52431 25.1659 9.04672 25.412 8.53125 25.4805C8.01583 25.5488 7.49216 25.4357 7.04883 25.1592C6.6053 24.8824 6.26863 24.4581 6.09668 23.958C5.92478 23.4579 5.92849 22.9126 6.10742 22.415L8.18457 16.6367L8.42578 15.9668H2.875C2.48787 15.9668 2.10619 15.8713 1.76367 15.6875C1.42131 15.5038 1.12823 15.2377 0.910156 14.9121C0.692017 14.5863 0.555409 14.2104 0.513672 13.8184C0.471958 13.4264 0.526172 13.0298 0.670898 12.6641L4.65234 2.59766C4.89864 1.9779 5.32276 1.44769 5.86816 1.07422C6.34552 0.747351 6.89759 0.553821 7.46875 0.509766L7.71484 0.5H14.5713Z"
        fill="black"
        stroke="white"
      />
    </svg>
  )
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
                          <CustomIcon />
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

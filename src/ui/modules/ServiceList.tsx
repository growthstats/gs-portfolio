'use client'

import React from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'
import { Badge } from '@/components/ui/badge'
import CTA from '@/ui/CTA'
import { PortableText } from 'next-sanity'
import type { PortableTextBlock } from 'next-sanity'

/* -------------------- TYPES -------------------- */

interface SanityImage {
  asset?: {
    url?: string
  }
}

interface CtaItem {
  label?: string
  href?: string
}

interface ServiceItem {
  _key: string
  title?: string
  pretitle?: string
  description?: PortableTextBlock[]
  keywords?: string[]
  image?: SanityImage
  icon?: string | null
  ctas?: CtaItem[]
  bookCallCta?: CtaItem
  accentIconSize?: number
  accentBg?: boolean
}

interface Props {
  pretitle?: string
  title?: string
  description?: PortableTextBlock[]
  layout?: 'text-left' | 'text-right'
  services?: ServiceItem[]
}

/* -------------------- KEYWORD TICKER -------------------- */

function KeywordTicker({ keywords = [] }: { keywords?: string[] }) {
  if (!keywords?.length) return null
  const text = keywords.join(' • ')

  return (
    <div className="relative overflow-hidden rounded-full py-1">
      <div className="ticker py-2 whitespace-nowrap will-change-transform" aria-hidden>
        <span className="mr-8 inline-block">{text}</span>
        <span className="mr-8 inline-block">{text}</span>
        <span className="mr-8 inline-block">{text}</span>
      </div>

      <style jsx>{`
        .ticker {
          display: inline-block;
          animation: marquee 18s linear infinite;
        }
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker {
            animation: none;
          }
        }
      `}</style>
    </div>
  )
}

/* -------------------- MAIN COMPONENT -------------------- */

export default function ServiceList({
  pretitle,
  title,
  description,
  layout = 'text-left',
  services = [],
}: Props) {
  return (
    <div className="w-full py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center md:items-start">
          {pretitle && (
            <Badge
              variant="outline"
              className="mb-4 gap-2 rounded-full px-4 py-1.5 shadow-(--shadow-badge)"
            >
              <span className="h-3 w-3 rounded-full bg-black" />
              <Text as="span" variant="eyebrow" className="text-ink">
                {pretitle}
              </Text>
            </Badge>
          )}

          {title && (
            <Heading as="h2" variant="h2" className="relative mb-2 text-gray-900">
              {title}
              <span className="absolute -bottom-[18px] left-1/2 h-[2px] w-[90%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-400 to-transparent" />
            </Heading>
          )}

          {description && (
            <Text
              as="p"
              variant="body"
              className="mt-4 max-w-2xl text-center text-gray-500 md:text-left"
            >
              <PortableText value={description} />
            </Text>
          )}
        </div>

        {/* Services grid */}
        <div className="grid gap-8">
          {services.map((s) => {
            const reverse = layout === 'text-right'

            return (
              <div
                key={s._key}
                className="rounded-3xl bg-white/60 p-6 shadow-(--shadow-badge) backdrop-blur-sm transition-shadow duration-300"
                aria-label={s.title}
              >
                <div
                  className={clsx('grid items-center gap-6 md:grid-cols-2', {
                    'md:grid-flow-col': true,
                    'md:flex-row-reverse': reverse,
                  })}
                >
                  {/* Image / Icon block */}
                  <div className="relative flex items-center justify-center rounded-2xl p-6">
                    <div
                      className={clsx(
                        'relative flex items-center justify-center overflow-hidden rounded-2xl bg-white p-6',
                        'min-h-[220px] md:min-h-[260px]',
                      )}
                      aria-hidden
                    >
                      {/* Big accent circle */}
                      <div
                        className="absolute -inset-0 m-auto rounded-full opacity-90"
                        style={{
                          width: s.accentIconSize ?? 120,
                          height: s.accentIconSize ?? 120,
                          boxShadow:
                            '0 18px 30px rgba(0,0,0,0.06), inset 0 10px 30px rgba(255,255,255,0.85)',
                          background: s.accentBg
                            ? 'radial-gradient(closest-side,#ffffff,#f1f1f1)'
                            : 'transparent',
                        }}
                      />

                      {/* Icon or Image */}
                      {s.icon ? (
                        <div className="relative z-10 h-20 w-20">
                          <Image src={s.icon} alt={s.title || 'icon'} width={96} height={96} />
                        </div>
                      ) : s.image?.asset?.url ? (
                        <div className="relative z-10 h-[160px] w-full max-w-[320px]">
                          <Image
                            src={s.image.asset.url}
                            alt={s.title || 'service image'}
                            width={s.accentIconSize ?? 180}
                            height={s.accentIconSize ?? 180}
                            className="object-contain"
                          />
                        </div>
                      ) : (
                        <div className="z-10 text-black/80">🔧</div>
                      )}
                    </div>
                  </div>

                  {/* Content block */}
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <div className="rounded-full border p-2">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                              <circle cx="11" cy="11" r="8" stroke="black" strokeWidth="1.2" />
                              <path
                                d="M21 21L16.65 16.65"
                                stroke="black"
                                strokeWidth="1.6"
                                strokeLinecap="round"
                              />
                            </svg>
                          </div>
                          <Heading as="h3" variant="h4" className="text-xl">
                            {s.title}
                          </Heading>
                        </div>

                        {s.pretitle && (
                          <Text as="p" variant="eyebrow" className="mt-2 text-sm text-gray-500">
                            {s.pretitle}
                          </Text>
                        )}
                      </div>

                      {/* Book a Call CTA */}
                      {s.bookCallCta?.label && s.bookCallCta?.href && (
                        <CTA
                          href={s.bookCallCta.href}
                          className="rounded-full shadow-(--shadow-badge)"
                        >
                          {s.bookCallCta.label}
                        </CTA>
                      )}
                    </div>

                    {s.description && (
                      <Text as="p" variant="body" className="text-gray-600">
                        <PortableText value={s.description} />
                      </Text>
                    )}

                    {/* Keywords ticker */}
                    <div className="mt-4">
                      <KeywordTicker keywords={s.keywords} />
                    </div>

                    {/* Chips */}
                    <div className="flex flex-wrap gap-3 pt-2">
                      {(s.keywords ?? []).slice(0, 6).map((k, i) => (
                        <div
                          key={i}
                          className="rounded-full bg-white px-4 py-2 text-sm font-medium shadow-(--shadow-badge)"
                        >
                          {k}
                        </div>
                      ))}
                    </div>

                    {/* CTAs */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {(s.ctas ?? []).map((c, i) => (
                        <CTA key={i} href={c.href} className="shadow-(--shadow-badge)">
                          {c.label}
                        </CTA>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

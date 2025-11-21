'use client'

import React, { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'
import { PortableText } from 'next-sanity'
import Script from 'next/script'
import type {
  PortableTextBlock,
  PortableTextComponents,
  PortableTextComponentProps,
  PortableTextMarkComponentProps,
} from 'next-sanity'
import { toPlainText } from '@portabletext/toolkit'
import type { PortableTextLink } from '@portabletext/types'

type FAQItem = {
  _key: string
  question: string
  answer: PortableTextBlock[]
  open?: boolean
}

interface FaqProps {
  pretitle?: string
  title?: string
  description?: PortableTextBlock[]
  items?: FAQItem[]
  accessibleAccordion?: boolean
  generateSchema?: boolean
}

// PortableText components override specifically for FAQ answers
const portableComponents: PortableTextComponents = {
  marks: {
    link: ({ children, value }: PortableTextMarkComponentProps<PortableTextLink>) => {
      const href = value?.href ?? '#'
      const isExternal = /^https?:\/\//i.test(href) && !href.startsWith('/')
      return (
        <a
          href={href}
          rel="noopener noreferrer"
          target={isExternal ? '_blank' : undefined}
          className="underline hover:opacity-90"
        >
          {children}
        </a>
      )
    },
  },
  types: {
    code: ({ value }: PortableTextComponentProps<Sanity.Code>) => {
      return (
        <pre className="overflow-auto rounded-md border p-3 text-sm">
          <code>{value?.code ?? ''}</code>
        </pre>
      )
    },
  },
}

export default function Faq({
  pretitle,
  title,
  description,
  items = [],
  accessibleAccordion = true,
  generateSchema = true,
}: Readonly<FaqProps>) {
  const [openItemKey, setOpenItemKey] = useState<string | null>(
    () => items.find((item) => item.open)?._key ?? null,
  )

  useEffect(() => {
    setOpenItemKey((current) => {
      if (current && items.some((item) => item._key === current)) {
        return current
      }
      return items.find((item) => item.open)?._key ?? null
    })
  }, [items])

  const schemaMarkup =
    generateSchema && items.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: toPlainText(item.answer ?? []),
            },
          })),
        }
      : null

  return (
    <div className="py-8" aria-label="Frequently Asked Questions">
      {schemaMarkup && (
        <Script
          strategy="afterInteractive"
          id={`faq-schema-${items[0]?._key ?? 'default'}`}
          type="application/ld+json"
        >
          {JSON.stringify(schemaMarkup)}
        </Script>
      )}

      <div className="container mx-auto grid max-w-6xl gap-2 px-4 md:grid-cols-2">
        {/* Left Column: Text Content */}
        <div className="flex flex-col">
          {pretitle && (
            <Badge
              variant="outline"
              className="mb-4 gap-2 rounded-full px-4 py-1.5 shadow-(--shadow-badge)"
            >
              <span className="h-3 w-3 rounded-full bg-black"></span>
              <Text as="span" variant="eyebrow" className="text-ink">
                {pretitle}
              </Text>
            </Badge>
          )}

          {title && (
            <div>
              <Heading
                as="h2"
                variant="h2"
                className="relative mt-4 mb-2 inline-block text-gray-900"
              >
                {title}
                <span className="absolute -bottom-[18px] left-1/2 h-[2px] w-[90%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
              </Heading>
            </div>
          )}

          {description && (
            <Text as="p" variant="body" className="mt-4 max-w-md text-gray-500">
              <PortableText value={description} components={portableComponents} />
            </Text>
          )}
        </div>

        {/* Right Column: shadcn Accordion (single, collapsible) */}
        <div className="space-y-4">
          <Accordion
            type="single"
            collapsible
            value={openItemKey ?? undefined}
            onValueChange={(val: string | undefined) => setOpenItemKey(val ?? null)}
            aria-label={accessibleAccordion ? 'Frequently Asked Questions' : undefined}
          >
            {items.map((item) => {
              const panelId = `faq-panel-${item._key}`
              const buttonId = `faq-button-${item._key}`

              return (
                <AccordionItem
                  key={item._key}
                  value={item._key}
                  className={clsx(
                    'relative mb-4 overflow-hidden rounded-[20px] shadow-(--shadow-badge) transition-shadow duration-300',
                  )}
                >
                  <h3>
                    <AccordionTrigger
                      id={buttonId}
                      aria-controls={panelId}
                      className={clsx(
                        'flex w-full items-center justify-between px-6 py-5 text-left transition-all duration-200 focus:outline-none',
                        'focus-visible:ring-primary/60 hover:no-underline focus-visible:ring-2 focus-visible:ring-offset-2',
                        'rounded-[20px]',
                        'relative z-10',
                      )}
                    >
                      <Text as="span" variant="body" className="pr-4 break-words text-gray-800">
                        {item.question}
                      </Text>
                    </AccordionTrigger>
                  </h3>

                  <AccordionContent
                    id={panelId}
                    aria-labelledby={buttonId}
                    className="overflow-hidden rounded-b-[20px] px-6 pt-0 pb-6"
                  >
                    <Text as="p" variant="body" className="mt-2 text-gray-600">
                      <PortableText value={item.answer} components={portableComponents} />
                    </Text>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>
    </div>
  )
}

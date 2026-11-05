'use client'

import React, { useState } from 'react'
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
import Script from 'next/script'
import type {
  PortableTextBlock,
  PortableTextComponents,
  PortableTextComponentProps,
  PortableTextMarkComponentProps,
} from 'next-sanity'
import { toPlainText } from '@portabletext/toolkit'
import type { PortableTextLink } from '@portabletext/types'
import PortableText from '@/ui/PortableText'
import { useDictionary } from '@/i18n/DictionaryProvider'

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

interface FaqProps {
  pretitle?: string
  title?: string
  description?: PortableTextBlock[]
  items?: Sanity.FAQItem[]
  accessibleAccordion?: boolean
  generateSchema?: boolean
}

export default function Faq({
  pretitle,
  title,
  description,
  items = [],
  accessibleAccordion = true,
  generateSchema = true,
}: Readonly<FaqProps>) {
  const { common } = useDictionary()
  // `undefined` until the visitor opens or closes an item. Until then, and whenever the chosen
  // item is gone (live editing), the item marked `open` in the Studio is open.
  const [chosenKey, setOpenItemKey] = useState<string | null>()
  const openItemKey =
    chosenKey === null || items.some((item) => item._key === chosenKey)
      ? chosenKey
      : (items.find((item) => item.open)?._key ?? null)

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
    <div className="py-8" aria-label={common.faq}>
      {schemaMarkup && (
        <Script
          strategy="afterInteractive"
          id={`faq-schema-${items[0]?._key ?? 'default'}`}
          type="application/ld+json"
        >
          {JSON.stringify(schemaMarkup)}
        </Script>
      )}

      <div className="container mx-auto max-w-6xl space-y-8 px-4">
        {/* Left Column: Text Content */}
        <div className="flex w-full flex-col items-center">
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
                className="relative mt-4 mb-2 inline-block text-center text-gray-900"
              >
                {title}
                <span className="absolute -bottom-[18px] left-1/2 h-[2px] w-[90%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
              </Heading>
            </div>
          )}

          {description && (
            <Text
              as="div"
              variant="body"
              className="mt-4 max-w-[45rem] text-center text-gray-800 md:text-left"
            >
              <PortableText value={description} components={portableComponents} />
            </Text>
          )}
        </div>

        {/* Right Column: shadcn Accordion (single, collapsible) */}
        <div className="mx-auto w-full max-w-4xl space-y-4">
          <Accordion
            type="single"
            collapsible
            value={openItemKey ?? ''}
            // Radix reports closing the open item as ''.
            onValueChange={(val: string) => setOpenItemKey(val || null)}
            aria-label={accessibleAccordion ? common.faq : undefined}
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
                  <AccordionTrigger
                    id={buttonId}
                    aria-controls={panelId}
                    className={clsx(
                      'flex w-full items-center justify-between px-6 py-5 text-left transition-all duration-200 focus:outline-none',
                      'hover:no-underline focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2',
                      'rounded-[20px]',
                      'relative z-0',
                    )}
                  >
                    <Text as="span" variant="body" className="pr-4 break-words text-gray-800">
                      {item.question}
                    </Text>
                  </AccordionTrigger>

                  <AccordionContent
                    id={panelId}
                    aria-labelledby={buttonId}
                    className="overflow-hidden rounded-b-[20px] px-6 pt-0 pb-6"
                  >
                    <Text as="div" variant="body" className="mt-2 text-gray-600">
                      {item.answer && (
                        <PortableText value={item.answer} components={portableComponents} />
                      )}
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

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
import { PortableText } from 'next-sanity'
import type {
  PortableTextBlock,
  PortableTextComponents,
  PortableTextComponentProps,
  PortableTextMarkComponentProps,
} from 'next-sanity'
import type { PortableTextLink, PortableTextSpan } from '@portabletext/types'

type FAQItem = {
  _key: string
  question: string
  answer: PortableTextBlock[]
}

interface FaqProps {
  pretitle?: string
  title?: string
  description?: PortableTextBlock[]
  items?: FAQItem[]
  accessibleAccordion?: boolean
  generateSchema?: boolean
}

const isPortableTextSpan = (
  child: PortableTextBlock['children'][number] | undefined,
): child is PortableTextSpan =>
  Boolean(child && typeof child === 'object' && child._type === 'span')

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
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const schemaMarkup =
    generateSchema && items?.length
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: items.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: (item.answer || [])
                .map((block: PortableTextBlock) =>
                  block.children
                    .map((child) => (isPortableTextSpan(child) ? child.text : ''))
                    .join(' '),
                )
                .join('\n')
                .trim(),
            },
          })),
        }
      : null

  return (
    <div className="py-8 md:py-24" aria-label="Frequently Asked Questions">
      {schemaMarkup && <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>}

      <div className="container mx-auto grid max-w-6xl gap-2 px-4 md:grid-cols-2">
        {/* Left Column: Text Content */}
        <div className="flex flex-col">
          {pretitle && (
            <Badge
              variant="outline"
              className="mb-4 gap-2 rounded-full px-4 py-1.5 text-xl font-semibold tracking-[0.1em] shadow-(--shadow-badge)"
            >
              <span className="h-3 w-3 rounded-full bg-black"></span>
              {pretitle}
            </Badge>
          )}

          {title && (
            <div>
              <h2 className="relative mt-4 mb-2 inline-block text-4xl leading-tight font-semibold text-gray-900">
                {title}
                <span className="absolute -bottom-[18px] left-1/2 h-[2px] w-[90%] -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
              </h2>
            </div>
          )}

          {description && (
            <div className="mt-4 max-w-md text-base leading-relaxed text-gray-500">
              <PortableText value={description} components={portableComponents} />
            </div>
          )}
        </div>

        {/* Right Column: shadcn Accordion (single, collapsible) */}
        <div className="space-y-4">
          <Accordion
            type="single"
            collapsible
            value={openIndex === null ? undefined : String(openIndex)}
            onValueChange={(val: string | undefined) => setOpenIndex(val ? Number(val) : null)}
            aria-label={accessibleAccordion ? 'Frequently Asked Questions' : undefined}
          >
            {items.map((item, i) => {
              const panelId = `faq-panel-${i}`
              const buttonId = `faq-button-${i}`

              return (
                <AccordionItem
                  key={item._key || i}
                  value={String(i)}
                  className={clsx(
                    'relative mb-4 overflow-hidden rounded-[20px] shadow-(--shadow-badge) transition-shadow duration-300',
                  )}
                >
                  <h3>
                    <AccordionTrigger
                      id={buttonId}
                      aria-controls={panelId}
                      className={clsx(
                        'flex w-full items-center justify-between px-6 py-5 text-left text-base font-medium text-gray-800 transition-all duration-200 focus:outline-none',
                        'focus-visible:ring-primary/60 hover:no-underline focus-visible:ring-2 focus-visible:ring-offset-2',
                        'rounded-[20px]',
                        'relative z-10',
                      )}
                    >
                      <span className="pr-4 break-words">{item.question}</span>
                    </AccordionTrigger>
                  </h3>

                  <AccordionContent
                    id={panelId}
                    aria-labelledby={buttonId}
                    className="overflow-hidden rounded-b-[20px] px-6 pt-0 pb-6"
                  >
                    <div className="mt-2 text-base leading-relaxed text-gray-600">
                      <PortableText value={item.answer} components={portableComponents} />
                    </div>
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

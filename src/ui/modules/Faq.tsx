'use client'

import React, { useState } from 'react'
import { PortableText } from 'next-sanity'
import clsx from 'clsx'
import { Badge } from '@/components/ui/badge'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'

type FAQItem = {
  _key: string
  question: string
  answer: any[]
}

interface FaqProps {
  pretitle?: string
  title?: string
  description?: any[]
  items?: FAQItem[]
  accessibleAccordion?: boolean
  generateSchema?: boolean
}

// PortableText components override specifically for FAQ answers
const portableComponents = {
  marks: {
    link: ({ children, value }: any) => {
      const href = value?.href || '#'
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
    code: ({ value }: any) => {
      return (
        <pre className="rounded-md border p-3 overflow-auto text-sm">
          <code>{value?.code ?? value?.children ?? ''}</code>
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
}: FaqProps) {
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
                .map((block: any) =>
                  (block.children || [])
                    .map((c: any) => c?.text || '')
                    .join(' ')
                )
                .join('\n')
                .trim(),
            },
          })),
        }
      : null

  return (
    <section
      className="py-8 md:py-24 bg-gradient-to-br from-gray-50 to-white"
      aria-label="Frequently Asked Questions"
    >
      {schemaMarkup && (
        <script type="application/ld+json">
          {JSON.stringify(schemaMarkup)}
        </script>
      )}

      <div className="container mx-auto px-4 max-w-6xl grid md:grid-cols-2 gap-2">
        {/* Left Column: Text Content */}
        <div className="flex flex-col">
          {pretitle && (
            <Badge
              variant="outline"
              className="gap-2 rounded-full px-4 py-1.5 text-xl font-semibold tracking-[0.1em] shadow-(--shadow-badge) mb-4"
            >
              <span className="w-3 h-3 bg-black rounded-full"></span>
              {pretitle}
            </Badge>
          )}

          {title && (
            <div>
              <h2 className="relative text-4xl font-semibold text-gray-900 mb-4 leading-tight mt-4 mb-2 inline-block">
                {title}
                <span className="absolute -bottom-[18px] left-1/2 w-[90%] h-[2px] -translate-x-1/2 bg-gradient-to-r from-transparent via-gray-500 to-transparent" />
              </h2>
            </div>
          )}

          {description && (
            <div className="text-gray-500 text-base leading-relaxed max-w-md mt-4">
              <PortableText value={description} components={portableComponents} />
            </div>
          )}
        </div>

        {/* Right Column: shadcn Accordion (single, collapsible) */}
        <div className="space-y-4">
          <Accordion
            type="single"
            collapsible
            value={openIndex !== null ? String(openIndex) : undefined}
            onValueChange={(val: string | undefined) =>
              setOpenIndex(val ? Number(val) : null)
            }
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
                    'relative bg-white border border-gray-100 overflow-hidden transition-shadow mb-4 duration-300 rounded-[20px] shadow-(--shadow-badge)'
                  )}
                >
                  <h3>
                    <AccordionTrigger
                      id={buttonId}
                      aria-controls={panelId}
                      className={clsx(
                        'w-full flex items-center justify-between text-left px-6 py-5 text-base font-medium text-gray-800 transition-all duration-200 focus:outline-none',
                        'hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60',
                        'rounded-[20px]',
                        'relative z-10'
                      )}
                    >
                      <span className="pr-4 break-words">{item.question}</span>
                    </AccordionTrigger>
                  </h3>

                  <AccordionContent
                    id={panelId}
                    role="region"
                    aria-labelledby={buttonId}
                    className="px-6 pb-6 pt-0 overflow-hidden rounded-b-[20px]"
                  >
                    <div className="text-gray-600 mt-2 leading-relaxed text-base">
                      <PortableText value={item.answer} components={portableComponents} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </div>
      </div>
    </section>
  )
}

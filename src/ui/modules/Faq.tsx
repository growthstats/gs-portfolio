'use client'

import { useState, useRef } from 'react'
import { PortableText } from 'next-sanity'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { Badge } from '@/components/ui/badge'

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

export default function Faq({
  pretitle,
  title,
  description,
  items = [],
  accessibleAccordion = true,
  generateSchema = true,
}: FaqProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([])

  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i))

  const handleKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (!accessibleAccordion) return
    const total = items.length
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      buttonsRef.current[(i + 1) % total]?.focus()
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      buttonsRef.current[(i - 1 + total) % total]?.focus()
    }
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle(i)
    }
  }

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
              text: item.answer
                ?.map((block) =>
                  block.children?.map((c: any) => c.text).join(' ')
                )
                .join('\n'),
            },
          })),
        }
      : null

  return (
    <section
      className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white"
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
              <PortableText value={description} />
            </div>
          )}
        </div>

        {/* Right Column: FAQ Accordion */}
        <div className="space-y-4">
          {items.map((item, i) => {
            const isOpen = openIndex === i
            const panelId = `faq-panel-${i}`
            const buttonId = `faq-button-${i}`

            return (
              <motion.div
                key={item._key || i}
                layout
                transition={{ duration: 0.32, ease: 'easeInOut' }}
                className={clsx(
                  'relative bg-white border border-gray-100 overflow-hidden transition-shadow duration-300 rounded-[20px] shadow-(--shadow-badge)'
                )}
              >
                <h3>
                  <button
                    id={buttonId}
                    ref={(el) => {
                      buttonsRef.current[i] = el
                    }}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className={clsx(
                      'w-full flex items-center justify-between text-left px-6 py-5 text-base font-medium text-gray-800 transition-all duration-200 focus:outline-none',
                      'hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary/60',
                      'rounded-[20px]',
                      'relative z-10'
                    )}
                  >
                    <span className="pr-4 break-words">{item.question}</span>

                    {/* Chevron Circle - updated to match pill shape */}
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.28 }}
                      className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white/95"
                      style={{
                        boxShadow:
                          '0 6px 14px rgba(13, 19, 35, 0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
                        border: '1px solid rgba(0,0,0,0.04)',
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-500"
                        aria-hidden
                        focusable="false"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </motion.span>
                  </button>
                </h3>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={buttonId}
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.34, ease: 'easeInOut' }}
                      className="px-6 pb-6 pt-0 overflow-hidden rounded-b-[20px]"
                    >
                      <div className="text-gray-600 mt-2 leading-relaxed text-base">
                        <PortableText value={item.answer} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
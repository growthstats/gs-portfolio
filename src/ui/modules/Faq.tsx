'use client'

import { useState, useRef } from 'react'
import { PortableText } from 'next-sanity'
import { motion, AnimatePresence } from 'framer-motion'
import clsx from 'clsx'
import { Badge } from "@/components/ui/badge";

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

      <div className="container mx-auto px-4 max-w-5xl grid md:grid-cols-2 gap-12">
        {/* Left Column: Text Content */}
        <div className="flex flex-col justify-center">
        {pretitle && (
          <Badge
          variant="outline"
          className="gap-2 rounded-full px-4 py-1.5 text-xl font-semibold tracking-[0.1em] shadow-(--shadow-badge) mb-4"
        >
          {<span className="w-3 h-3 bg-black rounded-full"></span>}

          {pretitle}
        </Badge>
)}
          {title && (
            <h2 className="text-4xl font-semibold text-gray-900 mb-4 leading-tight mt-4">
              {title}
            </h2>
          )}
          {description && (
            <div className="text-gray-500 text-base leading-relaxed max-w-md">
              <PortableText value={description} />
            </div>
          )}
        </div>

        {/* Right Column: Accordion Items */}
        <div className="space-y-4">
          {items.map((item, i) => {
            const isOpen = openIndex === i
            const panelId = `faq-panel-${i}`
            const buttonId = `faq-button-${i}`

            return (
              <motion.div
                key={item._key || i}
                layout
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className={clsx(
                  'rounded-xl bg-white shadow-[0_4px_12px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden',
                  isOpen && 'shadow-[0_6px_20px_rgba(0,0,0,0.08)]'
                )}
              >
                <h3>
                  <button
                    id={buttonId}
                    ref={(el) => {buttonsRef.current[i] = el}}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggle(i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className={clsx(
                      'w-full flex justify-between items-center text-left px-6 py-4 text-base font-medium text-gray-800 transition-all duration-300 focus:outline-none',
                      'hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-primary rounded-xl'
                    )}
                  >
                    <span className="pr-4">{item.question}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-gray-500 bg-gray-100 p-2 rounded-full"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
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
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="px-6 pb-6 pt-0"
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
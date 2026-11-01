'use client'

import React from 'react'
import { Badge } from '@/components/ui/badge'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'
import CTA from '@/ui/CTA'
import { useDictionary } from '@/i18n/DictionaryProvider'

const JoinUsPlaceholder = () => {
  const { joinUs } = useDictionary()

  return (
    <div className="flex w-full justify-center py-2">
      <div className="flex w-full flex-col items-center rounded-3xl bg-[#F0F0F0] px-4 py-8 text-center shadow-(--shadow-badge)">
        <Badge
          variant="outline"
          className="mb-4 gap-2 rounded-full px-4 py-1.5 shadow-(--shadow-badge)"
        >
          <span className="h-3 w-3 rounded-full bg-black"></span>
          <Text as="span" variant="eyebrow" className="text-ink">
            {joinUs.badge}
          </Text>
        </Badge>

        {/* Main Heading */}
        <Heading
          as="h2"
          variant="h2"
          className="max-w-3xl text-3xl leading-snug font-semibold sm:text-4xl lg:text-5xl"
        >
          {/* TODO: Check SEO Implications of breaking sentence */}
          <span className="bg-clip-text">{joinUs.headingLine1}</span>
          <br />

          <span className="text-black">{joinUs.headingLine2}</span>
        </Heading>

        {/* Description */}
        <Text as="p" variant="body" className="text-ink/80 mt-4 max-w-xl">
          {joinUs.text}
        </Text>

        {/* Bottom Button */}
        <CTA
          style={'ghost'}
          className="mt-8 px-8 py-3 font-medium shadow-(--shadow-badge)"
          link={{
            _key: '1',
            _type: 'link',
            label: joinUs.cta,
            type: 'internal',
            internal: {
              _type: 'page',
              metadata: { slug: { current: 'contact' } },
            } as unknown as Sanity.Page,
          }}
        />
      </div>
    </div>
  )
}

export default JoinUsPlaceholder

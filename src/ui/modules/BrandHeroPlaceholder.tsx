'use client'

import moduleProps from '@/lib/moduleProps'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'
import CTA from '../CTA'
import { useDictionary } from '@/i18n/DictionaryProvider'

export default function BrandHeroPlaceholder({ ...props }: Readonly<Sanity.Module>) {
  const { brandHero } = useDictionary()
  const { services } = brandHero

  return (
    <div className="section" {...moduleProps(props)}>
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[6fr_4fr]">
        <div className="space-y-5 p-6 text-center md:text-start">
          <Heading as="h2" variant="display-hero" className="flex flex-col text-balance">
            <span>{brandHero.headingLine1}</span>
            <span>{brandHero.headingLine2}</span>
            <span>{brandHero.headingLine3}</span>
          </Heading>
          <Text>{brandHero.intro}</Text>
          <CTA
            style={'secondary'}
            link={{
              _key: 'brand-hero-placeholder-cta',
              _type: 'link',
              label: brandHero.cta,
              type: 'internal',
              internal: {
                _type: 'page',
                metadata: { slug: { current: 'contact' } },
              } as unknown as Sanity.Page,
            }}
          />
        </div>

        <div className="hidden grid-cols-2 gap-5 overflow-hidden p-6 md:grid">
          {/* Inner col 1 */}
          <div className="animate-float-updown-slow mt-5 space-y-2.5">
            <div className="flex h-22 items-center justify-center rounded-xl text-center shadow-(--shadow-card)">
              <Text>{services.keywordResearch}</Text>
            </div>
            <div className="flex h-22 items-center justify-center rounded-xl text-center shadow-(--shadow-card)">
              <Text>{services.technicalSeo}</Text>
            </div>
            <div className="flex h-22 items-center justify-center rounded-xl text-center shadow-(--shadow-card)">
              <Text>{services.localSeo}</Text>
            </div>
            <div className="flex h-22 items-center justify-center rounded-xl text-center shadow-(--shadow-card)">
              <Text>{services.campaignManagement}</Text>
            </div>
          </div>

          {/* Inner col 2 */}
          <div className="animate-float-updown-slow-delayed space-y-2.5">
            <div className="flex h-22 items-center justify-center rounded-xl text-center shadow-(--shadow-card)">
              <Text>{services.uiUx}</Text>
            </div>
            <div className="flex h-22 items-center justify-center rounded-xl text-center shadow-(--shadow-card)">
              <Text>{services.webDevelopment}</Text>
            </div>
            <div className="flex h-22 items-center justify-center rounded-xl text-center shadow-(--shadow-card)">
              <Text>{services.emailMarketing}</Text>
            </div>
            <div className="flex h-22 items-center justify-center rounded-xl text-center shadow-(--shadow-card)">
              <Text>{services.performanceMarketing}</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

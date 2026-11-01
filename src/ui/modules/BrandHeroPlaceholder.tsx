'use client'

import moduleProps from '@/lib/moduleProps'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'
import CTA from '../CTA'
import { useDictionary } from '@/i18n/DictionaryProvider'
import type { Dictionary } from '@/i18n'

type Service = keyof Dictionary['brandHero']['services']

const SERVICE_COLUMNS: Service[][] = [
  ['keywordResearch', 'technicalSeo', 'localSeo', 'campaignManagement'],
  ['uiUx', 'webDevelopment', 'emailMarketing', 'performanceMarketing'],
]

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
          {SERVICE_COLUMNS.map((column, index) => (
            <div
              key={index}
              className={
                index === 0
                  ? 'animate-float-updown-slow mt-5 space-y-2.5'
                  : 'animate-float-updown-slow-delayed space-y-2.5'
              }
            >
              {column.map((service) => (
                <div
                  key={service}
                  className="flex h-22 items-center justify-center rounded-xl text-center shadow-(--shadow-card)"
                >
                  <Text>{services[service]}</Text>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

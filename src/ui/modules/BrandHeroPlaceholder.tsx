import moduleProps from '@/lib/moduleProps'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'
import CTA from '../CTA'

export default function BrandHeroPlaceholder({ ...props }: Readonly<Sanity.Module>) {
  return (
    <div className="section" {...moduleProps(props)}>
      <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[6fr_4fr]">
        <div className="space-y-5 p-6 text-center md:text-start">
          <Heading as="h2" variant="display-hero" className="flex flex-col text-balance">
            <span>Get the Growth</span>
            <span>Your Brand</span>
            <span>Deserves</span>
          </Heading>
          <Text muted>
            We believe that every business deserves a website that truly represents them and their
            unique brand. We&apos;ll work closely with you to understand your business and create a
            website that not only looks great, but also delivers results.
          </Text>
          <CTA
            style={'secondary'}
            link={{
              _type: 'link',
              label: `Let's Work Together`,
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
              <Text>Keyword Research</Text>
            </div>
            <div className="flex h-22 items-center justify-center rounded-xl text-center shadow-(--shadow-card)">
              <Text>Technical SEO</Text>
            </div>
            <div className="flex h-22 items-center justify-center rounded-xl text-center shadow-(--shadow-card)">
              <Text>Local SEO</Text>
            </div>
            <div className="flex h-22 items-center justify-center rounded-xl text-center shadow-(--shadow-card)">
              <Text>Campaign Management</Text>
            </div>
          </div>

          {/* Inner col 2 */}
          <div className="animate-float-updown-slow-delayed space-y-2.5">
            <div className="flex h-22 items-center justify-center rounded-xl text-center shadow-(--shadow-card)">
              <Text>UI UX</Text>
            </div>
            <div className="flex h-22 items-center justify-center rounded-xl text-center shadow-(--shadow-card)">
              <Text>Web Development</Text>
            </div>
            <div className="flex h-22 items-center justify-center rounded-xl text-center shadow-(--shadow-card)">
              <Text>Email Marketing</Text>
            </div>
            <div className="flex h-22 items-center justify-center rounded-xl text-center shadow-(--shadow-card)">
              <Text>Performance Marketing</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

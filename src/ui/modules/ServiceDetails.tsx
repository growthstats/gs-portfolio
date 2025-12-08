import moduleProps from '@/lib/moduleProps'
import CTAList from '@/ui/CTAList'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'
import { Img } from '@/ui/Img'

export default function ServiceDetails({
  title,
  description,
  ctas,
  features,
  ...props
}: Partial<Sanity.ServiceDetailsModule> & Sanity.Module) {
  const ctaList = ctas ? [{ ...ctas, _key: ctas._key ?? 'service-cta' }] : undefined
  const hasFeatures = !!features?.length

  return (
    <section className="section space-y-12" {...moduleProps(props)}>
      <div className="from-ink/5 space-y-5 rounded-[28px] bg-gradient-to-br via-white to-amber-50/80 p-8">
        <Heading as="h2" variant="h1" className="text-balance">
          {title}
        </Heading>
        {description && (
          <Text variant="body-lg" muted className="text-ink/75 whitespace-pre-line">
            {description}
          </Text>
        )}
        <CTAList ctas={ctaList} className="pt-2" />
      </div>

      {hasFeatures && (
        <div className="grid gap-8 md:grid-cols-2">
          {features?.map((feature, index) => (
            <FeatureCard feature={feature} key={feature?._key ?? index} />
          ))}
        </div>
      )}
    </section>
  )
}

function FeatureCard({ feature }: Readonly<{ feature?: Sanity.ServiceFeature }>) {
  if (!feature) return null

  const { name, description, img } = feature

  return (
    <article className="border-ink/5 via-ink/3 ring-ink/5 overflow-hidden rounded-3xl border bg-gradient-to-br from-white to-amber-50/60 p-6 shadow-sm ring-1 backdrop-blur-sm md:p-8">
      <div className="grid gap-6 md:grid-cols-[1.05fr,0.95fr] md:items-center">
        <div className="space-y-4">
          <Heading as="h3" variant="h3" className="text-balance">
            {name || 'Untitled feature'}
          </Heading>

          {description && (
            <Text muted className="text-ink/75 whitespace-pre-line">
              {description}
            </Text>
          )}
        </div>

        {img && (
          <div className="bg-ink/5 relative isolate aspect-video overflow-hidden rounded-2xl shadow-[var(--shadow-card)]">
            <Img image={img} className="size-full object-cover" />
            {img.caption && (
              <Text
                variant="technical"
                className="text-canvas absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent px-4 pt-8 pb-3"
              >
                {img.caption}
              </Text>
            )}
          </div>
        )}
      </div>
    </article>
  )
}

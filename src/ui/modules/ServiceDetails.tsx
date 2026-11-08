import moduleProps from '@/lib/moduleProps'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'
import { Img } from '@/ui/Img'
import { getDictionary } from '@/i18n'
import type { ModuleProps } from '@/sanity/queries/page.groq'

export default function ServiceDetails({
  lang,
  features,
  ...props
}: ModuleProps<'service-details'>) {
  if (!features?.length) return null

  const { services } = getDictionary(lang)

  return (
    <section className="section space-y-10" {...moduleProps(props)}>
      <Heading as="h2" variant="h1" className="text-center text-balance">
        {services.featuresHeading}
      </Heading>

      <div className="grid gap-8 md:grid-cols-2">
        {features.map((feature, index) => (
          <FeatureCard
            feature={feature}
            fallbackAlt={services.featureAlt}
            key={feature?._key ?? index}
          />
        ))}
      </div>
    </section>
  )
}

function FeatureCard({
  feature,
  fallbackAlt,
}: Readonly<{
  feature?: NonNullable<ModuleProps<'service-details'>['features']>[number]
  fallbackAlt: string
}>) {
  if (!feature) return null

  const { name, description, img } = feature

  return (
    <article className="flex flex-col items-center overflow-hidden rounded-3xl p-6 text-center shadow-(--shadow-badge)">
      <div className="relative -mt-10 mb-4 flex items-center justify-center">
        <div className="mt-8 flex items-center justify-center rounded-2xl p-6 shadow-(--shadow-badge)">
          {img ? (
            <div className="h-full w-full">
              <Img
                image={img}
                width={150}
                height={150}
                className="h-full w-full object-contain"
                alt={name || fallbackAlt}
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl">🔧</div>
          )}
        </div>
      </div>

      <Heading as="h3" variant="h3" className="mt-1 text-balance">
        {name || 'Untitled feature'}
      </Heading>

      {description && (
        <div className="mt-4 max-w-[36rem]">
          <Text muted className="whitespace-pre-line text-ink/80">
            {description}
          </Text>
        </div>
      )}

      {img?.caption && (
        <Text variant="technical" className="mt-4 block w-full px-3 text-sm text-canvas">
          {img.caption}
        </Text>
      )}
    </article>
  )
}

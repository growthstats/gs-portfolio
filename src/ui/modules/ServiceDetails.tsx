import moduleProps from '@/lib/moduleProps'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'
import { Img } from '@/ui/Img'

export default function ServiceDetails({
  features,
  ...props
}: Partial<Sanity.ServiceDetailsModule> & Sanity.Module) {
  if (!features?.length) return null

  return (
    <section className="section space-y-10" {...moduleProps(props)}>
      <Heading as="h2" variant="h1" className="text-center text-balance">
        Our Features
      </Heading>

      <div className="grid gap-8 md:grid-cols-2">
        {features.map((feature, index) => (
          <FeatureCard feature={feature} key={feature?._key ?? index} />
        ))}
      </div>
    </section>
  )
}

function FeatureCard({ feature }: Readonly<{ feature?: Sanity.ServiceFeature }>) {
  if (!feature) return null

  const { name, description, img } = feature
  const hasImage = Boolean(img?.asset)

  return (
    <article className="flex flex-col items-center overflow-hidden rounded-3xl p-6 text-center shadow-(--shadow-badge)">
      <div className="relative -mt-10 mb-4 flex items-center justify-center">
        <div className="mt-8 flex items-center justify-center rounded-2xl p-6 shadow-(--shadow-badge)">
          {hasImage ? (
            <div className="h-full w-full">
              <Img
                image={img}
                width={150}
                height={150}
                className="h-full w-full object-contain"
                alt={name || 'feature'}
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
          <Text muted className="text-ink/75 whitespace-pre-line">
            {description}
          </Text>
        </div>
      )}

      {img?.caption && (
        <Text variant="technical" className="text-canvas mt-4 block w-full px-3 text-sm">
          {img.caption}
        </Text>
      )}
    </article>
  )
}

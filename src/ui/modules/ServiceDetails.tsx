import moduleProps from '@/lib/moduleProps'
import CTA from '@/ui/CTA'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'
import { Img } from '@/ui/Img'

function CustomIcon() {
  return (
    <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="23" height="23" rx="11.5" fill="black" />
      <path
        d="M15.8334 10.173C15.6113 10.173 15.4271 9.98883 15.4271 9.76675V7.573H13.2334C13.0113 7.573 12.8271 7.38883 12.8271 7.16675C12.8271 6.94466 13.0113 6.7605 13.2334 6.7605H15.8334C16.0555 6.7605 16.2396 6.94466 16.2396 7.16675V9.76675C16.2396 9.98883 16.0555 10.173 15.8334 10.173Z"
        fill="white"
      />
      <path
        d="M11.3859 12.697L9.61467 14.4683C9.41967 14.2949 9.23009 14.1162 9.04592 13.932C8.48801 13.3687 7.98426 12.7783 7.53467 12.1608C7.09051 11.5433 6.73301 10.9258 6.47301 10.3137C6.21301 9.69617 6.08301 9.10575 6.08301 8.54242C6.08301 8.17409 6.14801 7.822 6.27801 7.497C6.40801 7.16659 6.61384 6.86325 6.90092 6.59242C7.24759 6.25117 7.62676 6.08325 8.02759 6.08325C8.17926 6.08325 8.33092 6.11575 8.46634 6.18075C8.60717 6.24575 8.73176 6.34325 8.82926 6.48409L10.0859 8.25534C10.1834 8.39075 10.2538 8.51534 10.3026 8.6345C10.3513 8.74825 10.3784 8.862 10.3784 8.96492C10.3784 9.09492 10.3405 9.22492 10.2647 9.3495C10.1943 9.47409 10.0913 9.60409 9.96134 9.73409L9.54967 10.162C9.49009 10.2216 9.46301 10.292 9.46301 10.3787C9.46301 10.422 9.46842 10.4599 9.47926 10.5033C9.49551 10.5466 9.51176 10.5791 9.52259 10.6116C9.62009 10.7903 9.78801 11.0233 10.0263 11.3049C10.2701 11.5866 10.5301 11.8737 10.8118 12.1608C11.0068 12.3503 11.1963 12.5345 11.3859 12.697Z"
        fill="white"
      />
      <path
        d="M16.9006 14.9287C16.9006 15.0804 16.8735 15.2375 16.8194 15.3891C16.8031 15.4325 16.7869 15.4758 16.7652 15.5191C16.6731 15.7141 16.5539 15.8983 16.3969 16.0716C16.1314 16.3641 15.8389 16.5754 15.5085 16.7108C15.5031 16.7108 15.4977 16.7162 15.4923 16.7162C15.1727 16.8462 14.826 16.9166 14.4523 16.9166C13.8998 16.9166 13.3094 16.7866 12.6864 16.5212C12.0635 16.2558 11.4406 15.8983 10.8231 15.4487C10.6119 15.2916 10.4006 15.1346 10.2002 14.9666L11.9714 13.1954C12.1231 13.3091 12.2585 13.3958 12.3723 13.4554C12.3994 13.4662 12.4319 13.4825 12.4698 13.4987C12.5131 13.515 12.5564 13.5204 12.6052 13.5204C12.6973 13.5204 12.7677 13.4879 12.8273 13.4283L13.2389 13.0221C13.3744 12.8866 13.5044 12.7837 13.6289 12.7187C13.7535 12.6429 13.8781 12.605 14.0135 12.605C14.1164 12.605 14.2248 12.6266 14.3439 12.6754C14.4631 12.7241 14.5877 12.7946 14.7231 12.8866L16.516 14.1596C16.6569 14.2571 16.7544 14.3708 16.8139 14.5062C16.8681 14.6416 16.9006 14.7771 16.9006 14.9287Z"
        fill="white"
      />
    </svg>
  )
}

/* ------------------ SEO Highlight Helper ------------------ */

function renderSEOHeading(title?: string) {
  if (!title) return null

  const clean = title.trim()

  // Only apply styling when title STARTS with "SEO"
  if (!clean.toLowerCase().startsWith('seo')) {
    return clean
  }

  const rest = clean.slice(3).trim() // remove "SEO"

  return (
    <>
      <span className="bg-gradient-to-b from-[#8A8A8A] via-[#8A8A8A] to-black bg-clip-text text-transparent">
        SEO
      </span>

      {rest && (
        <>
          <br />
          {rest}
        </>
      )}
    </>
  )
}

/* ------------------ Component ------------------ */

export default function ServiceDetails({
  title,
  description,
  ctas,
  features,
  ...props
}: Partial<Sanity.ServiceDetailsModule> & Sanity.Module) {
  const hasFeatures = !!features?.length

  return (
    <section className="section space-y-12" {...moduleProps(props)}>
      <div className="flex flex-col items-center justify-center space-y-5 text-center">
        <Heading as="h1" variant="h1" className="text-balance">
          {renderSEOHeading(title)}
        </Heading>

        {description && (
          <Text variant="body-lg" muted className="whitespace-pre-line">
            {description}
          </Text>
        )}

        {ctas?.link && (
          <CTA className="rounded-full pt-2 shadow-(--shadow-badge)" {...ctas}>
            {ctas.link?.label}
            <CustomIcon />
          </CTA>
        )}
      </div>

      {hasFeatures && (
        <>
          <Heading as="h2" variant="h1" className="text-center font-semibold text-balance">
            {'Our Features'}
          </Heading>
          <div className="grid gap-8 md:grid-cols-2">
            {features?.map((feature, index) => (
              <FeatureCard feature={feature} key={feature?._key ?? index} />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

function FeatureCard({ feature }: Readonly<{ feature?: Sanity.ServiceFeature }>) {
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
                width={200}
                height={200}
                className="h-full w-full object-contain"
                alt={name || 'feature'}
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl">🔧</div>
          )}
        </div>
      </div>

      {/* Title */}
      <Heading as="h3" variant="h3" className="mt-1 text-balance">
        {name || 'Untitled feature'}
      </Heading>

      {/* Description */}
      {description && (
        <div className="mt-4 max-w-[36rem]">
          <Text muted className="text-ink/75 whitespace-pre-line">
            {description}
          </Text>
        </div>
      )}

      {/* Optional caption overlay for image (kept for backward compatibility) */}
      {img?.caption && (
        <Text variant="technical" className="text-canvas mt-4 block w-full px-3 text-sm">
          {img.caption}
        </Text>
      )}
    </article>
  )
}

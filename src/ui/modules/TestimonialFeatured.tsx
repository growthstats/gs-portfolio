import { VscQuote, VscSurroundWith } from 'react-icons/vsc'
import moduleProps from '@/lib/moduleProps'
import { Img } from '@/ui/Img'
import PortableText from '@/ui/PortableText'

export default function TestimonialFeatured({
  testimonial,
  ...props
}: Partial<{
  testimonial: Sanity.Testimonial
}> &
  Sanity.Module) {
  if (!testimonial) return null

  const { author } = testimonial

  return (
    <div className="section" {...moduleProps(props)}>
      <figure className="mx-auto flex max-w-3xl items-center gap-6 rounded-3xl px-6 py-8 shadow-(--shadow-card) max-sm:flex-col max-sm:text-center">
        {author?.image && (
          <Img
            className="size-24 shrink-0 rounded-full object-cover"
            image={author.image}
            width={192}
            alt={[author?.name, author?.title].filter(Boolean).join(', ') || 'Author'}
          />
        )}

        <div className="flex flex-col gap-4">
          <VscQuote aria-hidden className="text-accent/60 shrink-0 text-2xl max-sm:mx-auto" />

          <blockquote className="richtext text-ink/80 text-balance">
            {testimonial.content && <PortableText value={testimonial.content ?? []} />}
          </blockquote>

          <figcaption>
            <dl>
              <dt className="flex flex-wrap items-center gap-1 font-medium max-sm:justify-center">
                {author?.name}

                {testimonial.source && (
                  <cite>
                    <a
                      className="text-ink/50 hover:text-accent"
                      href={testimonial.source}
                      target="_blank"
                      rel="noopener noreferrer"
                      title="Source"
                      aria-label={`Source of testimonial${author?.name ? ` by ${author.name}` : ''}`}
                    >
                      <VscSurroundWith aria-hidden />
                    </a>
                  </cite>
                )}
              </dt>

              {author?.title && (
                <dd className="text-ink/60 text-body-sm text-balance">{author.title}</dd>
              )}
            </dl>
          </figcaption>
        </div>
      </figure>
    </div>
  )
}

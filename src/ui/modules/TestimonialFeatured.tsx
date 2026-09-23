import { ExternalLink, Quote } from 'lucide-react'
import { Img } from '@/ui/Img'
import Text from '@/ui/Text'
import PortableText from '@/ui/PortableText'

export default function TestimonialFeatured({
  testimonial,
}: Readonly<
  Partial<{
    testimonial: Sanity.Testimonial
  }>
>) {
  if (!testimonial) return null

  const { author } = testimonial
  const authorLabel = [author?.name, author?.title].filter(Boolean).join(', ')

  return (
    <section className="section">
      <figure className="mx-auto flex max-w-4xl items-center gap-x-12 gap-y-8 rounded-4xl p-8 shadow-(--shadow-card) max-md:flex-col md:p-12">
        <div className="flex grow flex-col gap-6 max-md:items-center max-md:text-center">
          <div
            className="flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-(--shadow-badge)"
            aria-hidden
          >
            <Quote className="size-6 fill-current" />
          </div>

          <blockquote className="richtext text-body-lg leading-body-lg text-balance">
            {testimonial.content && <PortableText value={testimonial.content ?? []} />}
          </blockquote>

          {author && (
            <figcaption>
              <cite className="flex items-center gap-1.5 font-semibold not-italic max-md:justify-center">
                {author.name}

                {testimonial.source && (
                  <a
                    className="text-ink/50 hover:text-ink transition-colors"
                    href={testimonial.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Source of testimonial${author.name ? ` by ${author.name}` : ''}`}
                  >
                    <ExternalLink className="size-3.5" aria-hidden />
                  </a>
                )}
              </cite>

              {author.title && (
                <Text as="p" variant="body-sm" className="text-ink/60 text-balance">
                  {author.title}
                </Text>
              )}
            </figcaption>
          )}
        </div>

        {author?.image?.asset && (
          <div className="shrink-0 rounded-3xl p-3 shadow-(--shadow-badge)">
            <Img
              className="aspect-square w-[200px] rounded-2xl object-cover"
              image={author.image}
              width={400}
              alt={authorLabel || 'Author'}
            />
          </div>
        )}
      </figure>
    </section>
  )
}

import { stegaClean } from 'next-sanity'
import { ExternalLink, Quote } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Img } from '@/ui/Img'
import Text from '@/ui/Text'
import { cn } from '@/lib/utils'
import PortableText from '@/ui/PortableText'

export default function TestimonialList({
  pretitle,
  intro,
  testimonials,
  layout: l,
  layoutMobile: lm,
}: Readonly<
  Partial<{
    pretitle: string
    intro: Sanity.PortableText
    testimonials: Sanity.Testimonial[]
    layout: 'grid' | 'carousel'
    layoutMobile: 'grid' | 'carousel'
  }>
>) {
  const layout = stegaClean(l)
  const layoutMobile = stegaClean(lm)

  return (
    <section className="section space-y-10 text-center">
      {(pretitle || intro) && (
        <header className="flex flex-col items-center gap-4">
          {pretitle && (
            <Badge
              variant="outline"
              className="gap-2 rounded-full px-4 py-1.5 shadow-(--shadow-badge)"
            >
              <span className="size-3 rounded-full bg-black" />
              <Text as="span" variant="eyebrow" className="text-ink">
                {stegaClean(pretitle)}
              </Text>
            </Badge>
          )}

          {intro && (
            <div className="richtext max-w-3xl">
              <PortableText value={intro ?? []} />
            </div>
          )}
        </header>
      )}

      <div
        className={cn(
          'gap-8',
          layout === 'carousel'
            ? 'carousel max-md:full-bleed md:overflow-fade-r p-4 [--size:400px] max-md:px-4'
            : 'grid auto-rows-fr sm:grid-cols-[repeat(auto-fill,minmax(300px,1fr))]',
          layoutMobile === 'carousel' &&
            'max-md:carousel max-md:full-bleed max-md:p-4 max-md:[--size:320px]',
        )}
      >
        {testimonials?.map(
          (testimonial, key) =>
            testimonial && <TestimonialCard testimonial={testimonial} key={key} />,
        )}
      </div>
    </section>
  )
}

function TestimonialCard({ testimonial }: Readonly<{ testimonial: Sanity.Testimonial }>) {
  const { author, content, source } = testimonial
  const authorLabel = [author?.name, author?.title].filter(Boolean).join(', ')

  return (
    <article className="flex h-full flex-col items-center gap-6 rounded-3xl px-6 py-8 text-center shadow-(--shadow-card)">
      <div
        className="flex size-14 shrink-0 items-center justify-center rounded-2xl shadow-(--shadow-badge)"
        aria-hidden
      >
        <Quote className="size-6 fill-current" />
      </div>

      <blockquote className="text-ink/80 richtext grow text-balance">
        {content && <PortableText value={content ?? []} />}
      </blockquote>

      {author && (
        <footer className="flex items-center gap-3 text-start">
          {author.image?.asset ? (
            <Img
              className="size-12 shrink-0 rounded-full object-cover shadow-(--shadow-badge)"
              image={author.image}
              width={96}
              alt={authorLabel || 'Author'}
            />
          ) : (
            author.name && (
              <span
                className="flex size-12 shrink-0 items-center justify-center rounded-full font-semibold shadow-(--shadow-badge)"
                aria-hidden
              >
                {stegaClean(author.name).trim().charAt(0).toUpperCase()}
              </span>
            )
          )}

          <div>
            <cite className="flex items-center gap-1.5 font-semibold not-italic">
              {author.name}

              {source && (
                <a
                  className="text-ink/50 hover:text-ink transition-colors"
                  href={source}
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
          </div>
        </footer>
      )}
    </article>
  )
}

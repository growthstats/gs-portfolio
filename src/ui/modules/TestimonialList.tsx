import { stegaClean } from 'next-sanity'
import { VscQuote, VscSurroundWith } from 'react-icons/vsc'
import { cn } from '@/lib/utils'
import moduleProps from '@/lib/moduleProps'
import { Img } from '@/ui/Img'
import PortableText from '@/ui/PortableText'
import Pretitle from '@/ui/Pretitle'

export default function TestimonialList({
  pretitle,
  intro,
  testimonials,
  layout: l,
  layoutMobile: lm,
  ...props
}: Partial<{
  pretitle: string
  intro: Sanity.PortableText
  testimonials: Sanity.Testimonial[]
  layout: 'grid' | 'carousel'
  layoutMobile: 'grid' | 'carousel'
}> &
  Sanity.Module) {
  const layout = stegaClean(l)
  const layoutMobile = stegaClean(lm)

  return (
    <div className="section space-y-10" {...moduleProps(props)}>
      {(pretitle || intro) && (
        <header className="richtext mx-auto max-w-4xl text-center">
          <Pretitle>{pretitle}</Pretitle>
          {intro && <PortableText value={intro ?? []} />}
        </header>
      )}

      <div
        className={cn(
          'gap-6',
          layout === 'carousel'
            ? 'carousel max-md:full-bleed md:overflow-fade-r pb-4 [--size:340px] max-md:px-4'
            : 'grid sm:grid-cols-2 lg:grid-cols-3',
          layoutMobile === 'carousel' &&
            'max-md:carousel max-md:full-bleed max-md:px-4 max-md:pb-4',
        )}
      >
        {testimonials?.map(
          (testimonial, key) =>
            testimonial && (
              <figure
                className="flex h-full flex-col gap-5 rounded-3xl px-6 py-8 shadow-(--shadow-card)"
                key={key}
              >
                <VscQuote aria-hidden className="text-accent/60 shrink-0 text-2xl" />

                <blockquote className="richtext text-ink/80 text-body-sm grow text-balance">
                  {testimonial.content && <PortableText value={testimonial.content ?? []} />}
                </blockquote>

                {testimonial.author && (
                  <figcaption className="flex items-center gap-3">
                    <Img
                      className="size-10 shrink-0 rounded-full object-cover"
                      image={testimonial.author.image}
                      width={80}
                      alt={
                        [testimonial.author.name, testimonial.author.title]
                          .filter(Boolean)
                          .join(', ') || 'Author'
                      }
                    />

                    <dl className="min-w-0 text-start">
                      <dt className="flex flex-wrap items-center gap-1 font-medium">
                        {testimonial.author.name}

                        {testimonial.source && (
                          <cite>
                            <a
                              className="text-ink/50 hover:text-accent"
                              href={testimonial.source}
                              target="_blank"
                              title="Source"
                            >
                              <VscSurroundWith />
                            </a>
                          </cite>
                        )}
                      </dt>

                      {testimonial.author.title && (
                        <dd className="text-ink/60 text-body-xs text-balance">
                          {testimonial.author.title}
                        </dd>
                      )}
                    </dl>
                  </figcaption>
                )}
              </figure>
            ),
        )}
      </div>
    </div>
  )
}

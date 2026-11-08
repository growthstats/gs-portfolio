import { stegaClean } from 'next-sanity'
import { VscQuote, VscSurroundWith } from 'react-icons/vsc'
import { cn } from '@/lib/utils'
import moduleProps from '@/lib/moduleProps'
import { Img } from '@/ui/Img'
import PortableText from '@/ui/PortableText'
import Pretitle from '@/ui/Pretitle'
import { getDictionary } from '@/i18n'
import { format } from '@/i18n/format'
import type { ModuleProps } from '@/sanity/queries/page.groq'

export default function TestimonialList({
  lang,
  pretitle,
  intro,
  testimonials,
  layout: l,
  layoutMobile: lm,
  ...props
}: ModuleProps<'testimonial-list'>) {
  const t = getDictionary(lang).testimonial
  const layout = stegaClean(l)
  const layoutMobile = stegaClean(lm)

  return (
    <div className="section space-y-10" {...moduleProps(props)}>
      {(pretitle || intro) && (
        <header className="mx-auto max-w-4xl richtext text-center">
          <Pretitle>{pretitle}</Pretitle>
          {intro && <PortableText value={intro ?? []} />}
        </header>
      )}

      <div
        className={cn(
          'gap-6',
          layout === 'carousel'
            ? 'carousel p-4 [--size:340px] max-md:full-bleed md:-mx-4 md:overflow-fade-r'
            : 'grid sm:grid-cols-2 lg:grid-cols-3',
          layoutMobile === 'carousel' && 'max-md:full-bleed max-md:carousel max-md:p-4',
        )}
      >
        {testimonials?.map(
          (testimonial, key) =>
            testimonial && (
              <figure
                className="flex h-full flex-col gap-5 rounded-3xl px-6 py-8 shadow-(--shadow-card)"
                key={key}
              >
                <VscQuote aria-hidden className="shrink-0 text-2xl text-accent/60" />

                <blockquote className="grow richtext text-body-sm text-balance text-ink/80">
                  {testimonial.content && <PortableText value={testimonial.content ?? []} />}
                </blockquote>

                {testimonial.author && (
                  <figcaption className="flex items-center gap-3">
                    {testimonial.author.image?.asset ? (
                      <Img
                        className="size-10 shrink-0 rounded-full object-cover"
                        image={testimonial.author.image}
                        width={80}
                        alt={
                          [testimonial.author.name, testimonial.author.title]
                            .filter(Boolean)
                            .join(', ') || t.authorAlt
                        }
                      />
                    ) : (
                      testimonial.author.name && (
                        <span
                          aria-hidden
                          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink/5 font-medium text-ink/70"
                        >
                          {stegaClean(testimonial.author.name).trim().charAt(0).toUpperCase()}
                        </span>
                      )
                    )}

                    <dl className="min-w-0 text-start">
                      <dt className="flex flex-wrap items-center gap-1 font-medium">
                        {testimonial.author.name}

                        {testimonial.source && (
                          <cite>
                            <a
                              className="text-ink/50 hover:text-accent"
                              href={testimonial.source}
                              target="_blank"
                              rel="noopener noreferrer"
                              title={t.source}
                              aria-label={format(t.sourceLabelBy, {
                                name: testimonial.author.name ?? '',
                              })}
                            >
                              <VscSurroundWith aria-hidden />
                            </a>
                          </cite>
                        )}
                      </dt>

                      {testimonial.author.title && (
                        <dd className="text-body-xs text-balance text-ink/60">
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

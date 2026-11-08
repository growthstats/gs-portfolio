import moduleProps from '@/lib/moduleProps'
import Pretitle from '@/ui/Pretitle'
import CTAList from '@/ui/CTAList'
import { cn, formatCurrency } from '@/lib/utils'
import PortableText from '@/ui/PortableText'
import { getDictionary, type Dictionary } from '@/i18n'
import type { ModuleProps } from '@/sanity/queries/page.groq'

export default function PricingList({
  lang,
  pretitle,
  intro,
  tiers,
  ...props
}: ModuleProps<'pricing-list'>) {
  const { pricing } = getDictionary(lang)
  const count = tiers?.length ?? 0

  return (
    <section className="section space-y-8" {...moduleProps(props)}>
      {(pretitle || intro) && (
        <header className="richtext text-center">
          <Pretitle>{pretitle}</Pretitle>
          {intro && <PortableText value={intro ?? []} />}
        </header>
      )}

      <div
        className={cn(
          'carousel items-stretch gap-6 max-lg:full-bleed max-lg:px-4',
          count <= 3 ? 'md:grid-cols-[repeat(var(--col,1),1fr)]' : 'md:overflow-fade-r',
        )}
        style={{ '--col': count } as React.CSSProperties}
      >
        {tiers?.map(
          (tier) =>
            !!tier && (
              <article
                className="richtext space-y-4 rounded border border-ink/10 p-4"
                key={tier._id}
              >
                <div className="flex flex-wrap items-center gap-x-4 h3">
                  {tier.title}

                  <Pretitle className="ms-auto text-xs">{tier.highlight}</Pretitle>
                </div>

                {tier.price?.base !== undefined && (
                  <div className="flex flex-wrap items-end gap-x-1">
                    {tier.price.base !== undefined && !Number.isNaN(tier.price.base) && (
                      <b className="h1">{formatPrice(tier.price.base, pricing)}</b>
                    )}
                    {tier.price.suffix && (
                      <span className={cn(Number.isNaN(tier.price.base) && 'h1')}>
                        {tier.price.suffix}
                      </span>
                    )}
                    {tier.price.strikethrough && (
                      <s className="font-bold decoration-red-500">
                        {formatPrice(tier.price?.strikethrough, pricing)}
                      </s>
                    )}
                  </div>
                )}

                <CTAList className="grid" ctas={tier.ctas} />
                <div className="richtext">
                  {tier.content && <PortableText value={tier.content ?? []} />}
                </div>
              </article>
            ),
        )}
      </div>
    </section>
  )
}

function formatPrice(value: number, pricing: Dictionary['pricing']) {
  if (value === 0) return pricing.free
  return formatCurrency(value).replace(/\.00$/, '')
}

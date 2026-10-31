import Heading from '@/ui/Heading'
import Text from '@/ui/Text'
import type { ComponentProps } from 'react'

const VARIANTS: Array<{
  variant: ComponentProps<typeof Heading>['variant']
  label: string
  description: string
}> = [
  {
    variant: 'display-hero',
    label: 'Display Hero',
    description: 'Primary hero headlines on landing experiences.',
  },
  {
    variant: 'display-xl',
    label: 'Display XL',
    description: 'Large promotional headlines and marquee callouts.',
  },
  {
    variant: 'h1',
    label: 'Visual H1',
    description: 'Use sparingly for interior hero moments; keep a single semantic h1.',
  },
  {
    variant: 'h2',
    label: 'H2',
    description: 'Default section headings across the experience.',
  },
  {
    variant: 'h3',
    label: 'H3',
    description: 'Sub-section titles or supporting headlines.',
  },
  {
    variant: 'h4',
    label: 'H4',
    description: 'Card titles and dense UI contexts.',
  },
  {
    variant: 'h5',
    label: 'H5',
    description: 'Labels, data groupings, or tertiary headings.',
  },
  {
    variant: 'h6',
    label: 'H6',
    description: 'Small caps headlines or supporting annotations.',
  },
]

const TEXT_VARIANTS: Array<{
  variant: ComponentProps<typeof Text>['variant']
  label: string
  description: string
  as?: ComponentProps<typeof Text>['as']
}> = [
  {
    variant: 'body-lg',
    label: 'Body Large',
    description: 'Lead paragraphs, hero supporting copy.',
  },
  {
    variant: 'body',
    label: 'Body',
    description: 'Default UI paragraphs, descriptions, and content.',
  },
  {
    variant: 'body-sm',
    label: 'Body Small',
    description: 'Dense UIs, captions, and helper text.',
  },
  {
    variant: 'body-xs',
    label: 'Body Extra Small',
    description: 'Legal disclaimers or metadata.',
  },
  {
    variant: 'subtitle',
    label: 'Subtitle',
    description: 'Multi-line supporting copy with softer tone.',
  },
  {
    variant: 'eyebrow',
    label: 'Eyebrow',
    description: 'Uppercase pretitle that pairs with headlines.',
    as: 'span',
  },
  {
    variant: 'badge',
    label: 'Section Badge',
    description: 'Inline pills that highlight grouped content.',
    as: 'span',
  },
  {
    variant: 'technical',
    label: 'Technical',
    description: 'Metadata, UI shortcuts, or code-adjacent details.',
  },
]

export default async function Page() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-16 px-6 py-16">
      <section className="space-y-6">
        <Text as="span" variant="badge">
          Typography System
        </Text>
        <Heading as="h1" variant="display-hero">
          Global Heading Scale
        </Heading>
        <Text as="p" variant="subtitle" className="max-w-2xl">
          This page previews every typographic token, helping designers and engineers stay in sync
          while respecting the single-h1 SEO rule.
        </Text>
      </section>

      <section className="space-y-10">
        <Heading as="h2" variant="h2">
          Scale
        </Heading>
        <div className="space-y-12">
          {VARIANTS.map(({ variant, label, description }) => (
            <div key={variant} className="space-y-4">
              <Heading variant={variant}>{label}</Heading>
              <Text variant="body-sm" muted>
                {description}
              </Text>
              <div className="border-ink/10 rounded-lg border bg-white/40 p-4">
                <Heading
                  as="p"
                  variant={variant}
                  className="text-ink"
                  balance={variant === 'h6' ? false : undefined}
                >
                  The quick brown fox jumps over the lazy dog.
                </Heading>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <Heading as="h2" variant="h2">
          Pretitle + Title
        </Heading>
        <Heading as="h2" variant="h2" className="space-y-1">
          <Text as="span" variant="eyebrow" className="block">
            Our Services
          </Text>
          <span className="block">What We Do Best</span>
        </Heading>
        <Text as="p" variant="subtitle" className="max-w-2xl">
          One semantic heading node keeps SEO and accessibility intact while the eyebrow and title
          remain visually distinct.
        </Text>
        <div>
          <Text as="span" variant="badge">
            Badge
          </Text>
        </div>
      </section>

      <section className="space-y-6">
        <Heading as="h2" variant="h2">
          Balanced Text Helper
        </Heading>
        <Heading variant="display-xl">
          Text balance is enabled by default on display sizes to prevent awkward wraps.
        </Heading>
        <Heading variant="display-xl" balance={false} className="text-ink/70">
          Disable balance when manual line breaks or tightly controlled layouts are required.
        </Heading>
      </section>

      <section className="space-y-10">
        <Heading as="h2" variant="h2">
          Body & Utility Text
        </Heading>
        <div className="space-y-12">
          {TEXT_VARIANTS.map(({ variant, label, description, as }) => (
            <div key={variant} className="space-y-3">
              <Text variant="body-sm" className="text-ink font-semibold">
                {label}
              </Text>
              <Text variant="body-xs" muted>
                {description}
              </Text>
              <div className="border-ink/10 rounded-lg border bg-white/40 p-4">
                <Text as={as} variant={variant} className="text-ink">
                  The quick brown fox jumps over the lazy dog.
                </Text>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

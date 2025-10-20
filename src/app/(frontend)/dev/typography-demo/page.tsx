import Heading from "@/ui/Heading";
import type { ComponentProps } from "react";

const VARIANTS: Array<{
  variant: ComponentProps<typeof Heading>["variant"];
  label: string;
  description: string;
}> = [
  {
    variant: "display-hero",
    label: "Display Hero",
    description: "Primary hero headlines on landing experiences.",
  },
  {
    variant: "display-xl",
    label: "Display XL",
    description: "Large promotional headlines and marquee callouts.",
  },
  {
    variant: "h1",
    label: "Visual H1",
    description:
      "Use sparingly for interior hero moments; keep a single semantic h1.",
  },
  {
    variant: "h2",
    label: "H2",
    description: "Default section headings across the experience.",
  },
  {
    variant: "h3",
    label: "H3",
    description: "Sub-section titles or supporting headlines.",
  },
  {
    variant: "h4",
    label: "H4",
    description: "Card titles and dense UI contexts.",
  },
  {
    variant: "h5",
    label: "H5",
    description: "Labels, data groupings, or tertiary headings.",
  },
  {
    variant: "h6",
    label: "H6",
    description: "Small caps headlines or supporting annotations.",
  },
];

export default async function Page() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-16 px-6 py-16">
      <section className="space-y-6">
        <span className="section-badge">Typography System</span>
        <Heading as="h1" variant="display-hero">
          Global Heading Scale
        </Heading>
        <p className="subtitle max-w-2xl">
          This page previews every typographic token, helping designers and
          engineers stay in sync while respecting the single-h1 SEO rule.
        </p>
      </section>

      <section className="space-y-10">
        <Heading as="h2" variant="h2">
          Scale
        </Heading>
        <div className="space-y-12">
          {VARIANTS.map(({ variant, label, description }) => (
            <div key={variant} className="space-y-4">
              <Heading variant={variant}>{label}</Heading>
              <p className="text-sm text-ink/70">{description}</p>
              <div className="rounded-lg border border-ink/10 bg-white/40 p-4">
                <Heading
                  as="p"
                  variant={variant}
                  className="text-ink"
                  balance={variant === "h6" ? false : undefined}
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
          <span className="block eyebrow">Our Services</span>
          <span className="block">What We Do Best</span>
        </Heading>
        <p className="subtitle max-w-2xl">
          One semantic heading node keeps SEO and accessibility intact while the
          eyebrow and title remain visually distinct.
        </p>
        <div>
          <span className="section-badge">Badge</span>
        </div>
      </section>

      <section className="space-y-6">
        <Heading as="h2" variant="h2">
          Balanced Text Helper
        </Heading>
        <Heading variant="display-xl">
          Text balance is enabled by default on display sizes to prevent awkward
          wraps.
        </Heading>
        <Heading variant="display-xl" balance={false} className="text-ink/70">
          Disable balance when manual line breaks or tightly controlled layouts
          are required.
        </Heading>
      </section>
    </main>
  );
}

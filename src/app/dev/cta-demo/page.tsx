import Button from "@/ui/cta/Button"
import CtaLink from "@/ui/cta/CtaLink"
import type { CtaVariant } from "@/ui/cta/types"

const VARIANTS: Array<{ variant: CtaVariant; label: string }> = [
	{ variant: "primary", label: "Primary" },
	{ variant: "secondary", label: "Secondary" },
	{ variant: "tertiary", label: "Tertiary" },
	{ variant: "ghost", label: "Ghost" },
]

export default async function Page() {
	return (
		<main className="mx-auto flex max-w-5xl flex-col gap-16 px-6 py-16">
			<section className="space-y-4">
				<h1 className="text-display-xl leading-display-xl font-semibold text-balance">
					CTA System
				</h1>
				<p className="subtitle max-w-3xl">
					This page showcases the reusable CTA primitives. Each variant ships with
					accessible focus states, icon support, and automatic external link
					handling.
				</p>
			</section>

			<section className="space-y-6">
				<h2 className="text-h2 font-semibold leading-h2">Button Variants</h2>
				<div className="grid gap-6 md:grid-cols-2">
					{VARIANTS.map(({ variant, label }) => (
						<div
							key={variant}
							className="flex flex-col gap-3 rounded-2xl border border-ink/10 p-4"
						>
							<p className="eyebrow">{label}</p>
							<div className="flex flex-wrap items-center gap-3">
								<Button variant={variant} iconName="arrowRight">
									Get Started
								</Button>
								<Button variant={variant} iconName="arrowRight" disabled>
									Get Started
								</Button>
								<Button
									variant={variant}
									size="sm"
									iconName="arrowRight"
									iconPosition="leading"
								>
									Small CTA
								</Button>
							</div>
						</div>
					))}
				</div>
			</section>

			<section className="space-y-6">
				<h2 className="text-h2 font-semibold leading-h2">Link Variants</h2>
				<div className="flex flex-wrap items-center gap-3">
					<CtaLink href="/pricing" variant="primary" iconName="arrowRight">
						View Pricing
					</CtaLink>
					<CtaLink
						href="https://example.com/playbook"
						variant="secondary"
						iconName="externalLink"
					>
						Read Playbook
					</CtaLink>
					<CtaLink
						href="/contact"
						variant="tertiary"
						iconName="mail"
						iconPosition="leading"
					>
						Email Us
					</CtaLink>
					<CtaLink href="/demo" variant="ghost" disabled>
						Request Demo
					</CtaLink>
				</div>
			</section>

			<section className="space-y-4">
				<h2 className="text-h2 font-semibold leading-h2">Icon-only</h2>
				<p className="text-sm text-ink/70">
					Icon-only CTAs require an explicit accessible name via `ariaLabel`.
				</p>
				<div className="flex items-center gap-3">
					<Button
						iconName="calendar"
						ariaLabel="Open scheduling modal"
						variant="secondary"
					/>
					<CtaLink
						href="https://cal.com/growth"
						iconName="externalLink"
						ariaLabel="Book a call (opens in new tab)"
						variant="ghost"
					/>
				</div>
			</section>
		</main>
	)
}

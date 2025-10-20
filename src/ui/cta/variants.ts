import type { CtaSize, CtaVariant } from "./types"

const CTA_BASE =
	"inline-flex items-center justify-center gap-2 rounded-2xl font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-60"

export const CTA_VARIANTS: Record<CtaVariant, string> = {
	primary:
		CTA_BASE +
		" bg-primary text-primary-foreground shadow-(--custom-shadow) hover:bg-primary/90 focus-visible:outline-primary",
	secondary:
		CTA_BASE +
		" border border-ink/15 bg-canvas text-ink shadow-sm hover:bg-ink/5 focus-visible:outline-primary",
	tertiary:
		"inline-flex items-center justify-center gap-1.5 font-medium text-primary underline-offset-4 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-60 hover:underline",
	ghost:
		CTA_BASE +
		" border border-ink/20 bg-transparent text-ink hover:bg-ink/5 focus-visible:outline-primary",
}

const CTA_SIZE_MAP: Record<CtaSize, string> = {
	md: "text-base px-5 py-2.5",
	sm: "text-sm px-3 py-1.5",
}

const CTA_TERTIARY_SIZE_MAP: Record<CtaSize, string> = {
	md: "text-base px-2 py-1",
	sm: "text-sm px-1.5 py-0.5",
}

export function getCtaClasses(
	variant: CtaVariant = "primary",
	size: CtaSize = "md",
): string {
	const base =
		CTA_VARIANTS[variant] ?? CTA_VARIANTS.primary

	const sizeClasses =
		variant === "tertiary"
			? CTA_TERTIARY_SIZE_MAP[size] ?? CTA_TERTIARY_SIZE_MAP.md
			: CTA_SIZE_MAP[size] ?? CTA_SIZE_MAP.md

	return `${base} ${sizeClasses}`
}

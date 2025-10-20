import type { ReactNode } from "react"
import { stegaClean } from "next-sanity"
import resolveUrl from "@/lib/resolveUrl"
import { cn } from "@/lib/utils"

import Button from "./cta/Button"
import { getIconName } from "./cta/Icon"
import type { CtaIconPosition, CtaVariant } from "./cta/types"
import { hasVisibleChildren, isExternal as checkExternal } from "./cta/utils"

type CTAProps = Sanity.CTA & {
	className?: string
	children?: ReactNode
	iconPosition?: CtaIconPosition
}

const LEGACY_VARIANT_MAP: Record<string, CtaVariant> = {
	default: "primary",
	primary: "primary",
	secondary: "secondary",
	ghost: "ghost",
	outline: "ghost",
	link: "tertiary",
	tertiary: "tertiary",
	destructive: "primary",
}

function resolveVariant(style?: string | null): CtaVariant {
	if (!style) return "primary"
	const normalized = style.toLowerCase()
	return LEGACY_VARIANT_MAP[normalized] ?? ("primary" as CtaVariant)
}

function resolveHref(
	cta: Sanity.CTA,
): { href?: string; external?: boolean } {
	if (cta.href) {
		const cleaned = stegaClean(cta.href)
		const href = cleaned ? cleaned.trim() : undefined
		return {
			href,
			external: cta.isExternal ?? checkExternal(href ?? undefined),
		}
	}

	const { link } = cta as Sanity.CTA & { link?: Sanity.Link }

	if (link?.type === "internal" && link.internal) {
		return {
			href: resolveUrl(link.internal, {
				base: false,
				params: link.params,
			}),
			external: false,
		}
	}

	if (link?.type === "external" && link.external) {
		const cleaned = stegaClean(link.external)
		const href = cleaned ? cleaned.trim() : undefined
		return {
			href,
			external: true,
		}
	}

	return {}
}

export default function CTA({
	className,
	children,
	iconPosition,
	...cta
}: CTAProps) {
	const { href, external } = resolveHref(cta)

	const rawLabel: ReactNode =
		children ??
		cta.label ??
		cta.link?.label ??
		cta.link?.internal?.title ??
		cta.link?.external

	const label =
		typeof rawLabel === "string" ? stegaClean(rawLabel) : rawLabel

	const rawStyle =
		typeof cta.style === "string" ? stegaClean(cta.style) ?? cta.style : cta.style
	const variant = resolveVariant(rawStyle)
	const iconName =
		getIconName(cta.icon) ??
		(external ? ("externalLink" as const) : undefined)

	const position: CtaIconPosition = iconPosition ?? cta.iconPosition ?? "trailing"
	const ariaLabel =
		cta.ariaLabel ??
		(typeof label === "string" && label.trim().length > 0
			? label
			: undefined)

	const classes = cn(className)
	const hasContent = hasVisibleChildren(label)

	if (!href) {
		return (
			<Button
				variant={variant}
				disabled
				className={classes}
				iconName={iconName}
				iconPosition={position}
				ariaLabel={ariaLabel}
			>
				{label}
			</Button>
		)
	}

	return (
		<Button
			as="a"
			href={href}
			variant={variant}
			className={classes}
			iconName={iconName}
			iconPosition={position}
			ariaLabel={ariaLabel}
			rel={cta.rel}
			target={cta.target}
			disabled={cta.disabled ?? false}
			data-content={hasContent ? "text" : "icon"}
		>
			{label}
		</Button>
	)
}

import type { ReactNode } from "react"

export type CtaVariant = "primary" | "secondary" | "tertiary" | "ghost"

export type CtaSize = "md" | "sm"

export type CtaIconPosition = "leading" | "trailing"

export type CtaIconName =
	| "arrowRight"
	| "externalLink"
	| "mail"
	| "phone"
	| "download"
	| "calendar"

export type CtaBaseProps = {
	variant?: CtaVariant
	size?: CtaSize
	iconName?: CtaIconName
	iconPosition?: CtaIconPosition
	ariaLabel?: string
	className?: string
	children?: ReactNode
	disabled?: boolean
}

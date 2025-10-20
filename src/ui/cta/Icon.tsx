import {
	ArrowRight,
	Calendar,
	Circle,
	Download,
	ExternalLink,
	Mail,
	Phone,
	type LucideIcon,
} from "lucide-react"

import type { CtaIconName } from "./types"
import { cx } from "./utils"

const ICONS: Record<CtaIconName, LucideIcon> = {
	arrowRight: ArrowRight,
	externalLink: ExternalLink,
	mail: Mail,
	phone: Phone,
	download: Download,
	calendar: Calendar,
}

const FALLBACK_ICON = Circle

export type IconProps = {
	name?: string | null
	className?: string
}

export default function Icon({ name, className }: IconProps) {
	if (!name) return null

	const key = name as CtaIconName
	const IconComponent = ICONS[key] ?? FALLBACK_ICON

	return (
		<IconComponent
			aria-hidden="true"
			className={cx("size-4 shrink-0", className)}
			strokeWidth={1.75}
		/>
	)
}

export function isSupportedIcon(name?: string | null): name is CtaIconName {
	return !!name && name in ICONS
}

export function getIconName(name?: string | null): CtaIconName | undefined {
	return isSupportedIcon(name) ? name : undefined
}

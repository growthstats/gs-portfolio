import type {
	AnchorHTMLAttributes,
	ButtonHTMLAttributes,
	MouseEvent,
} from "react"

import Icon from "./Icon"
import type { CtaBaseProps, CtaIconName, CtaVariant } from "./types"
import { cx, externalLinkAttributes, hasVisibleChildren } from "./utils"
import { getCtaClasses } from "./variants"

type NativeButtonProps = Omit<
	ButtonHTMLAttributes<HTMLButtonElement>,
	"className" | "children" | "aria-label" | "disabled"
>

type NativeAnchorProps = Omit<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	"className" | "children" | "aria-label" | "href"
>

type ButtonAsButton = CtaBaseProps &
	NativeButtonProps & {
		as?: "button"
		type?: ButtonHTMLAttributes<HTMLButtonElement>["type"]
	}

type ButtonAsAnchor = CtaBaseProps &
	NativeAnchorProps & {
		as: "a"
		href: string
		rel?: string
		target?: string
	}

export type ButtonProps = ButtonAsButton | ButtonAsAnchor

function renderIcon(name: CtaIconName | undefined, hasContent: boolean) {
	if (!name) return null
	return (
		<Icon
			name={name}
			className={cx(
				"transition-transform duration-150",
				hasContent ? "" : "-mx-0.5",
			)}
		/>
	)
}

function preventIfDisabled(
	disabled: boolean,
	handler?: (event: MouseEvent<HTMLAnchorElement>) => void,
) {
	return (event: MouseEvent<HTMLAnchorElement>) => {
		if (disabled) {
			event.preventDefault()
			event.stopPropagation()
			return
		}

		handler?.(event)
	}
}

export default function Button(props: ButtonProps) {
	const {
		as: asProp,
		variant = "primary",
		size = "md",
		iconName,
		iconPosition = "trailing",
		ariaLabel,
		className,
		children,
		disabled = false,
		...rest
	} = props

	const as: "button" | "a" = asProp ?? "button"
	const hasContent = hasVisibleChildren(children)
	const iconOnly = !hasContent && !!iconName

	if (iconOnly && !ariaLabel) {
		throw new Error(
			"[CTA] Icon-only buttons must include an accessible ariaLabel.",
		)
	}

	const finalClassName = cx(
		getCtaClasses(variant as CtaVariant, size),
		iconOnly && "size-10 justify-center gap-0 px-0 py-0",
		disabled && "pointer-events-none",
		className,
	)

	const labelProps = ariaLabel ? { "aria-label": ariaLabel } : {}

	if (as === "a") {
		const {
			href,
			rel,
			target,
			onClick,
			tabIndex,
			...anchorRest
		} = rest as NativeAnchorProps & {
			href: string
			rel?: string
			target?: string
			onClick?: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"]
			tabIndex?: number
		}

		const { rel: computedRel, target: computedTarget } = externalLinkAttributes(
			href,
			rel,
			target,
		)

		return (
			<a
				{...anchorRest}
				{...labelProps}
				data-icon-only={iconOnly ? "true" : undefined}
				data-variant={variant}
				data-size={size}
				className={finalClassName}
				href={disabled ? undefined : href}
				rel={disabled ? rel : computedRel}
				target={disabled ? undefined : computedTarget}
				onClick={preventIfDisabled(disabled, onClick)}
				aria-disabled={disabled || undefined}
				tabIndex={disabled ? -1 : tabIndex}
			>
				{iconName && iconPosition === "leading" && renderIcon(iconName, hasContent)}
				{children}
				{iconName &&
					iconPosition === "trailing" &&
					renderIcon(iconName, hasContent)}
			</a>
		)
	}

	const buttonRest = rest as NativeButtonProps & {
		type?: ButtonHTMLAttributes<HTMLButtonElement>["type"]
	}

	const resolvedType = buttonRest.type ?? "button"

	return (
		<button
			{...buttonRest}
			{...labelProps}
			data-icon-only={iconOnly ? "true" : undefined}
			data-variant={variant}
			data-size={size}
			className={finalClassName}
			type={resolvedType}
			disabled={disabled}
		>
			{iconName && iconPosition === "leading" && renderIcon(iconName, hasContent)}
			{children}
			{iconName &&
				iconPosition === "trailing" &&
				renderIcon(iconName, hasContent)}
		</button>
	)
}

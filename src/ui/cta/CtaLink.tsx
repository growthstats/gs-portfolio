import Link, { type LinkProps } from "next/link"
import type { AnchorHTMLAttributes } from "react"

import Icon from "./Icon"
import type { CtaBaseProps, CtaIconName } from "./types"
import { cx, externalLinkAttributes, hasVisibleChildren, isExternal } from "./utils"
import { getCtaClasses } from "./variants"

type NextLinkProps = Pick<LinkProps, "prefetch" | "replace" | "scroll" | "locale">

type NativeAnchorProps = Omit<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	"className" | "children" | "aria-label" | "href"
>

export type CtaLinkProps = CtaBaseProps &
	NativeAnchorProps &
	NextLinkProps & {
		href: string
		external?: boolean
	}

function renderIcon(name: CtaIconName | undefined, hasContent: boolean) {
	if (!name) return null
	return (
		<Icon
			name={name}
			className={cx("transition-transform duration-150", hasContent ? "" : "-mx-0.5")}
		/>
	)
}

export default function CtaLink({
	href,
	variant = "tertiary",
	size = "md",
	iconName,
	iconPosition = "trailing",
	ariaLabel,
	className,
	children,
	disabled = false,
	external,
	prefetch,
	replace,
	scroll,
	locale,
	rel,
	target,
	onClick,
	tabIndex,
	...anchorRest
}: CtaLinkProps) {
	const hasContent = hasVisibleChildren(children)
	const iconOnly = !hasContent && !!iconName

	if (iconOnly && !ariaLabel) {
		throw new Error("[CTA] Icon-only links must include an accessible ariaLabel.")
	}

	const computedExternal = external ?? isExternal(href)
	const baseClasses = getCtaClasses(variant, size)
	const finalClassName = cx(
		baseClasses,
		iconOnly && "size-10 justify-center gap-0 px-0 py-0",
		disabled && "pointer-events-none",
		className,
	)

	const labelProps = ariaLabel ? { "aria-label": ariaLabel } : {}

	const content = (
		<>
			{iconName && iconPosition === "leading" && renderIcon(iconName, hasContent)}
			{children}
			{iconName &&
				iconPosition === "trailing" &&
				renderIcon(iconName, hasContent)}
		</>
	)

	if (disabled) {
		return (
			<span
				{...labelProps}
				className={finalClassName}
				data-icon-only={iconOnly ? "true" : undefined}
				data-variant={variant}
				data-size={size}
				role="link"
				aria-disabled="true"
			>
				{content}
			</span>
		)
	}

	if (computedExternal) {
		const { rel: computedRel, target: computedTarget } = externalLinkAttributes(
			href,
			rel,
			target,
		)

		return (
			<a
				{...anchorRest}
				{...labelProps}
				className={finalClassName}
				data-icon-only={iconOnly ? "true" : undefined}
				data-variant={variant}
				data-size={size}
				href={href}
				rel={computedRel}
				target={computedTarget}
				onClick={onClick}
				tabIndex={tabIndex}
			>
				{content}
			</a>
		)
	}

	return (
		<Link
			{...anchorRest}
			{...labelProps}
			className={finalClassName}
			data-icon-only={iconOnly ? "true" : undefined}
			data-variant={variant}
			data-size={size}
			href={href}
			prefetch={prefetch}
			replace={replace}
			scroll={scroll}
			locale={locale}
			onClick={onClick}
			tabIndex={tabIndex}
		>
			{content}
		</Link>
	)
}

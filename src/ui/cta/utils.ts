import { cn } from "@/lib/utils"
import type { ClassValue } from "clsx"
import { Children, type ReactNode } from "react"

export const cx = (...args: ClassValue[]) => cn(...args)

export function isExternal(href?: string | null): boolean {
	if (!href) return false
	// Treat http(s) URLs and protocol-relative URLs as external
	return /^(?:[a-z][a-z0-9+\-.]*:)?\/\//i.test(href)
}

export function mergeRel(rel?: string, additions: Array<string | undefined> = []) {
	const tokens = new Set(
		(rel ?? "")
			.split(/\s+/)
			.map((token) => token.trim())
			.filter(Boolean),
	)

	for (const addition of additions) {
		if (addition) tokens.add(addition)
	}

	return tokens.size ? Array.from(tokens).join(" ") : undefined
}

export function externalLinkAttributes(
	href?: string,
	rel?: string,
	target?: string,
): { rel?: string; target?: string } {
	if (!href || !isExternal(href)) {
		return { rel, target }
	}

	return {
		rel: mergeRel(rel, ["noopener"]),
		target: target ?? "_blank",
	}
}

export function hasVisibleChildren(children: ReactNode): boolean {
	return Children.toArray(children).some((child) => {
		if (child === null || child === undefined || typeof child === "boolean") {
			return false
		}

		if (typeof child === "string") {
			return child.trim().length > 0
		}

		return true
	})
}

/// <reference types="vitest" />

import { render, screen } from "@testing-library/react"

import CtaLink from "@/ui/cta/CtaLink"

vi.mock("next/link", () => ({
	default: ({ children, ...props }: any) => (
		<a {...props} data-mocked="link">
			{children}
		</a>
	),
}))

describe("CTA Link", () => {
	it("renders an internal link using Next.js Link semantics", () => {
		render(<CtaLink href="/about">About Us</CtaLink>)

		const link = screen.getByRole("link", { name: "About Us" })
		expect(link).toHaveAttribute("href", "/about")
		expect(link).not.toHaveAttribute("target")
		expect(link).toHaveClass("focus-visible:outline")
		expect(link).toHaveAttribute("data-mocked", "link")
	})

	it("adds rel and target for external links automatically", () => {
		render(<CtaLink href="https://example.com">Docs</CtaLink>)

		const link = screen.getByRole("link", { name: "Docs" })
		expect(link).toHaveAttribute("target", "_blank")
		expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"))
	})

	it("renders disabled links as inert elements", () => {
		render(
			<CtaLink href="/pricing" disabled>
				Pricing
			</CtaLink>,
		)

		const span = screen.getByRole("link", { name: "Pricing" })
		expect(span.tagName.toLowerCase()).toBe("span")
		expect(span).toHaveAttribute("aria-disabled", "true")
		expect(span).toHaveClass("pointer-events-none")
	})

	it("requires ariaLabel when rendered icon-only", () => {
		expect(() =>
			render(<CtaLink href="/book" iconName="calendar" ariaLabel="Book" />),
		).not.toThrow()

		expect(() => render(<CtaLink href="/book" iconName="calendar" />)).toThrow(
			/[CTA] Icon-only links must include an accessible ariaLabel/,
		)
	})
})

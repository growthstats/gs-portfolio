/// <reference types="vitest" />

import { render, screen } from "@testing-library/react"

import Button from "@/ui/cta/Button"

describe("CTA Button", () => {
	it("renders a primary button with accessible classes", () => {
		render(<Button>Call to Action</Button>)

		const button = screen.getByRole("button", { name: "Call to Action" })
		expect(button).toBeInTheDocument()
		expect(button).toHaveClass("inline-flex", "focus-visible:outline")
		expect(button).toHaveAttribute("type", "button")
	})

	it("opens external links in a new tab with rel noopener", () => {
		render(
			<Button as="a" href="https://example.com" variant="primary">
				External
			</Button>,
		)

		const link = screen.getByRole("link", { name: "External" })
		expect(link).toHaveAttribute("href", "https://example.com")
		expect(link).toHaveAttribute("target", "_blank")
		expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"))
	})

	it("disables anchor CTAs correctly", () => {
		render(
			<Button as="a" href="https://example.com" disabled>
				Disabled Link
			</Button>,
		)

		const link = screen.getByRole("link", { name: "Disabled Link" })
		expect(link).toHaveAttribute("aria-disabled", "true")
		expect(link).not.toHaveAttribute("href")
		expect(link).toHaveClass("pointer-events-none")
	})

	it("requires ariaLabel for icon-only buttons", () => {
		expect(() =>
			render(<Button iconName="arrowRight" ariaLabel="Go" />),
		).not.toThrow()

		expect(() => render(<Button iconName="arrowRight" />)).toThrow(
			/[CTA] Icon-only buttons must include an accessible ariaLabel/,
		)
	})
})

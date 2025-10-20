# CTA System

The CTA primitives provide a consistent interface for call-to-action buttons and links across the Growth Stats experience. They work on the server, automatically manage external link behaviour, and ship with OrbAI-inspired focus styling.

## Variants

- **primary** – Loud, high-contrast entry point (hero actions, key conversions). Defaults to the solid brand background with a strong focus ring.
- **secondary** – Medium emphasis with outlined border and subtle fill. Use for secondary conversion paths or dense layouts.
- **tertiary** – Textual link-CTA with underline hover states. Works well inline or as supporting actions near a primary CTA.
- **ghost** – Minimal chrome with a subtle border and hover tint. Ideal on tinted surfaces or as low-emphasis actions.

> All variants inherit the same focus-visible outline for WCAG-compliant focus indication.

## Choosing Button vs. Link

- Use `<Button>` for call-to-actions that trigger in-page behaviour (modals, interactive states) or when you need a real `<button>`.
- Use `<CtaLink>` or `<CTA>` (Sanity-driven wrapper) for navigation. Internal links use Next.js Link automatically; external URLs get `rel="noopener"` and `target="_blank"` without extra work.

## Icon Usage

- Set `iconName` to one of the whitelist values (`arrowRight`, `externalLink`, `mail`, `phone`, `download`, `calendar`). Unknown names fall back to a neutral glyph.
- Use `iconPosition="leading"` to move the icon before the copy; default is trailing.
- Icon-only CTAs **must** include `ariaLabel` so screen readers announce intent.

## External Links

- External URLs are detected via the protocol and receive `target="_blank"` and `rel="noopener"` automatically.
- Set `isExternal` in Sanity when you want a relative URL to behave as external (rare).
- Provide meaningful labels (e.g., “Download report (PDF)”) so the context survives when the link opens a new tab.

## Accessibility Notes

- Focus states use `focus-visible:outline` with offset to remain visible against both light and dark surfaces.
- Disabled CTAs render with `aria-disabled="true"` and remove pointer events; they stay in the DOM order but cannot be activated.
- Icon-only CTAs require `ariaLabel`. Mixed content automatically derives an accessible name from the children.
- The typography scale pairs with CTA padding (`px-5 py-2.5` on md size) to keep 44×44 tap targets on touch devices.

## Sanity Authoring Model

- Schema fields: `label`, `href`, `isExternal`, `icon`, `style`.
- Style options match the variants above.
- Icons must match the whitelist; unknown entries fall back to the neutral dot icon.
- The `CTA` front-end component accepts both the new schema and legacy `link` objects while content migrates.

## Examples

```tsx
import Button from "@/ui/cta/Button"
import CtaLink from "@/ui/cta/CtaLink"

// Button for in-page actions
<Button variant="primary" iconName="arrowRight">Start Free Trial</Button>

// Internal link CTA
<CtaLink href="/pricing" variant="secondary" iconName="arrowRight">
  View Pricing
</CtaLink>

// External link with icon leading
<CtaLink
  href="https://example.com/playbook"
  variant="tertiary"
  iconName="externalLink"
  iconPosition="leading"
>
  Download Playbook
</CtaLink>

// Icon-only button with required aria-label
<Button iconName="calendar" ariaLabel="Open scheduling modal" />
```

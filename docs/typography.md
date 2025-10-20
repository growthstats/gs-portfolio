# Typography System

Our typography tokens provide an OrbAI-inspired rhythm while staying a11y friendly. Use the shared `Heading` component and global utilities to keep styling and semantics in sync across the app.

## Scale & Usage

- **display-hero** – Primary hero headlines on top-level pages. Reserve for the most prominent entry point. Renders at `clamp(2.5rem, 5vw, 5rem)` with tight tracking.
- **display-xl** – Secondary hero or marquee callouts on landing screens. Reuse for splash sections that are not the main page title.
- **h1** – Visual alternative for interior hero blocks or marketing callouts. Keep a single semantic `<h1>` per page; if the hero already uses `as="h1"`, reuse other variants for the rest of the page.
- **h2** – Default section heading. Most sections, modules, and layout blocks should use `variant="h2"`.
- **h3** – Subsection headings or strong supporting titles within a section.
- **h4** – Card titles, feature lists, or content-dense grid layouts.
- **h5** – Metadata headings, compact labels, or tertiary subsections.
- **h6** – Small annotations, inline headings, or UI labels that still need semantic weight.

Helper utilities:

- `.eyebrow` – Pretitle styling (uppercase, airy letter spacing, 80% opacity).
- `.subtitle` – Comfortable reading size for short blurbs beneath headings.
- `.section-badge` – Pill badge for contextual labels above titles.

## One `<h1>` Per Page

Maintain a single semantic `<h1>` to keep SEO signals clean. The reusable `Heading` component defaults to `as="h2"` / `variant="h2"` so it is safe to sprinkle throughout the page. Explicitly set `as="h1"` only for the primary page title (usually the hero). For marketing layouts, render the main hero as `as="h1"` and use `variant="display-hero"` or `variant="display-xl"` for the visual size.

## Pretitle + Title Pattern

Wrap pretitle and title spans inside a single `Heading` node to keep markup semantic:

```tsx
<Heading as="h2" variant="h2" className="space-y-1">
  <span className="block eyebrow">Our Services</span>
  <span className="block">What We Do Best</span>
</Heading>
```

This pattern keeps screen readers and crawlers focused on one heading while the spans control the visual layout.

## Accessibility Notes

- **Legibility:** All heading sizes meet or exceed 18 px on the smallest breakpoint, satisfying WCAG AA for large text. Avoid using ultra-light font weights; the `Heading` component locks variants to `font-semibold`.
- **Contrast:** Pair headings with palette tokens that meet AA contrast ratios against the background (e.g., `text-ink`, `text-ink/80`). Avoid relying solely on color for meaning—combine `.section-badge` or `.eyebrow` with clear text.
- **Reduced Motion:** Typography tokens do not animate sizes, avoiding motion sickness and keeping focus states predictable.
- **Text Balance:** Large display headings default to `text-balance` to prevent awkward wraps. Pass `balance={false}` when you intentionally manage line breaks.

## Cumulative Layout Shift (CLS)

- Clamp-based font sizes (`clamp(...)`) are calculated server-side, preventing reflow between SSR and hydration.
- Each token pins a stable line-height (`leading-*`) and letter-spacing (`tracking-*`) so the layout does not jump as web fonts load.
- Avoid manually overriding line-height on headings; instead, reuse the shared tokens or the `Heading` component.

## Heading Component Quick Reference

```tsx
<Heading
  as="h3"
  variant="h2"
  className="subtitle"
>
  Usage Example
</Heading>
```

- `as` controls the semantic tag; default is `h2`.
- `variant` controls the visual scale; default is `h2`.
- `balance` defaults to `true` for display variants and `false` elsewhere.
- Compose additional utilities with the `className` prop. The component merges classes via `cn(...)`, so standard Tailwind merging rules apply.

## Text Balance Fallback

Browsers that support `text-wrap: balance` will honor it automatically; a `@supports not (text-wrap: balance)` fallback sets `text-wrap: pretty` to maintain reasonable wrapping. Apply the `.text-balance` utility manually for other large text blocks when you need balanced ragged edges.

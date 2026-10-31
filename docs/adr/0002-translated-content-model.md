# 0002 — Translated content model in Sanity

Status: accepted (2026-10-31)

## Context

`@sanity/document-internationalization` is installed for `page` and `blog.post`, but no document has a `language` field yet and no `translation.metadata` documents exist. Menus, site settings, the blog global module, categories and testimonials are not translatable. Translated page addresses (`/de/leistungen`) are out of scope for now.

## Decision

1. **Document-level translation for every type with visible copy:** `page`, `blog.post`, `navigation`, `global-module`, `blog.category`, `testimonial` and `site`. A German version is a separate document with `language: 'de'`, linked to the English one by the plugin's `translation.metadata`. `person`, `logo` and `redirect` stay single-language.
2. **Same slug in every language.** A German page keeps the English slug (`/de/services`). This makes links language-independent: any link, including menus that reference English page documents, resolves to `/<lang>/<slug>` for the current language. Slug uniqueness is checked per type **and language**, replacing Sanity's default check, which would reject the German copy.
3. **Backfill.** A one-off migration sets `language: 'en'` on every existing document of the types above. Queries still use `coalesce(language, 'en')` so a missed document can't vanish.
4. **English fallback.** When a document has no published version in the requested language, the English one is rendered under the `/de/` URL (German header, footer and UI strings around English content). That page's canonical points at the English URL, and it is left out of the German hreflang set and the German sitemap. Missing German site settings, menus or global modules fall back the same way.
5. **The `site` singleton.** The English document keeps `_id: 'site'`; the German one is `site-de`. Business details for the LocalBusiness JSON-LD (address, geo, phone) are always read from `site`, so they can't drift between languages.

## Consequences

- One query helper owns "this language, else English", and every fetch goes through it. Ad-hoc `language == '${lang}'` string interpolation in route files is removed.
- In `npm run dev` the site reads the `drafts` perspective (`src/sanity/lib/fetch.ts`), so unpublished German drafts show locally. That's useful for review, but agents must not treat a working local page as published.
- Adding French later is content work plus one entry in the languages config.

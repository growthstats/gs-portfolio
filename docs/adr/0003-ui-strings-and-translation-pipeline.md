# 0003 — UI strings and the translation pipeline

Status: accepted (2026-10-31)

## UI strings

Text that lives in code rather than Sanity, such as button labels, contact form labels and validation errors, the six `*Placeholder` modules, "min read" and dates.

**Decision:** an in-house typed dictionary, no i18n library.

- `src/i18n/dictionaries/en.ts` is the source of truth; `de.ts` must satisfy `typeof en` (a missing key is a type error).
- Server components call `getDictionary(lang)`. Client components receive the strings they need as props or via a small `DictionaryProvider` set in `[lang]/layout.tsx`.
- Dates and numbers use `Intl` with the page language.
- Zod messages in `src/lib/contactForm.ts` become dictionary keys; the schema is built per language.

Why not next-intl: the dictionary is under 200 strings, routing is already handled by ADR 0001, and one fewer dependency keeps the bundle and upgrades simple.

## Translation pipeline

Translations are drafted by an agent (Claude) and proofread by a native speaker at Growth Stats before publishing.

**Decision:** export, translate, import, all scripted, so the agent never hand-edits Portable Text structure.

1. `scripts/i18n/export.ts --lang de` writes one JSON file per English document to `i18n-work/de/` (git-ignored): a flat map of stable keys (document id + path to each text field and span) to English strings.
2. The agent translates the values in place: keys untouched, brand names and URLs kept, Growth Stats' tone.
3. `scripts/i18n/import.ts --lang de` rebuilds each document from the English original with the translated strings and writes it as a **draft** (`drafts.<id>`) with `language: 'de'`. It creates or updates the `translation.metadata` link in the plugin's exact format (read from the plugin source, not guessed) and remaps references to translated categories and testimonials.
4. Nothing is published by the pipeline. Publishing happens in the Studio after proofreading.

The scripts use `SANITY_API_WRITE_TOKEN` from `.env`. They are idempotent (re-running updates the same drafts) and have a `--dry-run` flag.

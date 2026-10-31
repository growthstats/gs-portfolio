# Epic: Multilingual website (German first)

Draft for review. Each `## T…` section becomes one GitHub issue; `T…` references become real issue numbers when filed. Decisions are in [ADR 0001](../adr/0001-language-routing.md)–[0004](../adr/0004-ci-and-agent-workflow.md), and terms in [CONTEXT.md](../../CONTEXT.md).

**In scope:** setup + German (pages and blog). **Out of scope:** French, translated page addresses, redirecting visitors by country, human translation.

## Waves

| Wave | Runs in parallel                                                | Blocked by        |
| ---- | --------------------------------------------------------------- | ----------------- |
| 0    | T0 setup and CI                                                 | —                 |
| 1    | T1 routing · T2 Sanity schema                                   | T0                |
| 2    | T3 queries + fallback · T4 UI strings · T7 translation pipeline | T1 / T2           |
| 3    | T5 switcher · T6 SEO · T8 German pages · T10 editor guide       | T3 / T7           |
| 3b   | T8b German blog                                                 | T8                |
| 4    | T9 QA pass                                                      | T5, T6, T8, T8b   |
| —    | T11 go live (human)                                             | T9 + proofreading |

Two issues in the same wave never share files; each issue's **Scope** section enforces that.

---

## T0 — Setup: green baseline, Vitest, GitHub Actions CI

**Blocked by:** none. **Labels:** `ready-for-agent`. **ADR:** 0004.

`develop` has 4 type errors and 11 lint errors that `next.config.ts` hides at build time, and PRs have no checks since Vercel previews were turned off.

**Acceptance criteria**

- [ ] `.claude/` and `.next/` are excluded from ESLint (`eslint.config.*`).
- [ ] `npm run lint` and `npm run typecheck` exit 0 on a clean checkout. Fix the errors; don't disable rules, except with a one-line justification per disable. The `react-hooks/rules-of-hooks` errors are real bugs: fix the hook order.
- [ ] Vitest installed, `npm test` script, one sample test.
- [ ] `.github/workflows/ci.yml` runs on PRs into `develop` and on pushes to `develop`: Node from `.nvmrc` (add one, Node 22 LTS), `npm ci`, lint, typecheck, test, build. `SANITY_API_READ_TOKEN` comes from secrets; the other `NEXT_PUBLIC_SANITY_*` values are set in the workflow (they're public).
- [ ] `ignoreBuildErrors` / `ignoreDuringBuilds` are removed from `next.config.ts`.
- [ ] No mass Prettier reformat.

**Scope:** eslint config, `next.config.ts` (the two flags only), files with lint or type errors, `package.json`, `.github/`, `.nvmrc`, `vitest.config.ts`. **Do not touch:** anything else.

**How to verify:** the PR's CI run is green. A PR that adds a type error makes it red (try locally with `act`, or reason it through and describe it in the PR).

**Human step first:** add the `SANITY_API_READ_TOKEN` Actions secret.

---

## T1 — Language routing with a `[lang]` segment

**Blocked by:** T0. **ADR:** 0001.

**Acceptance criteria**

- [ ] `src/lib/i18n.ts`: supported `en` and `de`; `enabledLanguages` from `NEXT_PUBLIC_ENABLED_LANGUAGES` (default `en`, always includes `en`, ignores unknown codes); helpers `isEnabledLanguage`, `parseLangFromPath`, `localizePath(path, lang)`. Unit-tested.
- [ ] All routes in `src/app/(frontend)/` move under `src/app/(frontend)/[lang]/`. `[lang]/layout.tsx` renders `<html lang>` on the server, `generateStaticParams` returns enabled languages, and `Root.tsx` and `src/lib/getLang.ts` are deleted.
- [ ] `src/middleware.ts` is rewritten: unprefixed path → rewrite to `/en/...`; `/en/...` → 308 to unprefixed; supported-but-disabled prefix → 404; no Sanity calls, no cookies. The matcher excludes `api`, `admin`, `_next`, files with an extension, `sitemap.xml`, `robots.txt`, `llms.txt`.
- [ ] The page routes take `lang` from params and pass it down. Data fetching keeps today's English queries for now (T3 makes them language-aware).
- [ ] The `/:lang/blog/:slug` rewrite is removed from `next.config.ts`. The cookie action `src/ui/LanguageSwitcher/actions.ts` is deleted, and the switcher is hidden until T5.
- [ ] `resolveUrl` uses `localizePath`.
- [ ] With `NEXT_PUBLIC_ENABLED_LANGUAGES=en`, every existing URL behaves exactly as before: same paths, same content, statically generated.

**Scope:** `src/app/(frontend)/**`, `src/middleware.ts`, `src/lib/i18n.ts`, `src/lib/getLang.ts`, `src/lib/resolveUrl.ts`, `src/ui/Root.tsx`, `src/ui/LanguageSwitcher/**`, `next.config.ts` (rewrites only), new tests. **Do not touch:** `src/sanity/**` (T2), placeholder modules (T4).

**How to verify:** `/`, `/services`, `/blog`, a blog post, `/contact` and `/blog/rss.xml` work as before. `/en/services` → 308 to `/services`. `/de/services` → 404 with `de` disabled; with `de` enabled → renders the English content (fallback comes in T3) with `<html lang="de">`. Build output lists static pages per language.

---

## T2 — Sanity: translatable types, per-language slugs, backfill

**Blocked by:** T0. Runs alongside T1. **ADR:** 0002.

**Acceptance criteria**

- [ ] `documentInternationalization` covers `page`, `blog.post`, `navigation`, `global-module`, `blog.category`, `testimonial` and `site`, using the supported languages from `src/lib/i18n.ts` (the config list, not the enabled one, so editors can prepare German before launch).
- [ ] Each of those types has a hidden, read-only `language` field.
- [ ] Slug uniqueness is checked per type and language (custom `isUnique`), so a German page can reuse the English slug.
- [ ] The Studio desk shows the English `site` and German `site-de` singletons; neither can be duplicated or deleted. Other types show a language badge in their preview.
- [ ] `scripts/migrations/backfill-language.ts` sets `language: 'en'` on every published document of those types that lacks one. It supports `--dry-run`, is idempotent and uses `SANITY_API_WRITE_TOKEN`. Run it against `production` and record the counts in the PR.
- [ ] Schema deployed (`npx sanity schema deploy`) after merge.

**Scope:** `sanity.config.ts`, `src/sanity/schemaTypes/**`, `src/sanity/structure*`, `scripts/migrations/**`. **Do not touch:** `src/app/**`, `src/sanity/lib/queries.ts` (T3), `src/lib/i18n.ts` beyond reading it (T1 owns it; if T1 hasn't merged, import the supported list from a new `src/lib/languages.ts` and leave a note for T3 to fold it in).

**How to verify:** in the local Studio (`/admin`), open a page, use the Translations menu to create a German version, and give it the same slug: no uniqueness error. Delete that test translation afterwards. Dry-run and real migration output are in the PR.

---

## T3 — Language-aware queries with English fallback

**Blocked by:** T1, T2. **ADR:** 0002.

**Acceptance criteria**

- [ ] One helper owns "document in `lang`, else English". Every page, blog post, blog list, category, global module, navigation and site settings fetch uses it, with `$lang` as a GROQ param (no string interpolation).
- [ ] Each result says whether it is a **fallback**. Pages expose `isFallback` and the list of available translations (`{lang, url}`), used by T5 and T6.
- [ ] Blog lists in German show German posts plus English posts that have no German version, with no duplicates.
- [ ] Header and footer menus and the site CTAs come from the German `navigation` and `site-de` when they exist, else English. The LocalBusiness and Organization JSON-LD always read from `site`.
- [ ] `getTranslations()` (all-docs fetch) is deleted or limited to the sitemap.
- [ ] `generateStaticParams` returns every published (doc, enabled language) pair, plus fallback pairs for docs without a translation.
- [ ] Unit tests for the fallback selection.

**Scope:** `src/sanity/lib/**`, data fetching in `src/app/(frontend)/[lang]/**`, data fetching in `src/ui/header/**`, `src/ui/footer/**`, `src/ui/modules/blog/**`, `src/ui/OrganizationSchema.tsx`, `src/ui/LocalBusinessSchema.tsx`, `src/types/Sanity.d.ts`. **Do not touch:** hard-coded copy in components (T4), `processMetadata` and the sitemap (T6).

**How to verify:** with `de` enabled and one German draft page created locally (dev reads drafts), `/de/<that page>` shows German content, and every other `/de/...` page shows English content with German chrome. English URLs are unchanged. Delete the test draft afterwards.

---

## T4 — UI strings dictionary (English + German)

**Blocked by:** T1. Runs alongside T3. **ADR:** 0003.

**Acceptance criteria**

- [ ] `src/i18n/dictionaries/en.ts` and `de.ts` (`de` satisfies `typeof en`), `getDictionary(lang)`, `DictionaryProvider` + `useDictionary()` for client components, wired into `[lang]/layout.tsx`.
- [ ] Every hard-coded user-facing string moves to the dictionary. That covers the six `*Placeholder` modules, the contact form (labels, placeholders, buttons, success and error states, Zod messages built per language), the blog ("min read", filters, empty states, dates via `Intl.DateTimeFormat(lang)`), `not-found`, skip-to-content, search and breadcrumbs.
- [ ] German strings are written by the agent (AI draft, marked for proofreading in a comment at the top of `de.ts`).
- [ ] A test fails if `de` has an empty string or is missing a key.
- [ ] `grep` for a list of known English literals in `src/ui` finds none outside the dictionaries (record the command in the PR).

**Scope:** `src/i18n/**`, `src/ui/modules/*Placeholder*`, `src/ui/modules/contactPlaceholderForm.tsx`, `src/lib/contactForm.ts`, `src/app/api/contact/route.ts` (only to build the schema with the default language), presentational code in `src/ui/**`, `[lang]/layout.tsx` (provider only), `[lang]/not-found.tsx`. **Do not touch:** data fetching in header, footer or blog (T3).

**How to verify:** `/de/contact` with `de` enabled: form labels, placeholders and validation errors are in German, and a submitted test lead still arrives (use the dev server, mark it as a test, and delete the test row and email afterwards). The English site has no visible text changes.

---

## T5 — Language switcher

**Blocked by:** T3 (and T4 for its label).

**Acceptance criteria**

- [ ] The header switcher (desktop and mobile menu) lists enabled languages and links to the same page in each language (`/services` ⇄ `/de/services`). It's hidden when only one language is enabled.
- [ ] It's a plain link (works without JS), with `hreflang` and `lang` attributes. The current language is marked `aria-current`.
- [ ] On a fallback page, a small dismissible notice in the page language says the page isn't translated yet.
- [ ] Old cookie-based `Switcher.tsx` replaced.

**Scope:** `src/ui/LanguageSwitcher/**`, `src/ui/header/**` (placement only), a new `FallbackNotice` component, dictionary keys (append only). **Do not touch:** `processMetadata`, sitemap (T6).

**How to verify:** switch languages on the home page, a service page, the blog list and a blog post, on desktop and mobile widths. The keyboard works, and nothing jumps in the layout.

---

## T6 — Multilingual SEO

**Blocked by:** T3. Runs alongside T5.

**Acceptance criteria**

- [ ] Each page has `hreflang` alternates for every published translation plus `x-default` (English). Fallback pages have no German alternate, and their canonical is the English URL.
- [ ] Canonical URLs are absolute and language-correct. `og:locale` and `og:locale:alternate` are set.
- [ ] `sitemap.xml` lists every published translation with `xhtml:link` alternates, and no fallback URLs.
- [ ] Blog RSS stays English-only.
- [ ] JSON-LD `inLanguage` is set on pages and posts.
- [ ] `robots.ts` and `llms.txt` still work.
- [ ] Unit tests for the alternates and canonical builder.

**Scope:** `src/lib/processMetadata.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/llms.txt/**`, `src/ui/BlogPostSchema.tsx`, new SEO helpers and tests. **Do not touch:** switcher or header (T5).

**How to verify:** view source on `/services` and `/de/services` (with a German draft locally) and check the head tags. `curl` `/sitemap.xml` locally. Paste the snippets in the PR.

---

## T7 — Translation pipeline scripts

**Blocked by:** T2. **ADR:** 0003.

**Acceptance criteria**

- [ ] `scripts/i18n/export.ts --lang de [--type page|blog.post|…] [--id …]` writes `i18n-work/de/<type>/<id>.json` (git-ignored). Each file is a flat `{ key: englishString }` map covering every translatable string field and Portable Text span. Images, URLs, slugs, code blocks and references are not exported.
- [ ] `scripts/i18n/import.ts --lang de [--dry-run]` rebuilds each document from the current English original with the translated strings and writes `drafts.<id>` with `language: 'de'`. It creates or updates `translation.metadata` in exactly the plugin's format (read the plugin source in `node_modules/@sanity/document-internationalization` and cite the file in the PR). It remaps references to categories and testimonials that have a German version. It never publishes.
- [ ] Idempotent: a second run updates the same drafts and creates no duplicates. A changed English document re-exports cleanly.
- [ ] `scripts/i18n/README.md` with the agent instructions for translating a file: keep keys, brand names (Growth Stats), URLs and placeholders; formal "Sie"; match tone; don't translate the person names.
- [ ] Unit tests for flatten and unflatten on a Portable Text fixture with marks, links and lists.

**Scope:** `scripts/i18n/**`, `.gitignore`, `package.json` (scripts and dev deps). **Do not touch:** anything under `src/`.

**How to verify:** round-trip one page with an identity translation: import writes a draft identical to the English page except `language`, and the Studio shows it linked under Translations. Then delete that test draft and its metadata.

---

## T8 — German pages: draft translations

**Blocked by:** T7, T2.

**Acceptance criteria**

- [ ] German draft translations exist for all 12 pages, `site` (as `site-de`), the 3 navigation docs, the blog global module, the 12 categories and the testimonial.
- [ ] Translated with the T7 pipeline and README rules. No hand-edited Portable Text.
- [ ] Every draft opens without validation errors in the Studio.
- [ ] Nothing is published.
- [ ] A word-count table per document in the PR, for the proofreader.

**Scope:** Sanity content (drafts only), `i18n-work/` (not committed). No code changes; a fix to the scripts goes back to T7 as a new issue. The PR is a short report-only PR adding `docs/i18n/de-status.md`.

**How to verify:** with `de` enabled locally (dev reads drafts), click through every page under `/de/` on desktop and mobile. Note anything broken (overflowing German words in buttons and headings) in `de-status.md`, and file follow-up issues for layout fixes.

---

## T8b — German blog: draft translations

**Blocked by:** T8.

The same as T8 for all 10 blog posts (~17.7k words), using the categories translated in T8. It appends to `docs/i18n/de-status.md`.

---

## T9 — QA pass across languages

**Blocked by:** T5, T6, T8, T8b.

**Acceptance criteria**

- [ ] A checklist run in the local browser at desktop (1440) and mobile (375) widths, in English and German. It covers home, every service page, about, contact (submit a test lead and clean it up), blog list, filters, a post, search, 404, switcher round-trips and the fallback notice.
- [ ] Head tags checked on 5 pages per language. Sitemap validated.
- [ ] `npm run build` output: page count per language as expected.
- [ ] English pages: no visible change against production (compare screenshots).
- [ ] Results in `docs/i18n/qa.md`, with one issue filed per bug found. Bugs are fixed only if they're one-line fixes; otherwise they get their own issue.

**Scope:** `docs/i18n/qa.md`, one-line fixes.

---

## T10 — Editor guide for translations

**Blocked by:** T2, T7.

**Acceptance criteria**

- [ ] `docs/i18n/editing-guide.md` for Growth Stats editors (non-technical). It covers how to find a page's German version, proofread and publish it, what happens to untranslated pages, adding a new page in both languages, editing German menus and site settings, and how to ask for a new language.
- [ ] Screenshots from the local Studio.
- [ ] A short "for developers" section: how to run the pipeline for new or changed content.

**Scope:** `docs/i18n/**`.

---

## T11 — Go live with German (human)

**Blocked by:** T9, plus Growth Stats' proofreading sign-off. **Labels:** `ready-for-human`.

- [ ] Proofread drafts published in the Studio.
- [ ] `NEXT_PUBLIC_ENABLED_LANGUAGES=en,de` set in Vercel (Production + Preview).
- [ ] Release `develop` → `main`.
- [ ] Check live: `/de/`, switcher, head tags, sitemap.
- [ ] Submit the sitemap in Google Search Console.

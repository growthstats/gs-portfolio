# 0001 — Language routing

Status: accepted (2026-10-31)

## Context

Growth Stats wants per-language versions of the site at `growthstats.io/de/*`, `/fr/*` and so on, with English staying at the root. The SanityPress starter shipped disabled scaffolding for this:

- `[[...slug]]` peeks at the first URL segment for a language.
- `src/middleware.ts` fetches every translation from Sanity on **every request** and redirects based on a cookie.
- `Root.tsx` reads the language client-side from the pathname with a broken regex (a character class, `[en|de]+`, not an alternation).

The root layout has no `lang` param, so the header, footer and `<html lang>` cannot know the language on the server.

## Decision

1. **A `[lang]` route segment.** All frontend routes move under `src/app/(frontend)/[lang]/`, and `[lang]/layout.tsx` becomes the frontend root layout that renders `<html lang={lang}>`.
2. **English unprefixed, via rewrite.** Middleware rewrites (it does not redirect) `/services` to `/en/services` internally. `/de/services` passes through. `/en/...` URLs typed by hand redirect (308) to the unprefixed path, so English has one URL.
3. **No Sanity fetch, cookie or geo logic in middleware.** It is pure string work on the pathname. Visitors choose a language with the switcher; nothing redirects them by country or `Accept-Language`, because that hides pages from Google's crawler.
4. **Languages config.** `src/lib/i18n.ts` lists every language the code supports (`en`, `de`). `NEXT_PUBLIC_ENABLED_LANGUAGES` (comma-separated, default `en`) decides which are live. A supported but disabled language prefix 404s. This lets the code merge and release before German has been proofread.
5. **Static generation stays.** `[lang]/layout.tsx` and every page's `generateStaticParams` return each enabled language.
6. Matcher excludes `api`, `admin`, `_next`, static files, `sitemap.xml`, `robots.txt` and `llms.txt`.

## Consequences

- Every frontend route file moves. That makes routing the first task, done alone, because every other task builds on it.
- The existing cookie switcher (`LanguageSwitcher/actions.ts`) and the per-request `getTranslations()` call in middleware are deleted.
- The `/:lang/blog/:slug` rewrite in `next.config.ts` goes away; blog URLs become `/de/blog/<slug>` natively.
- Middleware gets cheaper than today, since there is no Sanity request per page view.

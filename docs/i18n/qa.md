# i18n QA pass

The checklist run for #72, on 2026-11-01. It covers the multilingual epic (#61) as merged into `develop` at `24c5a0c`: #67 (language switcher and fallback notice), #68 (canonical, hreflang, sitemap, JSON-LD), #70 and #71 (German drafts).

**Setup:** a local dev server and a production build with `NEXT_PUBLIC_ENABLED_LANGUAGES=en,de` on Node 22. Dev reads drafts, so every German page and post below is an unpublished draft from #70/#71. Production (`www.growthstats.io`) runs `main` and was the English baseline.

## Result

No i18n regression in English. German renders on every route, with three German bugs and three older ones filed below. None of the bugs is a one-line fix, so this pass changes no code.

| Bug                                                                                | Language       | Issue |
| ---------------------------------------------------------------------------------- | -------------- | ----- |
| Long German words overflow on mobile (`/de/search-engine-optimization` H1 and CTA) | German         | #93   |
| German blog cards link to the English posts                                        | German         | #103  |
| `/de` 404 mixes English server strings with German client strings                  | German         | #97   |
| Blog post lists overflow by 16px on mobile (also on production)                    | Both           | #98   |
| FAQ module nests `h3` and `p`, causing a hydration error                           | Both           | #102  |
| Three English page drafts have slugs ending in `/` and will 404                    | English drafts | #100  |

Found during this pass, but outside the site code: production returned 500 on every route from 08:25 UTC, because `main`'s old middleware threw on the German draft links that #70/#71 created. Fixed in `main` by #101; `develop` already skips unpublished translations.

## Checklist

Widths: desktop 1440, mobile 375 (360 usable after the scrollbar). ✅ passes, ⚠️ passes with a filed bug, ➖ not testable with the current content.

| Check                          | English | German | Notes                                                                                      |
| ------------------------------ | :-----: | :----: | ------------------------------------------------------------------------------------------ |
| Home                           |   ✅    |   ✅   |                                                                                            |
| Service pages (5) and Services |   ✅    |   ⚠️   | #93: `/de/search-engine-optimization` scrolls sideways at 375                              |
| About                          |   ✅    |   ✅   |                                                                                            |
| Privacy policy                 |   ✅    |   ✅   | `noindex` in both languages                                                                |
| Contact: form validation       |   ✅    |   ✅   | Empty submit shows the German errors; no request is sent                                   |
| Contact: test lead             |   ➖    |   ➖   | Not submitted: it emails the team via Resend and writes a row to the Leads sheet           |
| Blog list                      |   ✅    |   ⚠️   | #103: cards link to English posts                                                          |
| Blog category filter           |   ✅    |   ✅   | `?category=seo`, `aria-pressed` follows the selection                                      |
| Blog post                      |   ⚠️    |   ⚠️   | #98: 6 of 10 posts scroll 16px at 375                                                      |
| Search                         |   ➖    |   ➖   | No page uses the search module                                                             |
| 404                            |   ✅    |   ⚠️   | #97. Sanity has no 404 page, so the body is a bare "404" in both languages                 |
| Switcher (desktop)             |   ✅    |   ✅   | Each page links to its own translation; `aria-current` on the active language              |
| Switcher (mobile)              |   ✅    |   ✅   | Hidden until the menu opens, then shown under the CTA                                      |
| Switcher round-trip            |   ✅    |   ✅   | `/blog/voice-search` → `/de/blog/voice-search` → back; `<html lang>` follows               |
| Fallback notice                |   ➖    |   ➖   | Every published English page and post has a German draft, so no page falls back            |
| Console                        |   ⚠️    |   ⚠️   | #102 on pages with an FAQ. Sanity Live CORS errors come from the non-default dev port only |

Desktop: no horizontal overflow on any of the 26 pages. Mobile: overflow only on the pages in #93 and #98.

## Head tags and sitemap

Checked on all 13 routes per language, not only 5:

- `<html lang>` matches the route.
- One canonical per page, pointing to the page's own language URL.
- `hreflang` alternates for `en`, `de` and `x-default` (English).
- `og:locale` is `en_US` or `de_DE`, with the other language as `og:locale:alternate`.
- JSON-LD `inLanguage` matches the page.

The canonical host comes from `NEXT_PUBLIC_BASE_URL`, so locally it is `localhost:3000`.

`sitemap.xml` is well-formed with 43 URLs (23 English, 20 German), each with `xhtml:link` alternates. Locally it includes drafts. The three extra English URLs are the drafts in #100. `robots.txt`, `llms.txt` and the RSS feed per language are correct.

## Build

`npm run build` with `en,de`: 57 static pages, the same per language:

- 10 pages (the home page is rendered on demand, as on `main`)
- 11 blog routes (10 posts and the `/blog/*` template)
- RSS feed and the dev demo route

CI builds with the default `NEXT_PUBLIC_ENABLED_LANGUAGES` (`en` only). There the switcher renders nothing, since fewer than two languages are enabled.

## English against production

The title, `h1` and number of `h2`s match production on all 13 English routes. The home page screenshot matches production at 1440. The only difference is the EN/DE switcher, which shows only when German is enabled.

## Not covered

- **Contact test lead:** see the checklist.
- **Fallback notice:** it can't show while every English document has a German version. `isFallback` is unit-tested in `src/sanity/lib/localized.test.ts`; check the notice in the browser when a new English page is published without a translation.
- **Production with German enabled:** German stays off in production until the drafts are proofread and published (`docs/i18n/de-status.md`).

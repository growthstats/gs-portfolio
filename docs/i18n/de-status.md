# German translation status

Draft translations for #70, made with the translation pipeline (`scripts/i18n/`, [ADR 0003](../adr/0003-ui-strings-and-translation-pipeline.md)) on 2026-11-01. Dataset `f3duu4s4`/`production`.

**Every German document below is a draft. Nothing is published.** A native speaker proofreads and publishes each one in the Studio (filter the document lists by `[de]`).

The 10 blog posts were drafted afterwards in #71; see [Blog posts (#71)](#blog-posts-71) at the end.

## Before you proofread

- Re-running `npm run i18n:import -- --lang de` replaces a draft, including your edits. Once proofreading has started on a document, edit it only in the Studio.
- Tone and terms used throughout: formal "Sie"; "Leistungen" for services; "bezahlte Werbung" for paid advertising; "Social-Media-Marketing"; "das Audit". Brand, client, tool and person names are unchanged.
- Slugs are the English ones on purpose ([ADR 0002](../adr/0002-translated-content-model.md)): `/de/services`, not `/de/leistungen`.

## Documents

Word counts are visible words in the strings the pipeline exported (prose, headings, labels, alt text, SEO fields). Use the German count to plan the proofreading.

| Type          | English document                 | German draft                                                           | Strings |  EN words |  DE words |
| ------------- | -------------------------------- | ---------------------------------------------------------------------- | ------: | --------: | --------: |
| page          | Homepage (`/`)                   | Startseite `drafts.6999302d-fa03-414e-b9ea-bccfb942e55f`               |      60 |       335 |       333 |
| page          | Services                         | Leistungen `drafts.0cce9312-2b9b-400a-b970-f7071275ac97`               |      61 |       527 |       484 |
| page          | Search Engine Optimization       | Suchmaschinenoptimierung `drafts.d369816e-8bc0-4db8-a64a-382ace7532d9` |      53 |       480 |       473 |
| page          | Social Media Marketing           | Social-Media-Marketing `drafts.ab7b0bb0-ba4f-4d35-afac-686498a124ff`   |      61 |       444 |       409 |
| page          | Email Marketing                  | E-Mail-Marketing `drafts.efe82a7c-c388-42fa-bb30-f9f3e843217f`         |      48 |       459 |       435 |
| page          | Paid Advertising                 | Bezahlte Werbung `drafts.abd08a5a-06e3-4f07-9d54-2141c21e7cc6`         |      53 |       463 |       441 |
| page          | Web Design & Development         | Webdesign & Entwicklung `drafts.a042fbd3-9cbe-4ce8-8ece-e8701ffbe2ec`  |      51 |       464 |       456 |
| page          | About                            | Über uns `drafts.6f26452f-39d2-41e8-a250-581a51c7d4e2`                 |       6 |        55 |        51 |
| page          | Contact                          | Kontakt `drafts.c1d487a9-d474-49dc-a1a7-dbee9343672e`                  |      11 |        49 |        46 |
| page          | Privacy Policy                   | Datenschutzerklärung `drafts.e20f60c4-9090-419b-8e64-8170edc36ec5`     |      36 |       347 |       340 |
| page          | Blog                             | Blog `drafts.396b514e-8690-40eb-8d6e-75f81e6610f7`                     |      11 |        53 |        45 |
| page          | Blog Single Template (`/blog/*`) | Vorlage Blogbeitrag `drafts.127a46b6-f15c-4618-a7f6-9c8ad15426f5`      |       2 |         6 |         5 |
| site          | Site settings (`site`)           | `drafts.site-de`                                                       |       4 |        10 |        10 |
| navigation    | Header Menu                      | Header-Menü `drafts.5009a734-afc7-4b54-a17a-6ec2867ac001`              |      10 |        20 |        14 |
| navigation    | Footer Menu                      | Footer-Menü `drafts.fc934052-5ed1-43db-84f2-6c0061cf7dc1`              |      15 |        30 |        22 |
| navigation    | Social Links                     | Social-Media-Links `drafts.67e7590b-7a51-4772-b474-97ea13150297`       |       5 |         6 |         5 |
| global-module | Blog breadcrumb module           | `drafts.5ff33c8d-fe48-4a91-941e-1743fe72ffdd`                          |       1 |         1 |         1 |
| testimonial   | MarketsandMarkets testimonial    | `drafts.015855bc-3e34-4709-8f67-b6bbb2b32c03`                          |       2 |        88 |        71 |
| blog.category | Reviews                          | Bewertungen `drafts.6e2e91e0-e235-4b13-94d0-90d2a5d441e6`              |       1 |         1 |         1 |
| blog.category | Link Building                    | Linkbuilding `drafts.fef53c7e-e8fe-4e15-ab01-380f59320703`             |       1 |         2 |         1 |
| blog.category | Content                          | Content `drafts.9a0198c8-7eeb-4431-a37a-c4eaaad14b2d`                  |       1 |         1 |         1 |
| blog.category | Content2                         | Content2 `drafts.423d3748-f311-49cb-92a3-76fd11d0684f`                 |       1 |         1 |         1 |
| blog.category | CUBESATS                         | CUBESATS `drafts.4d4a81af-48ce-40d3-887f-a5c7bf6b6f43`                 |       1 |         1 |         1 |
| blog.category | Marketing                        | Marketing `drafts.07fb043f-5d02-473e-adb2-99be7f0693d9`                |       1 |         1 |         1 |
| blog.category | Movies                           | Filme `drafts.852e1975-067b-4a9a-a597-af003591861a`                    |       1 |         1 |         1 |
| blog.category | Photography                      | Fotografie `drafts.de879129-7d9e-4318-9837-49ea55c18049`               |       1 |         1 |         1 |
| blog.category | Science                          | Wissenschaft `drafts.6ec13099-07f5-427e-bb4d-cf413cc55631`             |       1 |         1 |         1 |
| blog.category | Satellites                       | Satelliten `drafts.bcce767a-0361-46ee-8818-28110296755a`               |       1 |         1 |         1 |
| blog.category | SEO                              | SEO `drafts.c5e98f50-49b2-4e27-bb4f-784b648a7932`                      |       1 |         1 |         1 |
| blog.category | tseo                             | tseo `drafts.da5d677a-4558-4e89-a800-f1835cf2e69a`                     |       1 |         1 |         1 |
| **Total**     | **30 documents**                 |                                                                        | **502** | **3,850** | **3,653** |

Each draft is linked to its English original by a `translation.metadata` document (29; `site-de` has none by design), so the Studio's Translations menu shows the pair.

## Checks done

- **Validation:** `sanity documents validate` with the local Studio schema reports no errors on the 30 drafts. The only warnings are unknown fields copied from the English originals (`parentCategory` on 4 categories, `uid` on the blog template), which the English documents have too. The 29 metadata documents report "Referenced document must be published" until the German drafts are published; the Studio's own Translations menu produces the same.
- **Studio:** the Studio lists all German drafts with a `[de]` prefix. The About draft, which the Sanity API's older deployed schema flagged for an empty `icon` (inherited from English), opens with no validation markers.
- **Site, desktop and 375px mobile**, with `NEXT_PUBLIC_ENABLED_LANGUAGES=en,de` and `next dev` (which reads drafts): all 12 pages under `/de/` render the German drafts, with the German header, footer and site CTA.

## For the proofreader

- **Privacy Policy is a legal text.** The German version is a faithful translation of the English one, not a GDPR (DSGVO) privacy policy. Have it reviewed before publishing. Its English SEO description mentions "the Atharva Mahamuni portfolio website", which looks like a leftover; the German one says the same, so fix both.
- **Testimonial:** the author's title is the placeholder "Some title" in English; left untouched.
- **Blog categories** CUBESATS, tseo, Content2, Movies, Photography, Science and Satellites look like test data. They are translated where they are words; consider deleting them in both languages instead.
- **Social Media Marketing → ROI-Analyse & Reporting:** "each dollar invested" became "jeder investierte Euro".
- **FAQ intro** ("Our FAQ section explains … decisions Ever.") is the same on all five service pages; the German drops the stray "Ever".

## Not translated, and why

| Where                   | What shows in English on `/de`                                                                              | Why                                                                                   | Follow-up |
| ----------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | --------- |
| Homepage hero           | "Get Discovered / By Search Engines & AI / Build the technical and semantic signals that drive visibility." | Stored as raw HTML in a `custom-html` code block, which the pipeline skips by design. | #94       |
| Every service page      | "Our Features" heading                                                                                      | Hard-coded in `src/ui/modules/ServiceDetails.tsx`                                     | PR #90    |
| Blog posts              | "Table of Contents"                                                                                         | Hard-coded in `src/ui/modules/RichtextModule/TableOfContents.tsx`                     | #87       |
| Menus, CTAs, blog cards | Links go to English URLs (`/blog/...`, not `/de/blog/...`)                                                  | Internal links aren't localized yet                                                   | #88       |

## Layout issues found

- `/de/search-engine-optimization` at 375px: the H1 "Suchmaschinenoptimierung" is wider than the screen (393px > 375px), so the page scrolls sideways.
- `/de` at 375px: the service card title "Weblösungen" overflows its box by 13px.

Both are single long German words that don't wrap or hyphenate. Fix in CSS (`hyphens: auto` with `lang="de"`, or `overflow-wrap` on headings), tracked in #93. Desktop is fine on every page.

## Blog posts (#71)

Draft translations of all 10 blog posts, made with the same pipeline on 2026-11-01 (`npm run i18n:import -- --lang de --type blog.post`). Each draft is linked to its English post by a new `translation.metadata` document. Categories point at the German category drafts from #70. **Nothing is published.**

| English post                                                                                          | German draft                                                                                                                                         |   Strings |   EN words |   DE words |
| ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | --------: | ---------: | ---------: |
| 5 Proven Ways to Reduce Bounce Rate and Increase Dwell Time                                           | 5 bewährte Wege, die Absprungrate zu senken und die Verweildauer zu erhöhen `drafts.9f41c080-5dae-4897-a8ef-be21368397f8`                            |       175 |      3,151 |      3,037 |
| From Keywords to Intent: How to Optimize Your Website for Conversational AI Queries                   | Von Keywords zur Suchintention: So optimieren Sie Ihre Website für dialogorientierte KI-Anfragen `drafts.0edee32d-0d85-4e23-9938-bfce0d271d46`       |       229 |      1,739 |      1,770 |
| How to Appear in Google AI Overviews: Step-by-Step SEO Guide for 2026                                 | So erscheinen Sie in Google AI Overviews: Schritt-für-Schritt-SEO-Leitfaden für 2026 `drafts.efabca86-093e-477d-b1c0-bb7698557e11`                   |       192 |      3,150 |      3,202 |
| Predictive Analytics in Marketing SERP Research & AI Forecasting -Growth Stats                        | Predictive Analytics im Marketing: SERP-Recherche & KI-Prognosen – Growth Stats `drafts.5fd73ad6-74fe-439b-9333-9fd6c19a237a`                        |       307 |      2,095 |      2,183 |
| Sitemaps and Indexing: Complete Technical SEO Guide for Faster Google Indexing                        | Sitemaps und Indexierung: Der komplette Guide für technisches SEO und schnellere Google-Indexierung `drafts.270a7c79-12af-49f4-9e0a-1a1a08bc2fa3`    |       216 |      2,289 |      2,305 |
| The E-E-A-T SEO Imperative: Why Human-First Content is the Only Way to Rank in the AI Era             | E-E-A-T als SEO-Pflicht: Warum im KI-Zeitalter nur menschenzentrierte Inhalte ranken `drafts.aabe21e1-7406-4cd0-9f45-90d32579d557`                   |       137 |      1,615 |      1,687 |
| The Future of Search: GEO vs Traditional SEO – SERP Research Insights for 2026                        | Die Zukunft der Suche: GEO vs. klassisches SEO – SERP-Insights für 2026 `drafts.7547b3f4-5c06-43b7-af72-406f0c969b51`                                |       245 |      1,807 |      1,913 |
| The Rise of Voice Search 2.0: Optimizing for Smart Assistants and Wearable AI Devices — SERP research | Der Aufstieg von Voice Search 2.0: Optimierung für Sprachassistenten und KI-Wearables — SERP-Recherche `drafts.d74a7c69-f6b3-460e-be94-f605bfaf16b4` |       216 |      2,134 |      2,193 |
| The Ultimate Guide to Free SEO Tools: Boosting Your Rankings Without a Massive Budget                 | Der ultimative Leitfaden zu kostenlosen SEO-Tools: Bessere Rankings ohne großes Budget `drafts.81756954-552d-4f86-83c6-cfa7518c594e`                 |       182 |      1,963 |      1,913 |
| Why Most Small Businesses Fail at Technical SEO (And How to Fix It)                                   | Warum die meisten kleinen Unternehmen an technischer SEO scheitern (und wie Sie das ändern) `drafts.6f0802c8-9046-46ba-b068-d6d7f68bcc78`            |       120 |      1,967 |      1,909 |
| **Total**                                                                                             | **10 posts**                                                                                                                                         | **2,019** | **21,910** | **22,112** |

### Publish order

Publish the German **blog categories** (from #70) before the posts. Until then, every post that has a category fails validation with "Referenced document must be published". That error is on the category reference, not in the post text.

### Checks done

- **Validation:** `sanity documents validate` with the local Studio schema shows no errors on the 10 drafts other than the category reference above. The two SEO titles over 60 characters were shortened.
- **Site, desktop and 375px mobile** (`next dev`, drafts): all 10 posts under `/de/blog/<slug>` render the German draft with `<html lang="de">` and no fallback notice. `/de/blog` lists the German titles.
- **Mobile width:** 6 of the 10 posts scroll sideways by 16px at 375px. The English originals do the same, because a bulleted or numbered list in the post body is as wide as the screen and is pushed in 16px. This is a layout bug, not a translation one, tracked in #98.

### For the proofreader

- **FAQ heading:** "Häufig gestellte Fragen" in every post. The English source has a stray "?" ("Frequently Asked Questions ?"), which the German drops.
- **Gaps in the English source**, filled in or kept as they are:
  - _From Keywords to Intent_: two sentences are missing a word ("mapping your content to these , you cover…", "content that addresses ."). The German completes them.
  - _From Keywords to Intent_: "Case Study 2: SaaS Company" ends without a result. It is translated as it stands.
  - _GEO vs Traditional SEO_: the heading "Traditional SEO vs GEO – The Core Differences" is followed by one sentence; a comparison table may be missing. "4. Leverage Multi-Platform" looks cut off.
  - _Voice Search 2.0_ and _Predictive Analytics_: the titles end in "— SERP research" / "-Growth Stats", which look like working labels. They are translated as they are.
- **Outdated facts** in _Why Most Small Businesses Fail at Technical SEO_, translated as written:
  - FID was replaced by INP as a Core Web Vital in 2024.
  - Google has retired the Mobile-Friendly Test and the Structured Data Markup Helper.
  - The Search Console "Coverage" report is now „Seitenindexierung“.
- **Source typos fixed in German:** "Chat GPT Search" → ChatGPT Search, "Page Speed Insights" → PageSpeed Insights, "SEMrush" → Semrush, "EEAT" → E-E-A-T, "same As" → sameAs, "How To schema" → HowTo-Schema.
- **Source typos left as written:**
  - "Site bulb", which should be Sitebulb.
  - Schema names written with spaces ("Blog Posting", "FAQ Page"); the real names are BlogPosting and FAQPage.
  - The Screaming Frog image alt "ScreamingFrogSEOSpider".
- **Missing spaces at bold or link edges:** the English has a few missing spaces at these edges, for example "Conversational AIrequire" and "SEOand". The German pieces add the space. Two GEO sentences use a hyphenated compound across a bold edge instead ("Generative-Engine-Optimization das **klassische SEO**-Modell", "Dialog-Antworten"). Check that they read well.
- **Terms:**
  - These stay in English: SEO terms German marketers use (Keyword, Backlink, Featured Snippet, SERP, CTR, Core Web Vitals, AI Overviews, Predictive Analytics, Conversational AI, Customer Journey, Lead Scoring, Duplicate Content).
  - Translated: AI → "KI", bounce rate → "Absprungrate", dwell time → "Verweildauer", search intent → "Suchintention", conversational queries → "dialogorientierte Anfragen", traditional SEO → "klassisches SEO".
  - Search Console steps use the German interface labels.
- **Prices and places** stay as in the source ("unter 50 $", "in Indien", "USA").

### Still English on `/de/blog`

- "Table of Contents" in every post, which is hard-coded (#97).
- Blog cards and search results link to `/blog/<slug>`, not `/de/blog/<slug>`. These are out of scope in #88 (`PostPreview`, `PostPreviewLarge`, `SearchForm`).

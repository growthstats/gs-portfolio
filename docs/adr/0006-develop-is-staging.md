# 0006 — `develop` is staging, on the `staging` dataset

Status: accepted (2026-11-08)

## Context

Until now every deployment read the Sanity `production` dataset (ADR 0004, item 7). So nothing that needed a dataset write could be tested end to end before a release: the translation metadata migration from epic #118, or publishing the German drafts from epic #61. Those writes would have reached the live site, which runs `main`'s older code.

The project already had a `staging` dataset, created in 2024 and unused since 2026-08-27.

## Decision

1. **The `develop` deployment reads the `staging` dataset.** Vercel has Preview variables scoped to the `develop` branch only: `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_DATASET` and `SANITY_STUDIO_DATASET` set to `staging`, and `NEXT_PUBLIC_ENABLED_LANGUAGES=en,de`. Branch-scoped variables override the shared Preview ones on that branch only.
2. **Everything else stays on `production`:** `main` (the live site), PR preview deployments, CI (`.github/workflows/ci.yml`) and local `.env` files.
3. **`staging` is a copy of `production`, refreshed by hand.** The Sanity plan has no `sanity dataset copy`, so a refresh is: export `staging` as a backup, delete it, `sanity dataset create staging --visibility public`, export `production`, and `sanity dataset import <file> staging --replace`. Refresh before rehearsing a release if `production` content has moved on. Backups live outside the repo.
4. **Content and data changes are rehearsed on `staging` first.** Migrations, backfills and bulk publishes run on `staging`, are checked on the `develop` deployment, and only then run on `production` with the user's OK. Writes to `staging` don't need the `production` precautions (checking `main`'s queries, `smoke-prod.sh`), but say what was changed.
5. **A local Studio can use `staging` too:** run `next dev` with the three dataset variables set to `staging` in the environment; they override `.env`.

## Consequences

- The `develop` Studio edits `staging`, not live content. Editors who want to change the live site use the production Studio.
- The release rehearsal of epics #118 and #61 was run this way on 2026-11-08 (comments on both issues).
- Content published on `staging` refreshes the `develop` site through the `[STAGING] Revalidate develop` Sanity webhook, without a redeploy. It fires on `staging` only and passes Vercel Authentication with a Protection Bypass for Automation secret in its URL. `[PROD] Revalidate page` fires on `production` only. Tested on 2026-11-09.
- The Sanity plan allows two webhooks, so `[STAGING]` is the old `[DEV] Revalidate page`, repurposed. `[DEV]` targeted `gs-portfolio-blond.vercel.app`, which redirects to the live site, so it only duplicated `[PROD]`.
- `scripts/agent/smoke-prod.sh <develop URL>` still can't get past Vercel Authentication; check `develop` in a signed-in browser.
- Item 7 of ADR 0004 and item 6 of ADR 0005 still apply to the `production` dataset, but `develop` no longer reads it.

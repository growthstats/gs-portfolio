# 0004 — CI and the agent workflow

Status: accepted (2026-10-31)

## Context

Vercel previews were the only check on PRs, and they use up the free plan's build quota. They are now off for every branch except `main` and `develop` (`vercel.json`, PR #59). `next.config.ts` ignores type and lint errors at build time, and `develop` has 4 type errors and 11 lint errors. So nothing currently fails a PR.

## Decision

1. **GitHub Actions CI** on every PR into `develop`: `npm ci`, lint, typecheck, unit tests, build. Actions minutes are free for this public repo. The build needs the `SANITY_API_READ_TOKEN` repository secret.
2. **The baseline is made green first.** The existing type and lint errors are fixed, `.claude/` is excluded from ESLint, and only then is CI made required. The 197-file Prettier reformat is deliberately skipped, because it would conflict with every open branch; lint-staged formats each file as it is touched.
3. **Unit tests with Vitest** for pure logic (language parsing, URL building, fallback selection, dictionary completeness). There is no browser e2e suite in CI.
4. **Browser checks run locally.** Agents run `npm run dev` on their own port (`PORT=30<issue number>`) and check their change in the in-app browser. The app has no auth, so this needs no setup.
5. **Agents merge to `develop`** once CI is green, with a merge commit and never `--auto`. Releases from `develop` to `main` stay manual.
6. **Personal GitHub account only:** `GH_TOKEN=$(gh auth token --user AtharvaCM)` on every `gh` write.

The per-issue steps live in `.claude/skills/work-issue/SKILL.md`.

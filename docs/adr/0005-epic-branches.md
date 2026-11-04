# 0005 — Epic branches

Status: accepted (2026-11-04)

## Context

Some work only makes sense once all of it is done. The clearest case is the dependency-upgrade epic (#118): Next 16, then Sanity 6, then what they unlock, spread over about 28 issues. Merging each piece into `develop` as it lands would leave `develop`, which Vercel deploys, half-upgraded for weeks. It would also tie every unrelated feature to whichever upgrade step happens to be in progress.

## Decision

1. **An epic gets its own branch**, `epic/<epic issue>-<slug>`, cut from `develop`. Each child issue says so in its body with a line `Base branch: epic/<...>`. The `work-issue` skill reads that line, branches from the epic, opens its PR against it, and merges it there through `scripts/agent/merge-pr.sh`. Issues without the line keep using `develop`.
2. **CI runs on every PR into an epic branch** and on every push to one (`.github/workflows/ci.yml` matches `epic/**`), with the same lint, typecheck, test and build steps as `develop`.
3. **Vercel doesn't deploy epic branches.** `vercel.json` still enables only `main` and `develop`. Work on an epic can't change what any deployed site serves until the epic reaches `develop`.
4. **The epic follows `develop` by merging, never rebasing.** Whoever starts a child issue merges `origin/develop` into their branch when the epic is behind, so conflicts surface one PR at a time and not all at the end. The epic branch is never force-pushed.
5. **A human merges the epic into `develop`.** `merge-pr.sh` refuses a PR whose head is an `epic/*` branch. Before that PR is merged:
   - Every child issue is closed or explicitly moved out of the epic.
   - The epic PR's CI is green against current `develop`.
   - Someone has gone through the epic's verification list on a local production build: pages in each enabled language, the Studio, draft mode, RSS, `llms.txt`, the sitemap and redirects.
6. **Production is protected the same way as before.** `main` only changes through a manual release from `develop`. The `production` dataset is shared by every branch, so the dataset rules in ADR 0004 apply to epic work unchanged: no publishing, no schema deploys and no asset changes from a child issue unless it says so, and drafts only on throwaway pages, discarded afterwards. After the epic reaches `develop`, the release to `main` happens only once the `develop` deployment has been checked and `scripts/agent/smoke-prod.sh <develop deployment URL>` passes. After the release, `scripts/agent/smoke-prod.sh` (production) has to pass too.

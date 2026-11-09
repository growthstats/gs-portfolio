---
name: work-issue
description: Take one gs-portfolio GitHub issue from ready-for-agent to merged into develop (or into its epic branch). Checks blockers, claims it, implements in its own worktree, simplifies, reviews, opens the PR, fixes CI, checks the change in a local browser, merges, and logs the session and its duration in the vault. Use when the user says "/work-issue <n>" or "work on issue <n>".
---

# Work an issue

Input: one issue number in `growthstats/gs-portfolio`. Do every step in order. Stop and report instead of guessing whenever a step below says **Stop**.

Every `gh` call that writes (claim, comment, label, PR, merge) uses the personal account:

```bash
GH_TOKEN=$(gh auth token --user AtharvaCM) gh <command>
```

Never run `gh auth switch`, and never use the work account.

## 1. Read and check

1. `gh issue view <n> --comments --json title,body,labels,state,comments`.
2. **Stop** if it isn't labelled `ready-for-agent`, or is already `in-progress`.
3. For each `Blocked by #m` line in the body, check `gh issue view <m> --json state`. **Stop** if any blocker is still open, and name it.
4. Find the **base branch**: the `Base branch: <name>` line in the body, or `develop` if there is none. **Stop** if it names anything other than `develop` or an `epic/*` branch, or if `git ls-remote --exit-code --heads origin <base>` finds no such branch. Every later step that says "the base branch" means this one.
5. Read `CONTEXT.md` and every ADR the issue links from `docs/adr/`. Use the glossary's terms in code, commits and the PR. For an epic branch, also read [ADR 0005](../../../docs/adr/0005-epic-branches.md).

## 2. Claim

1. Record the start time: `date -u +%Y-%m-%dT%H:%M:%SZ`.
2. Swap the label from `ready-for-agent` to `in-progress`, and comment `Started <start time> by an agent.`

## 3. Set up a worktree

1. If this session isn't already in its own worktree, create one from `origin/<base branch>` on branch `<type>/<n>-<short-slug>` (`feat`, `fix` or `chore`). If the session is already in a worktree, make sure the branch starts from `origin/<base branch>`.
   - **Epic base:** if `git rev-list --count origin/<base branch>..origin/develop` isn't 0, merge `origin/develop` into your branch first (`git merge --no-ff origin/develop`, never rebase), resolve any conflicts, and say so in the PR. That keeps the epic close to `develop` (ADR 0005).
2. Link the env file: `ln -s /Users/atharvacm/technowizard/gs-portfolio/.env .env`. Never print its contents, and never commit it.
3. `npm ci`.
4. Write `.claude/launch.json` with one `dev` configuration: `npm run dev -- -p <port>`, where the port is `3000 + <n>`. Every parallel agent gets its own port.

## 4. Implement

1. Work through the issue's acceptance criteria one by one.
2. Only touch the files and areas the issue's **Scope** section allows. If you need a file listed under **Do not touch**, or a change outside the issue: **Stop** and comment on the issue saying what's needed and why.
3. Add or update Vitest tests for any pure logic you write.
4. Commit in small logical steps (Conventional Commits). No attribution trailers.
5. **Writes to the Sanity `production` dataset reach the live site.** It runs `main`'s code, which is older than `develop`'s, against the same dataset. Local `.env`, CI and PR previews read `production` too; only the `develop` deployment reads `staging` (ADR 0006), so rehearse data changes there first. A backfill, a script run, new references or new drafts all count as writes, even when nothing is published. Before writing:
   - Find the queries on `main` that read the types you're changing (`git grep <type> origin/main -- src`) and check they cope with the new data. Unpublished drafts resolve to `null` through references in the published perspective.
   - Get the user's OK, after a `--dry-run` where the tool has one.

   After writing, run `scripts/agent/smoke-prod.sh`. If it fails, undo the write, then **Stop**. See `docs/incidents/2026-11-01-production-500.md`.

## 5. Check locally

Run `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`. All four must pass. Build with Node 24 (`.nvmrc`); on Node 26 `sanity manifest extract` fails during the build.

## 6. Simplify and review

1. Run the `simplify` skill on the branch's changes and apply its fixes.
2. Run the `code-review` skill (medium) on the branch, and fix every confirmed finding.
3. Re-run step 5.

## 7. Browser check

If the change can be seen in the site or Studio:

1. Start the dev server with `preview_start` using your `dev` configuration.
2. Walk through the issue's **How to verify** list in the browser, in each enabled language it mentions, at desktop and mobile widths.
3. Check the console and server logs for errors.
4. Take a screenshot as proof.
5. Stop the server when done.

Do not rely on a Vercel preview; previews are off for feature branches.

**Studio (`/admin`) checks** need a Sanity login, which the built-in browser doesn't have and agents must not create:

- Use Claude in Chrome: `list_connected_browsers`, then `select_browser` on the profile that is signed in to Sanity. The "Browser 1"/"Browser 2" labels change between connections, so don't go by the name: if only one browser is connected, use it; if several are, open `/admin` in each and use the one that shows the Studio rather than a login screen.
- Run the dev server on port 3000 for these checks, not your issue port. Sanity's CORS list only allows `localhost:3000`. Only one agent can use port 3000 at a time, so stop the server as soon as the Studio check is done.

## 8. Pull request

1. Push the branch and open a PR into the base branch (`gh pr create --base <base branch>`):
   - Title in Conventional Commit form.
   - Body: what changed and why, `Closes #<n>`, and the verification you did. No attribution lines.
2. Bind it with the ccd_pr tools (`get_status`, then `bind_pr` if needed).

## 9. Fix CI

1. Wait for the GitHub Actions run on the PR's latest commit. Read its result from `get_status` or `gh pr checks <pr>`; don't poll in a tight loop.
2. On failure, read the log, fix the cause, push, and repeat.
3. **Stop** if the same failure comes back after two fixes, or if the failure is environmental (a missing secret, a GitHub outage) rather than in the code.

## 10. Merge

1. Once every check is green and the PR is mergeable, merge with `scripts/agent/merge-pr.sh <pr>`.
   - Run it exactly like that, as its own Bash call: no `GH_TOKEN=` prefix (the script sets it), no `bash` in front, no pipe, no `&&` or `;`. The permission rule only matches that exact shape; anything else is blocked as a merge without review.
   - It is the only merge command allowed without a prompt. It refuses a PR that doesn't target `develop` or an `epic/*` branch, merges an epic branch itself, isn't mergeable or has a check that isn't green, and merges only the commit the checks ran on.
   - Don't call `gh pr merge` yourself, and never pass `--auto`; in this repo it merges instantly.
   - Never merge into `main`, and never merge an epic branch into `develop`. Both are done by a human.
2. Close the issue by hand with a comment linking the PR. Closing keywords only fire on merges into `main`, so a merge into `develop` or an epic branch never closes it.
3. If the issue belongs to an epic, tick its box in the epic issue's checklist (`gh issue edit <epic> --body-file ...`, after re-reading the body).

## 11. Log

1. Run `node scripts/agent/active-time.mjs --since <start time from step 2>`. It reads this session's transcript and prints the active time (hours spent waiting for a human don't count) and the wall-clock time.
2. Run the `log-work` skill for this session. The entry must include the issue and PR links and a line `Time: <active> active, <wall> wall-clock (<start> → <end> UTC)`.
3. Comment the same `Time:` line on the issue.
4. Clean up: stop the dev server and leave the worktree for the app to archive.

## Stop and report

When stopping, comment on the issue with what's done, what's blocking and what's needed. Swap the label to `ready-for-human`, then end the session with the same summary.

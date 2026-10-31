---
name: work-issue
description: Take one gs-portfolio GitHub issue from ready-for-agent to merged into develop. Checks blockers, claims it, implements in its own worktree, simplifies, reviews, opens the PR, fixes CI, checks the change in a local browser, merges, and logs the session and its duration in the vault. Use when the user says "/work-issue <n>" or "work on issue <n>".
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
4. Read `CONTEXT.md` and every ADR the issue links from `docs/adr/`. Use the glossary's terms in code, commits and the PR.

## 2. Claim

1. Record the start time: `date -u +%Y-%m-%dT%H:%M:%SZ`.
2. Swap the label from `ready-for-agent` to `in-progress`, and comment `Started <start time> by an agent.`

## 3. Set up a worktree

1. If this session isn't already in its own worktree, create one from `origin/develop` on branch `<type>/<n>-<short-slug>` (`feat`, `fix` or `chore`).
2. Link the env file: `ln -s /Users/atharvacm/technowizard/gs-portfolio/.env .env`. Never print its contents, and never commit it.
3. `npm ci`.
4. Write `.claude/launch.json` with one `dev` configuration: `npm run dev -- -p <port>`, where the port is `3000 + <n>`. Every parallel agent gets its own port.

## 4. Implement

1. Work through the issue's acceptance criteria one by one.
2. Only touch the files and areas the issue's **Scope** section allows. If you need a file listed under **Do not touch**, or a change outside the issue: **Stop** and comment on the issue saying what's needed and why.
3. Add or update Vitest tests for any pure logic you write.
4. Commit in small logical steps (Conventional Commits). No attribution trailers.

## 5. Check locally

Run `npm run lint`, `npm run typecheck`, `npm test` and `npm run build`. All four must pass.

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

## 8. Pull request

1. Push the branch and open a PR into `develop`:
   - Title in Conventional Commit form.
   - Body: what changed and why, `Closes #<n>`, and the verification you did. No attribution lines.
2. Bind it with the ccd_pr tools (`get_status`, then `bind_pr` if needed).

## 9. Fix CI

1. Wait for the GitHub Actions run on the PR's latest commit. Read its result from `get_status` or `gh pr checks <pr>`; don't poll in a tight loop.
2. On failure, read the log, fix the cause, push, and repeat.
3. **Stop** if the same failure comes back after two fixes, or if the failure is environmental (a missing secret, a GitHub outage) rather than in the code.

## 10. Merge

1. Once every check is green and the PR is mergeable, merge with `gh pr merge <pr> --merge`.
   - Never pass `--auto`; in this repo it merges instantly.
   - Never merge into `main`. Releases are done by a human.
2. Confirm the issue closed. If it didn't, close it with a comment linking the PR.

## 11. Log

1. Record the end time and work out the duration from the start time recorded in step 2.
2. Run the `log-work` skill for this session. The entry must include the issue and PR links and a line `Time: <duration> (<start> → <end> UTC)`.
3. Comment the duration on the issue.
4. Clean up: stop the dev server and leave the worktree for the app to archive.

## Stop and report

When stopping, comment on the issue with what's done, what's blocking and what's needed. Swap the label to `ready-for-human`, then end the session with the same summary.

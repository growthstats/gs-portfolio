#!/usr/bin/env bash
# Merges an agent's PR into develop with the personal GitHub account.
# Refuses anything other than an open, mergeable PR into develop whose checks
# are all green, and merges only the commit those checks ran on. Agents are
# allowed to run this script without a prompt (.claude/settings.json); they
# are not allowed to run `gh pr merge` directly.
set -euo pipefail

repo=growthstats/gs-portfolio
pr=${1:?usage: scripts/agent/merge-pr.sh <pr-number>}
[[ $pr =~ ^[0-9]+$ ]] || { echo "PR must be a number, got '$pr'" >&2; exit 2; }

GH_TOKEN=$(gh auth token --user AtharvaCM)
export GH_TOKEN

# GitHub works out mergeability lazily and answers UNKNOWN right after the
# base branch moves, so ask a few times before giving up.
for attempt in 1 2 3 4 5 6; do
  read -r base state mergeable sha < <(gh pr view "$pr" --repo "$repo" \
    --json baseRefName,state,mergeable,headRefOid \
    -q '"\(.baseRefName) \(.state) \(.mergeable) \(.headRefOid)"')
  [[ $mergeable == UNKNOWN ]] || break
  sleep 5
done

[[ $base == develop ]] || { echo "PR #$pr targets '$base', not develop" >&2; exit 1; }
[[ $state == OPEN ]] || { echo "PR #$pr is $state" >&2; exit 1; }
[[ $mergeable == MERGEABLE ]] || { echo "PR #$pr is not mergeable ($mergeable)" >&2; exit 1; }

# Exits non-zero when any check is failing, pending or missing.
if ! gh pr checks "$pr" --repo "$repo"; then
  echo "PR #$pr checks are not all green" >&2
  exit 1
fi

gh pr merge "$pr" --repo "$repo" --merge --match-head-commit "$sha"

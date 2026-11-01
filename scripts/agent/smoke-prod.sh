#!/usr/bin/env bash
# Checks that the live site answers. Run it after any write to the production
# Sanity dataset: `main`'s code reads that dataset too, and content made for
# `develop` can break it (docs/incidents/2026-11-01-production-500.md). The
# uptime workflow runs it on a schedule.
set -uo pipefail

base=${1:-https://www.growthstats.io}
paths=(/ /about /services /blog /contact)
failed=0

for path in "${paths[@]}"; do
  status=$(curl -sL -o /dev/null -w '%{http_code}' --max-time 20 "$base$path")
  if [[ $status == 200 ]]; then
    echo "ok   $status $path"
  else
    echo "FAIL $status $path"
    failed=1
  fi
done

exit $failed

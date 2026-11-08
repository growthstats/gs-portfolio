'use client'

import { useSyncExternalStore } from 'react'

export function isActiveAt(now: Date, start?: string | null, end?: string | null) {
  return (!start || new Date(start) < now) && (!end || new Date(end) > now)
}

const noSubscription = () => () => {}

// Re-checks every second, so a changed start or end (live editing) also applies within a second.
function subscribeToClock(onChange: () => void) {
  const interval = setInterval(onChange, 1000)
  return () => clearInterval(interval)
}

export default function Scheduler({
  start,
  end,
  children,
}: Partial<{
  start: string | null
  end: string | null
  children: React.ReactNode
}>) {
  const hasSchedule = !!(start || end)

  const isActive = useSyncExternalStore(
    hasSchedule ? subscribeToClock : noSubscription,
    () => isActiveAt(new Date(), start, end),
    // The prerendered page outlives any time it could check, so scheduled content appears on the client.
    () => !hasSchedule,
  )

  return isActive ? children : null
}

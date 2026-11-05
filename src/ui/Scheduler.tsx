'use client'

import { useEffect, useState } from 'react'

export function isActiveAt(now: Date, start?: string, end?: string) {
  return (!start || new Date(start) < now) && (!end || new Date(end) > now)
}

export default function Scheduler({
  start,
  end,
  children,
}: Partial<{
  start: string
  end: string
  children: React.ReactNode
}>) {
  const [isActive, setIsActive] = useState(() => isActiveAt(new Date(), start, end))

  // Re-checks every second, so a changed start or end (live editing) also applies within a second.
  useEffect(() => {
    if (!start && !end) return

    const interval = setInterval(() => setIsActive(isActiveAt(new Date(), start, end)), 1000)
    return () => clearInterval(interval)
  }, [start, end])

  // Without a schedule it's always active, even if a schedule was just removed.
  if ((start || end) && !isActive) return null

  return children
}

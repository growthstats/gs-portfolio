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

  useEffect(() => {
    setIsActive(isActiveAt(new Date(), start, end))
    if (!start && !end) return

    const interval = setInterval(() => setIsActive(isActiveAt(new Date(), start, end)), 1000) // check every second
    return () => clearInterval(interval)
  }, [start, end])

  if (!isActive) return null

  return children
}

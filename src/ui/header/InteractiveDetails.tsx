'use client'

import { useState, type ComponentProps } from 'react'
import { useMatchMedia } from '@/lib/useMatchMedia'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import css from './InteractiveDetails.module.css'

/**
 * @param safeAreaOnHover - Adds a safe area around the details element to prevent it from closing when the mouse leaves the element
 * @param closeAfterNavigate - Closes the details element after a navigation event
 */
export default function InteractiveDetails({
  safeAreaOnHover,
  closeAfterNavigate,
  delay,
  className,
  ...props
}: {
  safeAreaOnHover?: boolean
  closeAfterNavigate?: boolean
  delay?: number
} & ComponentProps<'details'>) {
  const [open, setOpen] = useState(false)
  let timeout: NodeJS.Timeout

  // Open on hover only with a mouse or trackpad; touch screens toggle on tap instead.
  const canHover = useMatchMedia('(hover: hover) and (pointer: fine)')

  const events = canHover
    ? {
        onMouseEnter: () => {
          if (delay) {
            timeout = setTimeout(() => setOpen(true), delay)
          } else {
            setOpen(true)
          }
        },
        onMouseLeave: () => {
          if (delay) clearTimeout(timeout)
          setOpen(false)
        },
      }
    : {}

  // Close after navigation. Compared during render rather than in an effect, so the
  // closed state shows on the same render as the new page.
  const pathname = usePathname()
  const [lastPathname, setLastPathname] = useState(pathname)
  if (pathname !== lastPathname) {
    setLastPathname(pathname)
    if (closeAfterNavigate) setOpen(false)
  }

  return (
    <details
      className={cn(safeAreaOnHover && css.safearea, className)}
      open={open}
      key={String(open)}
      {...events}
      {...props}
    />
  )
}

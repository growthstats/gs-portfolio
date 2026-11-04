'use client'

import { ComponentProps, useEffect, useRef } from 'react'
import moduleProps from '@/lib/moduleProps'

/**
 * Renders code that contains a `<script>`. Scripts in `innerHTML` never run, so the code is
 * appended as a parsed fragment after mount, and replaced whenever it changes.
 */
export default function WithScript({
  code,
  className,
  ...props
}: Sanity.CustomHTML['html'] & Sanity.Module & ComponentProps<'section'>) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = ref.current
    if (!section) return

    section.appendChild(document.createRange().createContextualFragment(code))
    return () => section.replaceChildren()
  }, [code])

  return <section ref={ref} className={className} {...moduleProps(props)} />
}

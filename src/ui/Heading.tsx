import { cn } from '@/lib/utils'

import type { ReactNode } from 'react'

const VARIANT_STYLES = {
  'display-hero': 'text-display-hero leading-display-hero tracking-display-hero font-bold',
  'display-xl': 'text-display-xl leading-display-xl tracking-display-xl font-semibold',
  h1: 'text-h1 leading-h1 tracking-h1 font-semibold',
  h2: 'text-h2 leading-h2 font-semibold',
  h3: 'text-h3 leading-h3 font-semibold',
  h4: 'text-h4 leading-h4 font-semibold',
  h5: 'text-h5 leading-h5 font-semibold',
  h6: 'text-h6 leading-h6 font-semibold',
} as const

type Variant = keyof typeof VARIANT_STYLES
type As = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'div'

export type HeadingProps = {
  as?: As
  variant?: Variant
  className?: string
  children: ReactNode
  balance?: boolean
}

export default function Heading({
  as: Tag = 'h2',
  variant = 'h2',
  className,
  children,
  balance,
}: Readonly<HeadingProps>) {
  const shouldBalance = balance ?? ['display-hero', 'display-xl'].includes(variant)

  const classes = cn(VARIANT_STYLES[variant], shouldBalance && 'text-balance', className)

  return <Tag className={classes}>{children}</Tag>
}

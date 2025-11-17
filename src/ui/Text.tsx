import { cn } from '@/lib/utils'

import type { ReactNode } from 'react'

const VARIANT_STYLES = {
  'body-lg': 'text-body-lg leading-body-lg',
  body: 'text-body leading-body',
  'body-sm': 'text-body-sm leading-body-sm',
  'body-xs': 'text-body-xs leading-body-xs',
  subtitle: 'subtitle',
  eyebrow: 'eyebrow',
  badge: 'section-badge',
  technical: 'technical text-body-xs leading-body-xs',
} as const

type Variant = keyof typeof VARIANT_STYLES
type As = 'p' | 'span' | 'div' | 'label' | 'small' | 'strong' | 'em' | 'figcaption'

export type TextProps = {
  as?: As
  variant?: Variant
  className?: string
  children: ReactNode
  muted?: boolean
  balance?: boolean
}

export default function Text({
  as: Tag = 'p',
  variant = 'body',
  className,
  children,
  muted,
  balance,
}: Readonly<TextProps>) {
  const classes = cn(
    VARIANT_STYLES[variant],
    balance && 'text-balance',
    muted && 'text-ink/70',
    className,
  )

  return <Tag className={classes}>{children}</Tag>
}

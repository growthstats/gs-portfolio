import Link from 'next/link'
import resolveUrl from '@/lib/resolveUrl'
import { stegaClean } from 'next-sanity'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import type { ComponentProps } from 'react'
import type { VariantProps } from 'class-variance-authority'

const allowedVariants = new Set<VariantProps<typeof buttonVariants>['variant']>([
  'default',
  'ghost',
  'link',
  'outline',
  'secondary',
  'destructive',
])

// Non-descriptive anchor phrases flagged by SEO/a11y audits.
const GENERIC_LINK_TEXT = new Set([
  'see more',
  'read more',
  'learn more',
  'more',
  'click here',
  'here',
  'see all',
  'view all',
  'view more',
  'details',
  'this link',
])

export default function CTA({
  link,
  style: ctaStyle,
  className,
  children,
  ...rest
}: Sanity.CTA & Omit<ComponentProps<'a'>, 'style'>) {
  const cleanedStyle =
    typeof ctaStyle === 'string' ? (stegaClean(ctaStyle) ?? undefined) : undefined
  const variant =
    cleanedStyle &&
    allowedVariants.has(cleanedStyle as VariantProps<typeof buttonVariants>['variant'])
      ? (cleanedStyle as VariantProps<typeof buttonVariants>['variant'])
      : undefined
  const buttonClassName = cn(className) || undefined
  const content = children || link?.label || link?.internal?.title || link?.external
  const buttonProps = {
    variant: variant ?? 'default',
    className: buttonClassName,
  }

  // SEO/a11y: generic anchor text ("See more", "Read more"…) fails Lighthouse's
  // descriptive-link-text audit. When the visible label is generic, derive a
  // descriptive accessible name from the link's destination.
  const label = stegaClean(link?.label)
  const destTitle = stegaClean(link?.internal?.title)
  const isGenericLabel = !!label && GENERIC_LINK_TEXT.has(label.trim().toLowerCase())
  const ariaLabel =
    (rest as ComponentProps<'a'>)['aria-label'] ??
    (isGenericLabel && destTitle ? `${label}: ${destTitle}` : undefined)
  if (ariaLabel) (rest as ComponentProps<'a'>)['aria-label'] = ariaLabel

  if (link?.type === 'internal' && link.internal)
    return (
      <Button asChild {...buttonProps}>
        <Link
          href={resolveUrl(link.internal, {
            base: false,
            params: link.params,
          })}
          {...rest}
        >
          {content}
        </Link>
      </Button>
    )

  if (link?.type === 'external' && link.external)
    return (
      <Button asChild {...buttonProps}>
        <a href={stegaClean(link.external)} {...rest}>
          {content}
        </a>
      </Button>
    )

  return (
    <Button {...buttonProps} {...(rest as unknown as ComponentProps<'button'>)}>
      {content}
    </Button>
  )
}

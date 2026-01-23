import { cn, slug } from '@/lib/utils'
import Heading from '@/ui/Heading'
import type { ComponentProps } from 'react'
import type { PortableTextBlock, PortableTextComponentProps } from 'next-sanity'

export default function AnchoredHeading({
  as: Tag,
  variant,
  className,
  children,
  value,
}: {
  as: ComponentProps<typeof Heading>['as']
  variant?: ComponentProps<typeof Heading>['variant']
  className?: string
} & PortableTextComponentProps<PortableTextBlock>) {
  const id = slug(value.children.reduce((acc, { text }) => acc + text, ''))
  const resolvedVariant =
    variant ??
    (typeof Tag === 'string' ? (Tag as ComponentProps<typeof Heading>['variant']) : undefined)

  return (
    <Heading as={Tag} variant={resolvedVariant} id={id} className={cn('group', className)}>
      {children}

      <a
        className="anim-fade-to-r ms-2 no-underline! group-target:inline-block md:hidden md:group-hover:inline-block"
        href={`#${id}`}
      >
        <span className="text-ink/25 inline-block">¶</span>
      </a>
    </Heading>
  )
}

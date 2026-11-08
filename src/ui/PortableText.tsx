import { PortableText as SanityPortableText } from 'next-sanity'
import type { TypedObject } from '@portabletext/types'
import type {
  PortableTextBlock,
  PortableTextComponentProps,
  PortableTextComponents,
} from 'next-sanity'
import type { ComponentProps } from 'react'
import Heading from '@/ui/Heading'
import { HEADING_STYLE_MAP, type HeadingStyle } from '@/ui/portableTextHeading'

type BlockProps = PortableTextComponentProps<PortableTextBlock>
type BlockComponent = (props: BlockProps) => React.JSX.Element

const headingBlockComponents = Object.fromEntries(
  Object.entries(HEADING_STYLE_MAP).map(([style, config]) => [
    style,
    ({ children }: BlockProps) => (
      <Heading as={config.as} variant={config.variant}>
        {children}
      </Heading>
    ),
  ]),
) as Record<HeadingStyle, BlockComponent>

function mergeComponents(components?: PortableTextComponents): PortableTextComponents {
  if (!components) return { block: headingBlockComponents as PortableTextComponents['block'] }

  if (!components.block)
    return { ...components, block: headingBlockComponents as PortableTextComponents['block'] }

  if (typeof components.block === 'function') {
    return components
  }

  return {
    ...components,
    block: {
      ...(headingBlockComponents as Record<string, BlockComponent>),
      ...components.block,
    },
  }
}

type PortableTextProps = ComponentProps<typeof SanityPortableText>

/**
 * Portable Text as a module field holds it. TypeGen types block `children` as optional, which
 * `PortableTextBlock` doesn't allow, so modules pass it on as typed objects.
 */
export type PortableTextValue = TypedObject[]

export default function PortableText({ components, ...props }: Readonly<PortableTextProps>) {
  return <SanityPortableText {...props} components={mergeComponents(components)} />
}

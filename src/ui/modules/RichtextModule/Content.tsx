import PortableText from '@/ui/PortableText'
import AnchoredHeading from './AnchoredHeading'
import { cn } from '@/lib/utils'
import { HEADING_STYLE_MAP } from '@/ui/portableTextHeading'
import type {
  PortableTextBlock,
  PortableTextComponentProps,
  PortableTextComponents,
} from 'next-sanity'

import Image from './Image'
import Code from './Code'
import Admonition from './Admonition'
import CustomHTML from '@/ui/modules/CustomHTML'

type BlockProps = PortableTextComponentProps<PortableTextBlock>
type BlockComponent = (props: BlockProps) => JSX.Element

const anchoredHeadingBlocks = Object.fromEntries(
  Object.entries(HEADING_STYLE_MAP).map(([style, config]) => [
    style,
    (node: BlockProps) => <AnchoredHeading as={config.as} variant={config.variant} {...node} />,
  ]),
) as Record<string, BlockComponent>

export default function Content({
  value,
  className,
  children,
}: { value: Sanity.PortableText } & React.ComponentProps<'div'>) {
  return (
    <div className={cn('richtext mx-auto w-full [&>:first-child]:!mt-0', className)}>
      <PortableText
        value={value}
        components={{
          block: anchoredHeadingBlocks as PortableTextComponents['block'],
          types: {
            image: Image,
            admonition: Admonition,
            code: Code,
            'custom-html': ({ value }) => (
              <CustomHTML
                className="has-[table]:md:[grid-column:bleed] has-[table]:md:mx-auto"
                {...value}
              />
            ),
          },
        }}
      />

      {children}
    </div>
  )
}

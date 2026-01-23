import type { HeadingProps } from '@/ui/Heading'

export type HeadingVariant = HeadingProps['variant']
export type HeadingTag = HeadingProps['as']

export const HEADING_STYLE_MAP = {
  'display-hero': { as: 'h1', variant: 'display-hero' },
  'display-xxl': { as: 'h2', variant: 'display-xxl' },
  'display-xl': { as: 'h3', variant: 'display-xl' },
  h1: { as: 'h1', variant: 'h1' },
  h2: { as: 'h2', variant: 'h2' },
  h3: { as: 'h3', variant: 'h3' },
  h4: { as: 'h4', variant: 'h4' },
  h5: { as: 'h5', variant: 'h5' },
  h6: { as: 'h6', variant: 'h6' },
} as const satisfies Record<string, { as: HeadingTag; variant: HeadingVariant }>

export type HeadingStyle = keyof typeof HEADING_STYLE_MAP

export function getHeadingConfig(style?: string) {
  if (!style) return null
  return HEADING_STYLE_MAP[style as HeadingStyle] ?? null
}

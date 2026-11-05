'use client'

import type { PortableTextPluginsProps } from 'sanity'

/** Turns on the Studio's native table editing for rich text fields that allow a `table`. */
export default function PortableTextPlugins(props: PortableTextPluginsProps) {
  return props.renderDefault({
    ...props,
    plugins: { ...props.plugins, table: { enabled: true } },
  })
}

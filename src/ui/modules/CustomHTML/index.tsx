import moduleProps from '@/lib/moduleProps'
import CSS from './CSS'
import WithScript from './WithScript'
import { stegaClean } from 'next-sanity'
import type { ComponentProps } from 'react'
import type { CustomHtml } from '@/sanity/sanity.types'

export default function CustomHTML({
  className,
  html,
  css,
  ...props
}: Omit<CustomHtml, '_type' | 'className'> & {
  _type?: string
  _key?: string
} & ComponentProps<'section'>) {
  if ((!html?.code && !css?.code) || props?.options?.hidden) return null

  return (
    <>
      <CSS code={stegaClean(css?.code)} />

      {html?.code &&
        (html.code.includes('<script') ? (
          <WithScript code={stegaClean(html.code)} className={stegaClean(className)} {...props} />
        ) : (
          <section
            className={stegaClean(className)}
            dangerouslySetInnerHTML={{ __html: stegaClean(html.code) }}
            {...moduleProps(props)}
          />
        ))}
    </>
  )
}

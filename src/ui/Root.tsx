'use client'

import useLang from '@/lib/useLang'
import type { ComponentProps } from 'react'

export default function Root(props: ComponentProps<'html'>) {
  const lang = useLang()

  return <html lang={lang} {...props} />
}

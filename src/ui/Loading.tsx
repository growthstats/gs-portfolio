'use client'

import { VscLoading } from 'react-icons/vsc'
import { cn } from '@/lib/utils'
import { useDictionary } from '@/i18n/DictionaryProvider'
import type { ComponentProps } from 'react'

export default function Loading({ className, children }: ComponentProps<'div'>) {
  const { common } = useDictionary()

  return (
    <aside className={cn('flex items-center gap-2', className)}>
      <VscLoading className="animate-spin" />
      {children || common.loading}
    </aside>
  )
}

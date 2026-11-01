'use client'

import { useDictionary, useLang } from '@/i18n/DictionaryProvider'
import { plural } from '@/i18n/format'

export default function ReadTime({
  value,
  ...props
}: { value: number } & React.ComponentProps<'span'>) {
  const lang = useLang()
  const { blog } = useDictionary()

  return <span {...props}>{plural(lang, Math.ceil(value), blog.readTime)}</span>
}

'use client'

import { useLang } from '@/i18n/DictionaryProvider'

export default function FormattedDate({ value }: { value?: string }) {
  const lang = useLang()
  if (!value) return null

  const formatted = new Intl.DateTimeFormat(lang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(value + 'T00:00:00'))

  return <time dateTime={value}>{formatted}</time>
}

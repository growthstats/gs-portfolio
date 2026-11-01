'use client'

import { useLang } from '@/i18n/DictionaryProvider'
import type { Lang } from '@/lib/i18n'

const formatters = new Map<Lang, Intl.DateTimeFormat>()

function getFormatter(lang: Lang) {
  if (!formatters.has(lang)) {
    formatters.set(
      lang,
      new Intl.DateTimeFormat(lang, { year: 'numeric', month: 'short', day: 'numeric' }),
    )
  }
  return formatters.get(lang)!
}

export default function FormattedDate({ value }: { value?: string }) {
  const lang = useLang()
  if (!value) return null

  const formatted = getFormatter(lang).format(new Date(value + 'T00:00:00'))

  return <time dateTime={value}>{formatted}</time>
}

'use client'

import { useDictionary } from '@/i18n/DictionaryProvider'

export default function SkipToContent() {
  const { common } = useDictionary()

  return (
    <a
      href="#main-content"
      className="bg-canvas text-ink absolute top-0 left-0 z-20 not-focus:sr-only"
      tabIndex={0}
    >
      {common.skipToContent}
    </a>
  )
}

'use client'

import { useState } from 'react'
import { VscClose } from 'react-icons/vsc'
import { Button } from '@/components/ui/button'
import { useDictionary } from '@/i18n/DictionaryProvider'

/** Tells visitors a page is shown in English because it has no translation yet (ADR 0002 fallback). */
export default function FallbackNotice() {
  const { fallbackNotice } = useDictionary()
  const [open, setOpen] = useState(true)

  if (!open) return null

  return (
    <aside className="border-ink/10 bg-canvas flex items-center justify-center gap-2 border-b px-4 py-2 text-center text-sm">
      <p>{fallbackNotice.message}</p>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setOpen(false)}
        aria-label={fallbackNotice.dismiss}
      >
        <VscClose aria-hidden="true" />
      </Button>
    </aside>
  )
}

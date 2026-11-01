'use client'

import Link from 'next/link'
import { localizeHref } from '@/lib/i18n'
import { useLang } from '@/i18n/DictionaryProvider'
import type { ComponentProps } from 'react'

/**
 * A `next/link` to an English href, localized to the page language (ADR 0002 §2).
 * Server components without `lang` (modules, CTA) can use it; the language comes from `DictionaryProvider`.
 */
export default function LocalizedLink({
  href,
  ...props
}: Omit<ComponentProps<typeof Link>, 'href'> & { href: string }) {
  return <Link href={localizeHref(href, useLang())} {...props} />
}

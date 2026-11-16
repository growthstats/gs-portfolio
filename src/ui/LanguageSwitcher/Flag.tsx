import type { ReactNode } from 'react'
import type { Lang } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/**
 * Inline SVG flags, one per supported language. Inline rather than emoji because
 * Windows renders flag emoji as two letters. Typed by `Lang`, so adding a language
 * without a flag fails the type check.
 */
const FLAGS: Record<Lang, ReactNode> = {
  // United Kingdom. No clip paths, so repeated flags on a page need no unique ids;
  // the counterchanged red saltire is drawn centred, which is invisible at this size.
  en: (
    <>
      <path d="M0 0h60v30H0z" fill="#012169" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
      <path d="M0 0l60 30m0-30L0 30" stroke="#C8102E" strokeWidth="2" />
      <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
    </>
  ),
  // Germany
  de: (
    <>
      <path d="M0 0h60v10H0z" fill="#000" />
      <path d="M0 10h60v10H0z" fill="#DD0000" />
      <path d="M0 20h60v10H0z" fill="#FFCE00" />
    </>
  ),
}

export default function Flag({ lang, className }: { lang: Lang; className?: string }) {
  return (
    <svg
      className={cn('h-3.5 w-5 shrink-0 rounded-[2px] ring-1 ring-ink/10', className)}
      viewBox="0 0 60 30"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      {FLAGS[lang]}
    </svg>
  )
}

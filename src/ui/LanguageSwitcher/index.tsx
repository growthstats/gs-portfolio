'use client'

import { usePathname } from 'next/navigation'
import { useDictionary, useLang } from '@/i18n/DictionaryProvider'
import { enabledLanguages } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import { languageLinks } from './languageLinks'

/**
 * Links to the current page in every enabled language; hidden while only one is enabled.
 * Plain `<a>` tags, so switching works without JS and reloads `<html lang>`.
 */
export default function LanguageSwitcher({ className }: { className?: string }) {
  const pathname = usePathname()
  const current = useLang()
  const { languageSwitcher } = useDictionary()

  if (enabledLanguages.length < 2) return null

  return (
    <ul
      className={cn('flex items-center gap-1 text-sm', className)}
      aria-label={languageSwitcher.label}
    >
      {languageLinks(pathname, enabledLanguages).map(({ lang, title, href }) => {
        const active = lang === current

        return (
          <li key={lang}>
            <a
              className={cn(
                'block rounded-sm px-2 py-1 uppercase',
                active ? 'font-semibold' : 'opacity-70 hover:opacity-100',
              )}
              href={href}
              hrefLang={lang}
              lang={lang}
              aria-current={active ? 'true' : undefined}
            >
              <span aria-hidden="true">{lang}</span>
              <span className="sr-only">{title}</span>
            </a>
          </li>
        )
      })}
    </ul>
  )
}

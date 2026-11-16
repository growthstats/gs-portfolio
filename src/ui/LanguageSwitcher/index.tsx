'use client'

import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { usePathname } from 'next/navigation'
import { Check, ChevronDown } from 'lucide-react'
import { useDictionary, useLang } from '@/i18n/DictionaryProvider'
import { enabledLanguages, supportedLanguages } from '@/lib/i18n'
import { cn } from '@/lib/utils'
import Flag from './Flag'
import { languageLinks } from './languageLinks'

/**
 * A dropdown of links to the current page in every enabled language; hidden while only one is enabled.
 * Built on `<details>`, so it opens without JS, and the links are plain `<a>` tags,
 * so switching reloads `<html lang>`. JS adds outside-click and Escape to close,
 * and arrow keys to move between languages.
 *
 * @param menuClassName - Positions the menu, which sits below the trigger and starts at its left edge by default.
 */
export default function LanguageSwitcher({
  className,
  menuClassName,
}: {
  className?: string
  menuClassName?: string
}) {
  const pathname = usePathname()
  const current = useLang()
  const { languageSwitcher } = useDictionary()
  const menuId = useId()
  const details = useRef<HTMLDetailsElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return

    const closeOnOutsideClick = (event: PointerEvent) => {
      if (details.current && !details.current.contains(event.target as Node)) {
        details.current.open = false
      }
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [open])

  if (enabledLanguages.length < 2) return null

  const currentTitle = supportedLanguages.find(({ id }) => id === current)?.title

  function close({ focusTrigger = false } = {}) {
    if (!details.current) return
    details.current.open = false
    if (focusTrigger) details.current.querySelector('summary')?.focus()
  }

  function links() {
    return [...(details.current?.querySelectorAll<HTMLAnchorElement>('a') ?? [])]
  }

  function onKeyDown(event: KeyboardEvent<HTMLDetailsElement>) {
    const items = links()
    const index = items.indexOf(document.activeElement as HTMLAnchorElement)
    let next: HTMLAnchorElement | undefined

    switch (event.key) {
      case 'Escape':
        if (!open) return
        event.preventDefault()
        close({ focusTrigger: true })
        return
      case 'ArrowDown':
        if (!open) details.current!.open = true
        next = items[(index + 1) % items.length]
        break
      case 'ArrowUp':
        if (!open) details.current!.open = true
        next = items.at(index === -1 ? -1 : index - 1)
        break
      case 'Home':
        if (index !== -1) next = items[0]
        break
      case 'End':
        if (index !== -1) next = items.at(-1)
        break
      default:
        return
    }

    if (!next) return
    event.preventDefault()
    next.focus()
  }

  return (
    <details
      ref={details}
      className={cn(
        // No open/close transition: the global one on `::details-content` keeps the links unfocusable while it runs.
        'group relative w-max text-sm [&::details-content]:transition-none',
        className,
      )}
      onToggle={(event) => setOpen(event.currentTarget.open)}
      onKeyDown={onKeyDown}
      onBlur={(event) => {
        // Close once focus leaves the switcher, e.g. tabbing past the last language.
        if (!event.currentTarget.contains(event.relatedTarget)) close()
      }}
    >
      <summary
        className="flex cursor-pointer list-none items-center gap-1.5 rounded-sm px-2 py-1 font-semibold uppercase transition-colors select-none hover:bg-ink/5 focus-visible:bg-ink/5 [&::-webkit-details-marker]:hidden"
        aria-controls={menuId}
      >
        <Flag lang={current} />
        <span aria-hidden="true">{current}</span>
        <span className="sr-only">
          {languageSwitcher.label}: {currentTitle}
        </span>
        <ChevronDown
          className="size-3.5 shrink-0 opacity-60 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>

      <ul
        id={menuId}
        className={cn(
          'absolute top-full left-0 z-20 mt-1 grid min-w-28 anim-fade-to-b gap-0.5 rounded-sm border border-ink/10 bg-canvas p-1 shadow-md frosted-glass',
          menuClassName,
        )}
        aria-label={languageSwitcher.label}
      >
        {languageLinks(pathname, enabledLanguages).map(({ lang, title, href }) => {
          const active = lang === current

          return (
            <li key={lang}>
              <a
                className={cn(
                  'flex items-center gap-2 rounded-sm px-2 py-1.5 uppercase transition-colors outline-none hover:bg-ink/5 focus-visible:bg-ink/5',
                  active && 'font-semibold',
                )}
                href={href}
                hrefLang={lang}
                lang={lang}
                aria-current={active ? 'true' : undefined}
              >
                <Flag lang={lang} />
                <span aria-hidden="true">{lang}</span>
                <span className="sr-only">{title}</span>
                <Check
                  className={cn('ms-auto size-3.5 shrink-0', !active && 'invisible')}
                  aria-hidden="true"
                />
              </a>
            </li>
          )
        })}
      </ul>
    </details>
  )
}

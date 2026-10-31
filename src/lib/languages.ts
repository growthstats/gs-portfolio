import type { Language } from '@sanity/document-internationalization'

/**
 * Every language the Studio can hold content in (ADR 0001, 0002): the supported
 * list, not the enabled one, so editors can prepare German before launch.
 *
 * Temporary home: #63 owns `src/lib/i18n.ts`. #65 folds this list into it.
 */
export const supportedLanguages: Language[] = [
  { id: 'en', title: 'English' },
  { id: 'de', title: 'Deutsch' },
]

export const DEFAULT_LANGUAGE = 'en'

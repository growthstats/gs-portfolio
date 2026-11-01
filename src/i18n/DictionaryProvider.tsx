'use client'

import { createContext, useContext } from 'react'
import type { Lang } from '@/lib/i18n'
import type { Dictionary } from './dictionaries/en'

const DictionaryContext = createContext<{ lang: Lang; dictionary: Dictionary } | null>(null)

/** Gives client components the page language and its UI strings; set once in `[lang]/layout.tsx`. */
export default function DictionaryProvider({
  lang,
  dictionary,
  children,
}: {
  lang: Lang
  dictionary: Dictionary
  children: React.ReactNode
}) {
  return <DictionaryContext value={{ lang, dictionary }}>{children}</DictionaryContext>
}

function useDictionaryContext() {
  const context = useContext(DictionaryContext)
  if (!context) throw new Error('useDictionary() must be used inside <DictionaryProvider>')
  return context
}

export function useDictionary() {
  return useDictionaryContext().dictionary
}

export function useLang() {
  return useDictionaryContext().lang
}

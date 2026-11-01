import type { Lang } from '@/lib/i18n'
import de from './dictionaries/de'
import en, { type Dictionary } from './dictionaries/en'

export type { Dictionary }

const dictionaries: Record<Lang, Dictionary> = { en, de }

/** UI strings for a language. Server components call this; client components use `useDictionary()`. */
export function getDictionary(lang: Lang): Dictionary {
  return dictionaries[lang]
}

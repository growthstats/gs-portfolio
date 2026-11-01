import type { Lang } from '@/lib/i18n'

/** Fills `{name}` placeholders: `format('{count} results', { count: 3 })` → `'3 results'`. */
export function format(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  )
}

export type PluralForms = { one: string; other: string }

/** Picks the plural form for `count` in `lang` and fills its `{count}` placeholder. */
export function plural(lang: Lang, count: number, forms: PluralForms) {
  const rule = new Intl.PluralRules(lang).select(count)
  return format(rule === 'one' ? forms.one : forms.other, { count })
}

import { describe, expect, it } from 'vitest'
import { supportedLanguages } from '@/lib/i18n'
import { getDictionary } from '.'
import en from './dictionaries/en'

/** Flattens a dictionary to `{ 'contactForm.labels.name': 'Name', ... }`. */
function leaves(value: unknown, path = ''): Record<string, unknown> {
  if (typeof value !== 'object' || value === null) return { [path]: value }
  return Object.fromEntries(
    Object.entries(value).flatMap(([key, child]) =>
      Object.entries(leaves(child, path ? `${path}.${key}` : key)),
    ),
  )
}

const placeholders = (value: unknown) =>
  String(value)
    .match(/\{\w+\}/g)
    ?.sort() ?? []

const english = leaves(en)

describe.each(supportedLanguages.map(({ id }) => id))('the %s dictionary', (lang) => {
  const strings = leaves(getDictionary(lang))

  it('has exactly the English keys', () => {
    expect(Object.keys(strings).sort()).toEqual(Object.keys(english).sort())
  })

  it('has no empty strings', () => {
    const empty = Object.entries(strings).filter(
      ([, value]) => typeof value !== 'string' || !value.trim(),
    )
    expect(empty.map(([key]) => key)).toEqual([])
  })

  it('keeps the English placeholders', () => {
    for (const [key, value] of Object.entries(english)) {
      expect(placeholders(strings[key]), key).toEqual(placeholders(value))
    }
  })
})

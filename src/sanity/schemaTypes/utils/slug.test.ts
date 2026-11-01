import { describe, expect, it } from 'vitest'
import type { SlugValue, ValidationContext } from 'sanity'
import { noEmptySegments } from './slug'

const validate = (current?: string) =>
  noEmptySegments(
    current === undefined ? undefined : ({ _type: 'slug', current } as SlugValue),
    {} as ValidationContext,
  )

describe('noEmptySegments', () => {
  it('accepts plain and nested slugs', () => {
    expect(validate('technical-seo')).toBe(true)
    expect(validate('services/seo')).toBe(true)
    expect(validate('index')).toBe(true)
  })

  it('leaves an empty slug to Rule.required()', () => {
    expect(validate()).toBe(true)
    expect(validate('')).toBe(true)
  })

  it('rejects a leading, trailing or double slash', () => {
    for (const slug of ['technical-seo/', '/technical-seo', '/', 'services//seo'])
      expect(validate(slug)).toContain('Remove the extra "/"')
  })
})

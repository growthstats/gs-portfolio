import { describe, expect, it } from 'vitest'
import type { SlugValue, ValidationContext } from 'sanity'
import { noEdgeSlashes } from './slug'

const validate = (current?: string) =>
  noEdgeSlashes(
    current === undefined ? undefined : ({ _type: 'slug', current } as SlugValue),
    {} as ValidationContext,
  )

describe('noEdgeSlashes', () => {
  it('accepts plain and nested slugs', () => {
    expect(validate('technical-seo')).toBe(true)
    expect(validate('services/seo')).toBe(true)
    expect(validate('index')).toBe(true)
  })

  it('leaves an empty slug to Rule.required()', () => {
    expect(validate()).toBe(true)
    expect(validate('')).toBe(true)
  })

  it('rejects a trailing or leading slash', () => {
    expect(validate('technical-seo/')).toContain('Remove the "/"')
    expect(validate('/technical-seo')).toContain('Remove the "/"')
    expect(validate('/')).toContain('Remove the "/"')
  })
})

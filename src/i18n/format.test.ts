import { describe, expect, it } from 'vitest'
import { format, plural } from './format'

describe('format', () => {
  it('fills placeholders', () => {
    expect(format('Must be at most {max} characters', { max: 200 })).toBe(
      'Must be at most 200 characters',
    )
  })

  it('leaves unknown placeholders alone', () => {
    expect(format('{count} of {total}', { count: 1 })).toBe('1 of {total}')
  })
})

describe('plural', () => {
  const forms = { one: '{count} minute', other: '{count} minutes' }

  it('uses the singular for one', () => {
    expect(plural('en', 1, forms)).toBe('1 minute')
  })

  it('uses the plural for zero and many', () => {
    expect(plural('en', 0, forms)).toBe('0 minutes')
    expect(plural('de', 5, { one: '{count} Minute', other: '{count} Minuten' })).toBe('5 Minuten')
  })
})

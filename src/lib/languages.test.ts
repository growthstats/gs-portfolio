import { describe, expect, it } from 'vitest'
import { siteDocumentId } from './languages'

describe('siteDocumentId', () => {
  it('keeps the English site settings at `site`', () => {
    expect(siteDocumentId('en')).toBe('site')
  })

  it('suffixes other languages', () => {
    expect(siteDocumentId('de')).toBe('site-de')
  })
})

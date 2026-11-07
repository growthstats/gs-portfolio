import { describe, expect, it } from 'vitest'
import { indexRedirects, isIndexable } from './indexing'

describe('isIndexable', () => {
  it('is true only on the production deployment', () => {
    expect(isIndexable('production')).toBe(true)
    expect(isIndexable('preview')).toBe(false)
    expect(isIndexable('development')).toBe(false)
    expect(isIndexable(undefined)).toBe(false)
  })
})

describe('indexRedirects', () => {
  it('sends every /index to its language homepage, permanently', () => {
    expect(indexRedirects()).toEqual([
      { source: '/index', destination: '/', permanent: true },
      { source: '/en/index', destination: '/', permanent: true },
      { source: '/de/index', destination: '/de', permanent: true },
    ])
  })
})

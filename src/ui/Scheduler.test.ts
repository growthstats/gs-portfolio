import { describe, expect, it } from 'vitest'
import { isActiveAt } from './Scheduler'

const now = new Date('2026-06-15T12:00:00Z')

describe('isActiveAt', () => {
  it('is active with no start or end', () => {
    expect(isActiveAt(now)).toBe(true)
  })

  it('is active between start and end', () => {
    expect(isActiveAt(now, '2026-06-01T00:00:00Z', '2026-07-01T00:00:00Z')).toBe(true)
  })

  it('is inactive before the start', () => {
    expect(isActiveAt(now, '2026-06-16T00:00:00Z')).toBe(false)
  })

  it('is inactive after the end', () => {
    expect(isActiveAt(now, undefined, '2026-06-15T11:59:59Z')).toBe(false)
  })
})

import { beforeAll, describe, expect, it, vi } from 'vitest'

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com'
})

let filterHref: typeof import('./filterHref').filterHref
beforeAll(async () => {
  filterHref = (await import('./filterHref')).filterHref
})

describe('filterHref', () => {
  it('filters the blog list by category or author', () => {
    expect(filterHref('category', 'seo')).toBe('/blog?category=seo')
    expect(filterHref('author', 'jane-doe')).toBe('/blog?author=jane-doe')
  })

  it('encodes the slug and falls back to the unfiltered list', () => {
    expect(filterHref('category', 'a&b')).toBe('/blog?category=a%26b')
    expect(filterHref('author')).toBe('/blog')
  })
})

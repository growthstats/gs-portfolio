import { describe, expect, it, vi } from 'vitest'
import { documentHref, mainDocuments } from './presentationResolve'

// `@/lib/env` throws without the site's environment variables; only BLOG_DIR is needed here.
vi.mock('@/lib/env', () => ({ BLOG_DIR: 'blog' }))

describe('mainDocuments', () => {
  it('has a home, page and blog post route per language, prefixed languages first', () => {
    // English `/:slug` would also match `/de`, and Presentation takes the first match.
    expect(mainDocuments.map(({ route }) => route)).toEqual([
      '/de',
      '/de/:slug',
      '/de/blog/:slug',
      '/',
      '/:slug',
      '/blog/:slug',
    ])
  })

  it('filters each route to its own language, with no language counting as English', () => {
    const [deHome, dePage, , enHome] = mainDocuments
    expect(enHome.filter).toContain("coalesce(language, 'en') == 'en'")
    expect(deHome.filter).toContain("coalesce(language, 'en') == 'de'")
    expect(dePage.filter).toContain('$slug')
  })
})

describe('documentHref', () => {
  it('keeps English paths as they are', () => {
    expect(documentHref('/about', 'en')).toBe('/about')
    expect(documentHref('/about', undefined)).toBe('/about')
  })

  it('prefixes other languages', () => {
    expect(documentHref('/', 'de')).toBe('/de')
    expect(documentHref('/blog/post', 'de')).toBe('/de/blog/post')
  })

  it('treats an unknown language as English', () => {
    expect(documentHref('/about', 'fr')).toBe('/about')
  })
})

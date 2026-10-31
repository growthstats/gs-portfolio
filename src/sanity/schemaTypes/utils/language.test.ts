import { describe, expect, it, vi } from 'vitest'
import type { SlugValidationContext } from 'sanity'
import { isUniquePerLanguage, withLanguage } from './language'

function validate(document: Record<string, unknown>, path = ['metadata', 'slug']) {
  const fetch = vi.fn().mockResolvedValue(true)
  const getClient = vi.fn(() => ({ withConfig: () => ({ fetch }) }))
  const context = { document, path, getClient } as unknown as SlugValidationContext

  isUniquePerLanguage('services', context)

  const [query, params] = fetch.mock.calls[0]
  return { query: query as string, params }
}

describe('isUniquePerLanguage', () => {
  it('checks the slug within the same type and language', () => {
    const { query, params } = validate({ _id: 'drafts.abc', _type: 'page', language: 'de' })

    expect(query).toContain('metadata.slug.current == $slug')
    expect(query).toContain('coalesce(language, $defaultLanguage) == $language')
    expect(params).toMatchObject({
      type: 'page',
      published: 'abc',
      slug: 'services',
      language: 'de',
      defaultLanguage: 'en',
    })
  })

  it('treats a document without a language as English', () => {
    const { params } = validate({ _id: 'abc', _type: 'page' })
    expect(params.language).toBe('en')
  })

  it('reads a top-level slug', () => {
    const { query } = validate({ _id: 'abc', _type: 'blog.category', language: 'en' }, ['slug'])
    expect(query).toContain('slug.current == $slug')
    expect(query).not.toContain('metadata.')
  })

  it('excludes every version of the document itself', () => {
    const { query } = validate({ _id: 'versions.r1.abc', _type: 'page' })
    expect(query).toContain('!sanity::versionOf($published)')
  })
})

describe('withLanguage', () => {
  it('prefixes the subtitle with a language badge', () => {
    expect(withLanguage('de', '/services')).toBe('[de] /services')
  })

  it('leaves the subtitle alone without a language', () => {
    expect(withLanguage(undefined, '/services')).toBe('/services')
  })

  it('shows the badge alone without a subtitle', () => {
    expect(withLanguage('en')).toBe('[en]')
  })
})

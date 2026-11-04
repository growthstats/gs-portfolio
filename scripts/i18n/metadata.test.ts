import { describe, expect, it } from 'vitest'
import {
  languageOf,
  metadataDocument,
  remapReferences,
  translationReference,
  type Translated,
} from './metadata'

describe('translationReference', () => {
  it('matches the plugin’s createReference with strengthening on publish', () => {
    expect(translationReference('de', 'abc', 'page')).toEqual({
      language: 'de',
      _key: expect.any(String),
      _type: 'internationalizedArrayReferenceValue',
      value: {
        _type: 'reference',
        _ref: 'abc',
        _weak: true,
        _strengthenOnPublish: { type: 'page' },
      },
    })
  })

  it('builds the metadata document around the source reference', () => {
    const source = translationReference('en', 'abc', 'page')
    expect(metadataDocument('meta-1', 'page', source)).toEqual({
      _id: 'meta-1',
      _type: 'translation.metadata',
      schemaTypes: ['page'],
      translations: [source],
    })
  })
})

describe('languageOf', () => {
  it('reads the language field, or the key of an entry from before the v6 migration', () => {
    expect(languageOf({ _key: 'x1y2', language: 'de' })).toBe('de')
    expect(languageOf({ _key: 'de' })).toBe('de')
  })
})

describe('remapReferences', () => {
  const translated = new Map<string, Translated>([
    ['cat-en', { id: 'cat-de', type: 'blog.category', published: true }],
    ['quote-en', { id: 'quote-de', type: 'testimonial', published: false }],
  ])

  it('points references at translations, weak while the translation is a draft', () => {
    const doc = {
      categories: [{ _key: 'k1', _type: 'reference', _ref: 'cat-en' }],
      modules: [{ _key: 'm1', testimonial: { _type: 'reference', _ref: 'quote-en' } }],
      author: { _type: 'reference', _ref: 'person-1' },
    }

    expect(remapReferences(doc, translated)).toEqual({
      categories: [{ _key: 'k1', _type: 'reference', _ref: 'cat-de' }],
      modules: [
        {
          _key: 'm1',
          testimonial: {
            _type: 'reference',
            _ref: 'quote-de',
            _weak: true,
            _strengthenOnPublish: { type: 'testimonial' },
          },
        },
      ],
      author: { _type: 'reference', _ref: 'person-1' },
    })
  })
})

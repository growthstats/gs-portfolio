import { describe, expect, it } from 'vitest'
import { createSchema, type ObjectSchemaType } from 'sanity'
import { flatten, unflatten } from './strings'

const schema = createSchema({
  name: 'test',
  types: [
    { name: 'code', type: 'object', fields: [{ name: 'code', type: 'text' }] },
    {
      name: 'cta',
      type: 'object',
      fields: [
        { name: 'label', type: 'string' },
        { name: 'style', type: 'string', options: { list: ['default', 'ghost'] } },
        { name: 'params', type: 'string' },
        { name: 'external', type: 'url' },
      ],
    },
    {
      name: 'page',
      type: 'document',
      fields: [
        { name: 'title', type: 'string' },
        { name: 'language', type: 'string' },
        {
          name: 'metadata',
          type: 'object',
          fields: [
            { name: 'slug', type: 'slug' },
            { name: 'description', type: 'text' },
          ],
        },
        {
          name: 'content',
          type: 'array',
          of: [
            {
              type: 'block',
              marks: {
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    fields: [
                      { name: 'href', type: 'url' },
                      { name: 'title', type: 'string' },
                    ],
                  },
                ],
              },
            },
            { type: 'image', fields: [{ name: 'alt', type: 'string' }] },
            { type: 'code' },
          ],
        },
        { name: 'ctas', type: 'array', of: [{ type: 'cta' }] },
        { name: 'keywords', type: 'array', of: [{ type: 'string' }] },
        { name: 'related', type: 'reference', to: [{ type: 'page' }] },
      ],
    },
    {
      name: 'testimonial',
      type: 'document',
      fields: [
        {
          name: 'author',
          type: 'object',
          fields: [
            { name: 'name', type: 'string' },
            { name: 'title', type: 'string' },
          ],
        },
      ],
    },
  ],
})

const pageType = schema.get('page') as ObjectSchemaType

const page = {
  _id: 'page-1',
  _type: 'page',
  title: 'Services',
  language: 'en',
  metadata: { slug: { _type: 'slug', current: 'services' }, description: 'What we do' },
  content: [
    {
      _key: 'b1',
      _type: 'block',
      style: 'h2',
      markDefs: [{ _key: 'l1', _type: 'link', href: 'https://growthstats.io', title: 'Our site' }],
      children: [
        { _key: 's1', _type: 'span', marks: [], text: 'Grow with ' },
        { _key: 's2', _type: 'span', marks: ['strong', 'l1'], text: 'Growth Stats' },
        { _key: 's3', _type: 'span', marks: ['em'], text: ' today.' },
      ],
    },
    {
      _key: 'b2',
      _type: 'block',
      style: 'normal',
      listItem: 'bullet',
      level: 1,
      markDefs: [],
      children: [{ _key: 's4', _type: 'span', marks: [], text: 'SEO audits' }],
    },
    {
      _key: 'b3',
      _type: 'block',
      style: 'normal',
      listItem: 'number',
      level: 2,
      markDefs: [],
      children: [{ _key: 's5', _type: 'span', marks: [], text: '' }],
    },
    {
      _key: 'i1',
      _type: 'image',
      alt: 'Team photo',
      asset: { _type: 'reference', _ref: 'image-abc' },
    },
    { _key: 'c1', _type: 'code', code: 'const x = "not copy"' },
  ],
  ctas: [
    {
      _key: 'cta1',
      _type: 'cta',
      label: 'Contact us',
      style: 'ghost',
      params: '#form',
      external: 'https://example.com',
    },
  ],
  keywords: ['growth', 'seo'],
  related: { _type: 'reference', _ref: 'page-2' },
}

describe('flatten', () => {
  it('keys every translatable string by its path', () => {
    expect(flatten(page, pageType)).toEqual({
      title: 'Services',
      'metadata.description': 'What we do',
      'content[_key=="b1"].children[_key=="s1"].text': 'Grow with ',
      'content[_key=="b1"].children[_key=="s2"].text': 'Growth Stats',
      'content[_key=="b1"].children[_key=="s3"].text': ' today.',
      'content[_key=="b1"].markDefs[_key=="l1"].title': 'Our site',
      'content[_key=="b2"].children[_key=="s4"].text': 'SEO audits',
      'content[_key=="i1"].alt': 'Team photo',
      'ctas[_key=="cta1"].label': 'Contact us',
      'keywords[0]': 'growth',
      'keywords[1]': 'seo',
    })
  })

  it('leaves out person names', () => {
    const testimonial = {
      _id: 't',
      _type: 'testimonial',
      author: { name: 'Jane Doe', title: 'CEO' },
    }
    expect(flatten(testimonial, schema.get('testimonial') as ObjectSchemaType)).toEqual({
      'author.title': 'CEO',
    })
  })
})

describe('unflatten', () => {
  it('round-trips an identity translation to the same document', () => {
    const { doc, missing, unused } = unflatten(page, pageType, flatten(page, pageType))
    expect(doc).toEqual(page)
    expect(missing).toEqual([])
    expect(unused).toEqual([])
  })

  it('replaces span text and keeps marks, links and list structure', () => {
    const translations = Object.fromEntries(
      Object.entries(flatten(page, pageType)).map(([key, text]) => [key, `DE:${text}`]),
    )
    const { doc } = unflatten(page, pageType, translations)

    const [heading, item, emptyItem, image, code] = doc.content
    expect(heading).toEqual({
      ...page.content[0],
      markDefs: [{ ...page.content[0].markDefs![0], title: 'DE:Our site' }],
      children: [
        { _key: 's1', _type: 'span', marks: [], text: 'DE:Grow with ' },
        { _key: 's2', _type: 'span', marks: ['strong', 'l1'], text: 'DE:Growth Stats' },
        { _key: 's3', _type: 'span', marks: ['em'], text: 'DE: today.' },
      ],
    })
    expect(item).toMatchObject({
      listItem: 'bullet',
      level: 1,
      children: [{ text: 'DE:SEO audits' }],
    })
    expect(emptyItem).toEqual(page.content[2])
    expect(image).toEqual({ ...page.content[3], alt: 'DE:Team photo' })
    expect(code).toEqual(page.content[4])

    expect(doc.ctas[0]).toEqual({ ...page.ctas[0], label: 'DE:Contact us' })
    expect(doc.metadata.slug).toEqual(page.metadata.slug)
    expect(doc.related).toEqual(page.related)
    expect(doc.language).toBe('en')
  })

  it('keeps English for missing keys and reports keys the document no longer has', () => {
    const { doc, missing, unused } = unflatten(page, pageType, {
      title: 'Leistungen',
      'content[_key=="gone"].children[_key=="x"].text': 'Weg',
    })

    expect(doc.title).toBe('Leistungen')
    expect(doc.metadata.description).toBe('What we do')
    expect(missing).toContain('metadata.description')
    expect(missing).not.toContain('title')
    expect(unused).toEqual(['content[_key=="gone"].children[_key=="x"].text'])
  })
})

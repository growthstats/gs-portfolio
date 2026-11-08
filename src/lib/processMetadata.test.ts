import { describe, expect, it, vi } from 'vitest'
import processMetadata from './processMetadata'

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com'
})

const base = {
  language: 'en',
  _createdAt: '2026-01-01T00:00:00Z',
  _updatedAt: '2026-03-04T10:00:00Z',
  metadata: { slug: { current: 'hello' }, title: 'Hello', description: 'Hi' },
  isFallback: false,
  translations: [{ lang: 'en', url: '/blog/hello' }],
}

const page = (fields: Record<string, unknown>) =>
  ({ ...base, ...fields }) as unknown as Parameters<typeof processMetadata>[0]

describe('processMetadata alternates', () => {
  it('links the Markdown copy of the page', async () => {
    const { alternates } = await processMetadata(page({ _type: 'page' }))
    expect(alternates?.types).toMatchObject({ 'text/markdown': 'https://example.com/hello.md' })
  })

  it('leaves it out for a hidden page, which has no Markdown copy', async () => {
    const { alternates } = await processMetadata(
      page({ _type: 'page', metadata: { ...base.metadata, noIndex: true } }),
    )
    expect(alternates?.types).not.toHaveProperty('text/markdown')
  })
})

describe('processMetadata openGraph', () => {
  it('marks a blog post as an article with its dates and authors', async () => {
    const { openGraph } = await processMetadata(
      page({
        _type: 'blog.post',
        publishDate: '2026-02-01',
        authors: [{ name: 'Ada' }, { name: 'Grace' }, null],
      }),
    )

    expect(openGraph).toMatchObject({
      type: 'article',
      publishedTime: '2026-02-01',
      modifiedTime: '2026-03-04T10:00:00Z',
      authors: ['Ada', 'Grace'],
    })
  })

  it('falls back to the creation date and leaves out empty authors', async () => {
    const { openGraph } = await processMetadata(page({ _type: 'blog.post', authors: [] }))

    expect(openGraph).toMatchObject({
      type: 'article',
      publishedTime: '2026-01-01T00:00:00Z',
    })
    expect(openGraph).not.toHaveProperty('authors')
  })

  it('keeps website for pages', async () => {
    const { openGraph } = await processMetadata(page({ _type: 'page' }))

    expect(openGraph).toMatchObject({ type: 'website' })
    expect(openGraph).not.toHaveProperty('publishedTime')
  })
})

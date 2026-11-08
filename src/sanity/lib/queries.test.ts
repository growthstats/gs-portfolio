import { evaluate, parse } from 'groq-js'
import { describe, expect, it, vi } from 'vitest'

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com'
  process.env.NEXT_PUBLIC_ENABLED_LANGUAGES = 'de'
})

vi.mock('./fetch', () => ({ fetchSanityLive: vi.fn() }))

import { BLOG_POST_MODULES_QUERY, NOT_FOUND_MODULES_QUERY, PAGE_MODULES_QUERY } from './queries'

const globalModule = (name: string, path: string) => ({
  _id: name,
  _type: 'global-module',
  language: 'en',
  path,
  before: [{ _key: `${name}-before`, _type: 'custom-html' }],
  after: [{ _key: `${name}-after`, _type: 'custom-html' }],
})

const dataset = [
  globalModule('site', '*'),
  globalModule('blog', 'blog/'),
  globalModule('services', 'services'),
  { _id: 'page', _type: 'page', modules: [{ _key: 'own', _type: 'custom-html' }] },
]

async function moduleKeys(modules: string, slug: string) {
  const query = `*[_id == 'page'][0]{ 'modules': ${modules} }.modules[]._key`
  const value = await evaluate(parse(query, { params: { lang: 'en', slug } }), {
    dataset,
    params: { lang: 'en', slug },
  })
  return value.get()
}

describe('global modules around a document', () => {
  it('wraps a page in the site-wide modules, then those matching its path', async () => {
    expect(await moduleKeys(PAGE_MODULES_QUERY, 'services/seo')).toEqual([
      'site-before',
      'services-before',
      'own',
      'services-after',
      'site-after',
    ])
  })

  it('gives the 404 page only the site-wide modules', async () => {
    expect(await moduleKeys(NOT_FOUND_MODULES_QUERY, '404')).toEqual([
      'site-before',
      'own',
      'site-after',
    ])
  })

  it('gives a blog post the site-wide modules and the blog template, without own modules', async () => {
    expect(await moduleKeys(BLOG_POST_MODULES_QUERY, 'a-post')).toEqual([
      'site-before',
      'blog-before',
      'blog-after',
      'site-after',
    ])
  })
})

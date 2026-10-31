import { describe, expect, it } from 'vitest'
import { filterPosts } from './filterPosts'

const post = (id: string, category: string, author: string) =>
  ({
    _id: id,
    categories: [{ slug: { current: category } }],
    authors: [{ slug: { current: author } }],
  }) as unknown as Sanity.BlogPost

const posts = [post('a', 'seo', 'ana'), post('b', 'ads', 'ana'), post('c', 'seo', 'ben')]
const ids = (result: Sanity.BlogPost[]) => result.map((p) => p._id)

describe('filterPosts', () => {
  it('keeps every post with no filters', () => {
    expect(ids(filterPosts(posts, { category: 'All', author: null }))).toEqual(['a', 'b', 'c'])
  })

  it('filters by category', () => {
    expect(ids(filterPosts(posts, { category: 'seo', author: null }))).toEqual(['a', 'c'])
  })

  it('filters by author', () => {
    expect(ids(filterPosts(posts, { category: 'All', author: 'ana' }))).toEqual(['a', 'b'])
  })

  it('filters by category and author together', () => {
    expect(ids(filterPosts(posts, { category: 'seo', author: 'ana' }))).toEqual(['a'])
  })
})

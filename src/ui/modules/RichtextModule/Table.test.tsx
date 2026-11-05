import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import type { Table as TableValue } from '@/sanity/sanity.types'
import Table from './Table'

const cell = (text: string) => ({
  _type: 'cell' as const,
  _key: text,
  value: [
    {
      _type: 'block' as const,
      _key: `${text}-b`,
      style: 'normal' as const,
      markDefs: [],
      children: [{ _type: 'span' as const, _key: `${text}-s`, text, marks: [] }],
    },
  ],
})

const row = (...texts: string[]) => ({
  _type: 'row' as const,
  _key: texts.join(),
  cells: texts.map(cell),
})

const render = (value: Partial<TableValue>) =>
  renderToStaticMarkup(<Table value={{ _type: 'table', ...value }} />)

describe('Table', () => {
  it('puts header rows in <thead> and the rest in <tbody>', () => {
    const html = render({ headerRows: 1, rows: [row('Plan', 'Price'), row('Basic', '€10')] })

    expect(html).toMatch(/<thead[^>]*><tr><th scope="col"[^>]*><p>Plan<\/p><\/th>/)
    expect(html).toMatch(/<tbody><tr[^>]*><td[^>]*><p>Basic<\/p><\/td><td[^>]*><p>€10<\/p>/)
  })

  it('has no <thead> without header rows', () => {
    const html = render({ headerRows: 0, rows: [row('a', 'b')] })

    expect(html).not.toContain('<thead')
    expect(html).toContain('<td')
  })

  it('caps header rows at the row count', () => {
    const html = render({ headerRows: 5, rows: [row('a')] })

    expect(html).toContain('<th')
    expect(html).not.toContain('<tbody')
  })

  it('renders the caption', () => {
    expect(render({ caption: 'Plans', rows: [row('a')] })).toMatch(/<caption[^>]*>Plans<\/caption>/)
  })

  it('wraps the table so it scrolls instead of widening the page', () => {
    expect(render({ rows: [row('a')] })).toMatch(
      /^<div class="max-w-full overflow-x-auto"><table data-pt-table="true"/,
    )
  })

  it('renders nothing without rows', () => {
    expect(render({ rows: [] })).toBe('')
  })
})

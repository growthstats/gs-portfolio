import { describe, expect, it } from 'vitest'
import tableToHTML from './tableToHTML'

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

describe('tableToHTML', () => {
  it('splits header and body rows and escapes the caption', () => {
    expect(
      tableToHTML({
        _type: 'table',
        caption: 'A & B',
        headerRows: 1,
        rows: [row('Plan', 'Price'), row('Basic', '<10')],
      }),
    ).toBe(
      '<table><caption>A &amp; B</caption>' +
        '<thead><tr><th><p>Plan</p></th><th><p>Price</p></th></tr></thead>' +
        '<tbody><tr><td><p>Basic</p></td><td><p>&lt;10</p></td></tr></tbody></table>',
    )
  })

  it('has only a body without header rows or a caption', () => {
    expect(tableToHTML({ _type: 'table', rows: [row('a')] })).toBe(
      '<table><tbody><tr><td><p>a</p></td></tr></tbody></table>',
    )
  })
})

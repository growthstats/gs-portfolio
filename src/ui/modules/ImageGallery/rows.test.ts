import { describe, expect, it } from 'vitest'
import { galleryRows } from './rows'

const image = (_key: string) => ({ _key, asset: { _ref: _key } })

describe('galleryRows', () => {
  it('drops images without an asset, and rows left empty', () => {
    const rows = galleryRows([
      { _key: 'a', images: [image('1'), { _key: '2' }, null] },
      { _key: 'b', images: [{ _key: '3' }] },
      { _key: 'c' },
    ])

    expect(rows.map(({ key, images }) => [key, images.map((i) => i._key)])).toEqual([['a', ['1']]])
  })

  it('reverses every second rendered row when alternating', () => {
    const rows = galleryRows(
      [
        { _key: 'a', images: [image('1')] },
        { _key: 'empty', images: [] },
        { _key: 'b', images: [image('2')] },
        { _key: 'c', images: [image('3')] },
      ],
      true,
    )

    expect(rows.map(({ key, reverse }) => [key, reverse])).toEqual([
      ['a', false],
      ['b', true],
      ['c', false],
    ])
  })

  it('never reverses without alternating, and copes with no rows', () => {
    expect(
      galleryRows([{ images: [image('1')] }, { images: [image('2')] }]).map((r) => r.reverse),
    ).toEqual([false, false])
    expect(galleryRows(undefined)).toEqual([])
  })
})

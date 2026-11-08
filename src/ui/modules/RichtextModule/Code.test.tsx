import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'

// ClickToCopy is a client component that needs the dictionary provider; it isn't under test here.
vi.mock('@/ui/ClickToCopy', () => ({ default: () => null }))

import Code from './Code'

const render = async (
  value: Parameters<typeof Code>[0]['value'],
  theme?: Parameters<typeof Code>[0]['theme'],
) => renderToStaticMarkup((await Code({ value, theme }))!)

describe('Code', () => {
  it('highlights with the dark-plus theme by default', async () => {
    const html = await render({ code: 'const a = 1', language: 'ts' })

    expect(html).toContain('class="shiki dark-plus"')
    expect(html).toContain('background-color:#1E1E1E')
    expect(html).toMatch(/<span style="color:#569CD6">const<\/span>/)
  })

  it('uses the theme it is given', async () => {
    expect(await render({ code: 'a', language: 'ts' }, 'snazzy-light')).toContain(
      'class="shiki snazzy-light"',
    )
  })

  it('marks highlighted lines', async () => {
    const html = await render({ code: 'one\ntwo\nthree', language: 'ts', highlightedLines: [2] })

    expect(html.match(/class="line highlight"/g)).toHaveLength(1)
    expect(html).toMatch(/class="line highlight"><span [^>]*>two</)
  })

  it('renders plain text when no language is set', async () => {
    const html = await render({ code: '<table style="width:100%">' })

    expect(html).toContain('<span class="line"><span>&#x3C;table style="width:100%"></span></span>')
  })

  it('renders nothing without code', async () => {
    expect(await Code({ value: undefined })).toBeNull()
  })
})

import { describe, expect, it } from 'vitest'
import { linkList, moduleToMd, pageToMd, portableTextToMd, postToMd } from './markdown'

let key = 0
const span = (text: string, marks: string[] = []) => ({
  _type: 'span',
  _key: `s${key++}`,
  text,
  marks,
})
const block = (style: string, text: string, extra: Record<string, unknown> = {}) => ({
  _type: 'block',
  _key: `b${key++}`,
  style,
  markDefs: [],
  children: [span(text)],
  ...extra,
})

describe('portableTextToMd', () => {
  it('renders headings, including the display styles', () => {
    expect(
      portableTextToMd([
        block('display-hero', 'Hero'),
        block('display-xxl', 'Big'),
        block('display-xl', 'Large'),
        block('h2', 'Section'),
        block('h4', 'Small'),
      ]),
    ).toBe('# Hero\n\n## Big\n\n### Large\n\n## Section\n\n#### Small')
  })

  it('renders bullet and numbered lists', () => {
    expect(
      portableTextToMd([
        block('normal', 'One', { listItem: 'bullet', level: 1 }),
        block('normal', 'Two', { listItem: 'bullet', level: 1 }),
        block('normal', 'First', { listItem: 'number', level: 1 }),
        block('normal', 'Second', { listItem: 'number', level: 1 }),
      ]),
    ).toBe('- One\n- Two\n1. First\n2. Second')
  })

  it('renders links and inline marks', () => {
    expect(
      portableTextToMd([
        {
          ...block('normal', ''),
          markDefs: [{ _key: 'l1', _type: 'link', href: 'https://example.com' }],
          children: [span('Read '), span('the guide', ['l1']), span(' '), span('now', ['strong'])],
        },
      ]),
    ).toBe('Read [the guide](https://example.com) **now**')
  })

  it('renders code blocks with their language', () => {
    expect(
      portableTextToMd([{ _type: 'code', _key: 'c', code: 'const a = 1', language: 'ts' }]),
    ).toBe('```ts\nconst a = 1\n```')
  })

  it('renders images with alt text and caption, and skips images without a URL', () => {
    expect(
      portableTextToMd([
        {
          _type: 'image',
          _key: 'i1',
          src: 'https://cdn.sanity.io/a.png',
          alt: 'A chart',
          caption: 'Traffic',
        },
        { _type: 'image', _key: 'i2', alt: 'Missing asset' },
      ]),
    ).toBe('![A chart](https://cdn.sanity.io/a.png "Traffic")')
  })

  it('renders admonitions as alerts', () => {
    expect(
      portableTextToMd([
        {
          _type: 'admonition',
          _key: 'a',
          tone: 'tip',
          title: 'Tip',
          content: [block('normal', 'Do this')],
        },
      ]),
    ).toBe('> [!TIP]\n> **Tip**\n>\n> Do this')
  })

  it('drops objects with no text instead of dumping JSON', () => {
    expect(portableTextToMd([{ _type: 'form', _key: 'f', id: 'x' }, block('normal', 'Text')])).toBe(
      'Text',
    )
  })
})

describe('moduleToMd', () => {
  it('collects copy fields and rich text in order, skipping config and references', () => {
    expect(
      moduleToMd({
        _type: 'hero',
        pretitle: 'Welcome',
        content: [block('h1', 'Grow faster')],
        layout: 'center',
        ctas: [
          { link: { label: 'ignored', internal: { title: 'Other page' } }, text: 'Book a call' },
        ],
        image: { alt: 'decorative' },
      }),
    ).toBe('Welcome\n\n# Grow faster\n\nBook a call')
  })

  it('walks nested items such as stats and FAQs', () => {
    expect(
      moduleToMd({
        _type: 'stat-list',
        stats: [
          { value: '120%', text: 'more traffic' },
          { value: '3x', text: 'leads' },
        ],
      }),
    ).toBe('120%\n\nmore traffic\n\n3x\n\nleads')
  })
})

describe('pageToMd and postToMd', () => {
  it('puts the title and description before the modules', () => {
    expect(
      pageToMd({
        title: 'Services',
        description: 'What we do',
        modules: [{ _type: 'callout', content: [block('normal', 'Hi')] }],
      }),
    ).toBe('# Services\n\n> What we do\n\nHi\n')
  })

  it('adds the date and authors to a post', () => {
    expect(
      postToMd({
        title: 'Post',
        publishDate: '2026-06-03',
        authors: ['Ada', null],
        body: [block('normal', 'Body')],
      }),
    ).toBe('# Post\n\nPublished: 2026-06-03 · By: Ada\n\nBody\n')
  })
})

describe('linkList', () => {
  it('links titled entries and leaves out untitled ones', () => {
    expect(
      linkList([
        { title: 'A', url: 'https://x/a.md', description: 'About A' },
        { title: 'B', url: 'https://x/b.md' },
        { url: 'https://x/c.md' },
      ]),
    ).toEqual(['- [A](https://x/a.md): About A', '- [B](https://x/b.md)'])
  })
})

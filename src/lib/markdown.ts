import {
  DefaultCalloutRenderer,
  DefaultH1Renderer,
  DefaultH2Renderer,
  DefaultH3Renderer,
  DefaultImageRenderer,
  portableTextToMarkdown,
  type PortableTextTypeRenderer,
} from '@portabletext/markdown'
import { stegaClean } from 'next-sanity'

/*
 * Markdown copies of pages and posts for LLM crawlers and agents (#138),
 * served at `<url>.md` by `src/app/api/md/[...slug]/route.ts`.
 */

type Block = { _type: string; [key: string]: unknown }

const isBlockArray = (value: unknown): value is Block[] =>
  Array.isArray(value) && value.some((item) => item?._type === 'block')

const ADMONITION_TONES = ['note', 'tip', 'important', 'warning', 'caution']

/** Our image block: the query projects `src` from the asset; `caption` becomes the title. */
const image: PortableTextTypeRenderer = (options) => {
  const { src, alt, caption } = options.value ?? {}
  if (typeof src !== 'string') return ''
  return DefaultImageRenderer({
    ...options,
    value: { ...options.value, src, alt: alt || undefined, title: caption || undefined },
  })
}

/** Our admonition maps onto a GitHub alert (`> [!NOTE]`). */
const admonition: PortableTextTypeRenderer = (options) => {
  const { title, content, tone } = options.value ?? {}
  if (!Array.isArray(content)) return ''
  const heading = title
    ? [
        {
          _type: 'block',
          style: 'normal',
          children: [{ _type: 'span', text: title, marks: ['strong'] }],
          markDefs: [],
        },
      ]
    : []
  return DefaultCalloutRenderer({
    ...options,
    value: {
      _type: 'callout',
      tone: ADMONITION_TONES.includes(tone) ? tone : 'note',
      content: [...heading, ...content],
    },
  })
}

/** Portable Text to Markdown, with the site's display heading styles and block objects. */
export function portableTextToMd(blocks?: Block[] | null): string {
  if (!blocks?.length) return ''
  return portableTextToMarkdown(stegaClean(blocks), {
    block: {
      'display-hero': DefaultH1Renderer,
      'display-xxl': DefaultH2Renderer,
      'display-xl': DefaultH3Renderer,
    },
    types: { image, admonition },
    // Anything else (forms, embeds, module options) has no useful text.
    unknownType: () => '',
  }).trim()
}

/** String fields that hold readable copy in module schemas. Everything else is config. */
const TEXT_FIELDS = new Set([
  'pretitle',
  'title',
  'subtitle',
  'headingBadge',
  'name',
  'question',
  'label',
  'text',
  'summary',
  'description',
  'caption',
  'prefix',
  'value',
  'suffix',
  'quote',
  'role',
])

/** Copy fields that head the item they belong to. */
const HEADING_FIELDS = new Set([
  'pretitle',
  'title',
  'subtitle',
  'headingBadge',
  'name',
  'question',
])

/**
 * Fields never worth descending into: referenced pages (a link's `internal`),
 * images, styling, and derived data such as a rich text module's `headings`,
 * which repeats its content.
 */
const SKIPPED_FIELDS = new Set([
  'metadata',
  'internal',
  'options',
  'image',
  'images',
  'logo',
  'icon',
  'headings',
])

function collectText(value: unknown, key: string | undefined, out: string[]) {
  if (typeof value === 'string') {
    const text = stegaClean(value).trim()
    if (key && TEXT_FIELDS.has(key) && text) out.push(text)
    return
  }
  if (isBlockArray(value)) {
    const md = portableTextToMd(value)
    if (md) out.push(md)
    return
  }
  if (Array.isArray(value)) {
    for (const item of value) collectText(item, key, out)
    return
  }
  if (value && typeof value === 'object') {
    // Headings first, so a card reads "title, then text" whatever the query's field order.
    const fields = Object.entries(value).sort(
      ([a], [b]) => Number(!HEADING_FIELDS.has(a)) - Number(!HEADING_FIELDS.has(b)),
    )
    for (const [field, child] of fields) {
      if (field.startsWith('_') || SKIPPED_FIELDS.has(field)) continue
      collectText(child, field, out)
    }
  }
}

/**
 * The readable text of a module, in field order: its copy fields and Portable
 * Text. Generic so every module type, present and future, gets a Markdown copy.
 */
export function moduleToMd(module: unknown): string {
  const out: string[] = []
  collectText(module, undefined, out)
  // Drop immediate repeats, such as a title echoed in a label.
  return out.filter((text, i) => text !== out[i - 1]).join('\n\n')
}

/** Text without stega markers or surrounding space; empty becomes undefined. */
export const clean = (value?: string | null) => stegaClean(value)?.trim() || undefined

const join = (parts: (string | undefined | false)[]) => parts.filter(Boolean).join('\n\n') + '\n'

/** Header shared by pages and posts: `# Title`, then the description as a quote. */
function header(title?: string | null, description?: string | null) {
  const desc = clean(description)
  return [`# ${clean(title) ?? ''}`, desc && `> ${desc}`]
}

export type MarkdownPage = {
  title?: string | null
  description?: string | null
  modules?: unknown[] | null
}

export function pageToMd({ title, description, modules }: MarkdownPage): string {
  return join([...header(title, description), ...(modules ?? []).map(moduleToMd)])
}

export type MarkdownPost = {
  title?: string | null
  description?: string | null
  publishDate?: string | null
  authors?: (string | null)[] | null
  body?: Block[] | null
}

export function postToMd({ title, description, publishDate, authors, body }: MarkdownPost): string {
  const names = (authors ?? []).map(clean).filter(Boolean)
  const byline = [
    clean(publishDate) && `Published: ${clean(publishDate)}`,
    names.length && `By: ${names.join(', ')}`,
  ]
    .filter(Boolean)
    .join(' · ')

  return join([...header(title, description), byline, portableTextToMd(body)])
}

/** A Markdown list linking each entry, e.g. `- [Title](https://…/slug.md): description`. */
export function linkList(
  entries: { title?: string | null; url: string; description?: string | null }[],
) {
  return entries.flatMap(({ title, url, description }) => {
    const name = clean(title)
    const desc = clean(description)
    if (!name) return []
    return desc ? `- [${name}](${url}): ${desc}` : `- [${name}](${url})`
  })
}

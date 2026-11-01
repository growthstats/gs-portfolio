/**
 * Walks a Sanity document along its schema and finds every string an editor
 * would translate: `string` and `text` fields and Portable Text spans (ADR 0003).
 *
 * Each string gets a stable key, its path in Sanity's path syntax
 * (`modules[_key=="a1"].content[_key=="b2"].children[_key=="c3"].text`), so a
 * translated file can be applied back to the same English document later.
 */
import {
  pathToString,
  type ArraySchemaType,
  type ObjectSchemaType,
  type Path,
  type SchemaType,
} from 'sanity'

/** `{ key: string }`, one entry per translatable string in a document. */
export type Strings = Record<string, string>

/** Types whose values are never translated, nor anything inside them. */
const SKIP_TYPES = new Set(['reference', 'crossDatasetReference', 'slug', 'code'])

/**
 * Plain `string` fields that hold code, not copy: ids, URL parts, CSS, icon names.
 * Fields with an `options.list` are skipped anyway, as their values are enum values.
 */
const SKIP_FIELDS = new Set([
  'language',
  'uid',
  'params',
  'path',
  'ic0n',
  'size',
  'media',
  'className',
  'repo',
  'aspectRatio',
  // sanitypress-utils alignment fields: enum values behind a custom input, without `options.list`.
  'alignItems',
  'textAlign',
  // Business details are always read from the English `site` document (ADR 0002).
  'localBusiness',
])

/** Field paths per document type that stay as they are, such as person names. */
const SKIP_PATHS: Record<string, string[]> = {
  testimonial: ['author.name'],
}

type Visit = (key: string, text: string) => string

function isType(type: SchemaType | undefined, name: string): boolean {
  for (let t = type; t; t = t.type) if (t.name === name) return true
  return false
}

const isTranslatable = (type: SchemaType) =>
  (isType(type, 'string') || isType(type, 'text')) && !type.options?.list

function walk(value: unknown, type: SchemaType, path: Path, visit: Visit): unknown {
  if (value === null || value === undefined) return value
  if ([...SKIP_TYPES].some((name) => isType(type, name))) return value

  if (type.jsonType === 'string') {
    if (typeof value !== 'string' || !value.trim() || !isTranslatable(type)) return value
    return visit(pathToString(path), value)
  }

  if (type.jsonType === 'array') {
    if (!Array.isArray(value) || type.options?.list) return value
    return value.map((item, index) => {
      const member = memberType(type as ArraySchemaType, item)
      if (!member) return item
      const segment = isKeyed(item) ? { _key: item._key } : index
      return walk(item, member, [...path, segment], visit)
    })
  }

  if (type.jsonType === 'object') {
    if (typeof value !== 'object') return value
    if (isType(type, 'block'))
      return walkBlock(value as Block, type as ObjectSchemaType, path, visit)

    const result: Record<string, unknown> = { ...(value as Record<string, unknown>) }
    for (const field of (type as ObjectSchemaType).fields ?? []) {
      if (SKIP_FIELDS.has(field.name)) continue
      if (field.name in result) {
        result[field.name] = walk(result[field.name], field.type, [...path, field.name], visit)
      }
    }
    return result
  }

  return value
}

type Block = { children?: { _type: string; _key?: string; text?: string }[]; markDefs?: unknown[] }

/** Portable Text block: span texts, plus fields of inline objects and annotations. */
function walkBlock(block: Block, type: ObjectSchemaType, path: Path, visit: Visit): Block {
  const field = (name: string) => type.fields.find((f) => f.name === name)?.type as ArraySchemaType
  const children = field('children')
  const markDefs = field('markDefs')

  return {
    ...block,
    children: block.children?.map((child, index) => {
      const childPath = [...path, 'children', child._key ? { _key: child._key } : index]
      if (child._type === 'span') {
        return typeof child.text === 'string' && child.text.trim()
          ? { ...child, text: visit(pathToString([...childPath, 'text']), child.text) }
          : child
      }
      const member = children && memberType(children, child)
      return member ? (walk(child, member, childPath, visit) as typeof child) : child
    }),
    ...(block.markDefs && markDefs
      ? {
          markDefs: walk(block.markDefs, markDefs, [...path, 'markDefs'], visit) as unknown[],
        }
      : {}),
  }
}

function isKeyed(item: unknown): item is { _key: string } {
  return (
    typeof item === 'object' &&
    item !== null &&
    typeof (item as { _key?: unknown })._key === 'string'
  )
}

function memberType(type: ArraySchemaType, item: unknown): SchemaType | undefined {
  const itemType =
    typeof item === 'object' && item !== null ? (item as { _type?: string })._type : undefined
  return itemType
    ? type.of.find((member) => member.name === itemType)
    : type.of.find((member) => member.jsonType === typeof item)
}

function walkDocument<T extends { _type: string }>(
  doc: T,
  type: ObjectSchemaType,
  visit: Visit,
): T {
  const skip = new Set(SKIP_PATHS[doc._type] ?? [])
  const guarded: Visit = (key, text) => (skip.has(stripKeys(key)) ? text : visit(key, text))
  return walk(doc, type, [], guarded) as T
}

/** `author.name` for `author.name`, `faq[_key=="x"].question` → `faq.question`. */
function stripKeys(key: string) {
  return key.replace(/\[[^\]]*\]/g, '')
}

/** Every translatable string in `doc`, keyed by its path. */
export function flatten(doc: { _type: string }, type: ObjectSchemaType): Strings {
  const strings: Strings = {}
  walkDocument(doc, type, (key, text) => {
    strings[key] = text
    return text
  })
  return strings
}

/**
 * Rebuilds `doc` with the translated strings. A string without a translation
 * keeps its English text and is listed in `missing`; a translation whose key no
 * longer exists (the English document changed since the export) is listed in `unused`.
 */
export function unflatten<T extends { _type: string }>(
  doc: T,
  type: ObjectSchemaType,
  translations: Strings,
) {
  const missing: string[] = []
  const used = new Set<string>()

  const translated = walkDocument(doc, type, (key, text) => {
    const translation = translations[key]
    if (typeof translation !== 'string') {
      missing.push(key)
      return text
    }
    used.add(key)
    return translation
  })

  const unused = Object.keys(translations).filter((key) => !used.has(key))
  return { doc: translated, missing, unused }
}

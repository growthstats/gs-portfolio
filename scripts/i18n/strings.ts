/**
 * Walks a Sanity document along its schema and finds every string an editor
 * would translate: `string` and `text` fields and Portable Text spans (ADR 0003).
 *
 * Each string gets a stable key, its path in Sanity's path syntax
 * (`modules[_key=="a1"].content[_key=="b2"].children[_key=="c3"].text`), so a
 * translated file can be applied back to the same English document later.
 */
import {
  isArraySchemaType,
  isBlockSchemaType,
  isKeyedObject,
  isObjectSchemaType,
  pathToString,
  stringToPath,
  type ArraySchemaType,
  type BlockSchemaType,
  type Path,
  type PathSegment,
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
])

/** Fields per document type that stay as they are, with everything inside them. */
const SKIP_PATHS: Record<string, string[]> = {
  // Business details are always read from the English `site` document (ADR 0002).
  site: ['localBusiness'],
  // Person names aren't translated.
  testimonial: ['author.name'],
}

type Visit = (key: string, text: string) => string

function isType(type: SchemaType | undefined, names: Set<string>): boolean {
  for (let t = type; t; t = t.type) if (names.has(t.name)) return true
  return false
}

const TEXT_TYPES = new Set(['string', 'text'])

const segment = (item: unknown, index: number): PathSegment =>
  isKeyedObject(item) ? { _key: item._key } : index

function walk(value: unknown, type: SchemaType, path: Path, visit: Visit): unknown {
  if (value === null || value === undefined || isType(type, SKIP_TYPES)) return value

  if (type.jsonType === 'string') {
    const translatable = isType(type, TEXT_TYPES) && !type.options?.list
    return translatable && typeof value === 'string' && value.trim()
      ? visit(pathToString(path), value)
      : value
  }

  if (isArraySchemaType(type)) {
    if (!Array.isArray(value) || type.options?.list) return value
    return value.map((item, index) => {
      const member = memberType(type, item)
      return member ? walk(item, member, [...path, segment(item, index)], visit) : item
    })
  }

  if (isObjectSchemaType(type) && typeof value === 'object') {
    if (isBlockSchemaType(type)) return walkBlock(value as Block, type, path, visit)

    const result: Record<string, unknown> = { ...(value as Record<string, unknown>) }
    for (const field of type.fields) {
      if (SKIP_FIELDS.has(field.name) || !(field.name in result)) continue
      result[field.name] = walk(result[field.name], field.type, [...path, field.name], visit)
    }
    return result
  }

  return value
}

type Span = { _type: string; _key?: string; text?: string }
type Block = { children?: Span[]; markDefs?: unknown[] }

/** Portable Text block: span texts, plus fields of inline objects and annotations. */
function walkBlock(block: Block, type: BlockSchemaType, path: Path, visit: Visit): Block {
  const field = (name: string) => type.fields.find((f) => f.name === name)?.type as ArraySchemaType
  const children = field('children')

  return {
    ...block,
    children: block.children?.map((child, index) => {
      const childPath = [...path, 'children', segment(child, index)]
      if (child._type === 'span') {
        return typeof child.text === 'string' && child.text.trim()
          ? { ...child, text: visit(pathToString([...childPath, 'text']), child.text) }
          : child
      }
      const member = memberType(children, child)
      return member ? (walk(child, member, childPath, visit) as Span) : child
    }),
    markDefs: walk(block.markDefs, field('markDefs'), [...path, 'markDefs'], visit) as unknown[],
  }
}

function memberType(type: ArraySchemaType, item: unknown): SchemaType | undefined {
  const itemType =
    typeof item === 'object' && item !== null ? (item as { _type?: string })._type : undefined
  return itemType
    ? type.of.find((member) => member.name === itemType)
    : type.of.find((member) => member.jsonType === typeof item)
}

function walkDocument<T extends { _type: string }>(doc: T, type: SchemaType, visit: Visit): T {
  const skipped = SKIP_PATHS[doc._type] ?? []
  const guarded: Visit = (key, text) => {
    // Field names only: `faq[_key=="x"].question` → `faq.question`.
    const fields = stringToPath(key)
      .filter((s) => typeof s === 'string')
      .join('.')
    return skipped.some((p) => fields === p || fields.startsWith(`${p}.`)) ? text : visit(key, text)
  }
  return walk(doc, type, [], guarded) as T
}

/** Every translatable string in `doc`, keyed by its path. */
export function flatten(doc: { _type: string }, type: SchemaType): Strings {
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
  type: SchemaType,
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

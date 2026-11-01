/**
 * Rebuilds each exported document from its current English original with the
 * translated strings, and saves it as a draft translation (ADR 0003):
 *
 * - writes `drafts.<id>` with `language: <lang>`, the same id on every run;
 * - links it to the English document in `translation.metadata`, as the Studio does;
 * - points references to categories and testimonials at their translations.
 *
 *   npm run i18n:import -- --lang de [--type page] [--id <id>] [--dry-run]
 *
 * Never publishes. The German site settings are `site-de` and have no metadata (ADR 0002).
 */
import { randomUUID } from 'node:crypto'
import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import type { MetadataDocument } from '@sanity/document-internationalization'
import type { Transaction } from 'next-sanity'
import { getDraftId } from 'sanity'
import { DEFAULT_LANGUAGE, siteDocumentId } from '@/lib/languages'
import {
  client,
  documentType,
  parseOptions,
  published,
  run,
  target,
  workDir,
  workFile,
} from './cli'
import {
  METADATA_TYPE,
  metadataDocument,
  remapReferences,
  translationReference,
  type Translated,
} from './metadata'
import { unflatten, type Strings } from './strings'

/** References to these types follow the language; links to pages and posts stay English (ADR 0002). */
const REMAPPED_TYPES = ['blog.category', 'testimonial']

type Doc = { _id: string; _type: string; language?: string; [field: string]: unknown }

run(async () => {
  const { lang, types, ids, dryRun } = parseOptions()

  // Translate categories and testimonials first, so documents referencing them can point at the new drafts.
  const ordered = [...types].sort(
    (a, b) => Number(REMAPPED_TYPES.includes(b)) - Number(REMAPPED_TYPES.includes(a)),
  )
  const files = (await Promise.all(ordered.map((type) => listFiles(lang, type)))).flat()
  const selected = ids ? files.filter(({ id }) => ids.includes(id)) : files

  const metadata = await client.fetch<MetadataDocument[]>(`*[_type == $type]`, {
    type: METADATA_TYPE,
  })
  const metadataOf = new Map(
    metadata.flatMap((doc) =>
      doc.translations
        .filter(({ _key }) => _key === DEFAULT_LANGUAGE)
        .map(({ value }) => [value._ref, doc] as const),
    ),
  )
  const translated = await translatedReferences(metadata, lang)

  const [originals, drafts] = await Promise.all([
    published.fetch<Doc[]>(`*[_id in $ids]`, { ids: selected.map(({ id }) => id) }),
    client.fetch<string[]>(`*[_id in path("drafts.**") && language == $lang]._id`, { lang }),
  ])
  const originalOf = new Map(originals.map((doc) => [doc._id, doc]))
  const existingDrafts = new Set(drafts)

  console.log(`${target}: importing ${selected.length} ${lang} files${dryRun ? ' (dry run)' : ''}`)

  for (const { type, id } of selected) {
    const label = `${type}/${id}`
    const original = originalOf.get(id)
    if (
      !original ||
      original._type !== type ||
      (original.language ?? DEFAULT_LANGUAGE) !== DEFAULT_LANGUAGE
    ) {
      console.warn(`  skip  ${label}: no published English ${type} with this id`)
      continue
    }

    const strings = await readStrings(workFile(lang, type, id))
    const { doc, missing, unused } = unflatten(original, documentType(type), strings)

    const tx = client.transaction()
    let translationId: string
    let note: string
    if (type === 'site') {
      // The German site settings have a fixed id and no metadata (ADR 0002).
      translationId = siteDocumentId(lang)
      note = 'site settings, no metadata'
    } else {
      const existing = metadataOf.get(id)
      const linked = existing?.translations.find(({ _key }) => _key === lang)?.value._ref
      translationId = linked ?? randomUUID()
      note = linked ? 'already linked' : link(tx, { id, type, lang, translationId, existing })
    }

    // System fields (`_rev`, `_createdAt`, `_system`, ...) belong to the English document.
    const content = Object.entries(remapReferences(doc, translated)).filter(
      ([key]) => !key.startsWith('_'),
    )
    const draftId = getDraftId(translationId)
    tx.createOrReplace({
      ...Object.fromEntries(content),
      _id: draftId,
      _type: type,
      language: lang,
    })

    console.log(
      `  ${existingDrafts.has(draftId) ? 'replace' : 'create'} ${draftId} from ${label} (${note})`,
    )
    if (missing.length)
      console.warn(`    ${missing.length} strings left in English, e.g. ${missing[0]}`)
    if (unused.length)
      console.warn(`    ${unused.length} keys no longer in the English document, e.g. ${unused[0]}`)

    if (!dryRun) await tx.commit()
    if (REMAPPED_TYPES.includes(type))
      translated.set(id, { id: translationId, type, published: false })
  }

  console.log(dryRun ? 'Dry run: nothing written.' : 'Done. Nothing was published.')
})

/** Adds the translation to the English document's metadata, the same steps as the plugin's `handleCreate` in LanguageOption.tsx. */
function link(
  tx: Transaction,
  {
    id,
    type,
    lang,
    translationId,
    existing,
  }: { id: string; type: string; lang: string; translationId: string; existing?: MetadataDocument },
) {
  const source = translationReference(DEFAULT_LANGUAGE, id, type)
  const metadataId = existing?._id ?? randomUUID()
  if (!existing) tx.createIfNotExists(metadataDocument(metadataId, type, source))
  tx.patch(metadataId, (patch) =>
    patch
      .setIfMissing({ translations: [source] })
      .insert('after', 'translations[-1]', [translationReference(lang, translationId, type)]),
  )
  return existing ? `add ${lang} to ${metadataId}` : `new metadata ${metadataId}`
}

async function listFiles(lang: string, type: string) {
  const dir = path.join(workDir(lang), type)
  const names = await readdir(dir).catch(() => [])
  return names
    .filter((name) => name.endsWith('.json'))
    .map((name) => ({ type, id: path.basename(name, '.json') }))
}

async function readStrings(file: string): Promise<Strings> {
  const strings: unknown = JSON.parse(await readFile(file, 'utf8'))
  const valid =
    typeof strings === 'object' &&
    strings !== null &&
    !Array.isArray(strings) &&
    Object.values(strings).every((value) => typeof value === 'string')
  if (!valid) throw new Error(`${file}: expected a flat { key: string } map`)
  return strings as Strings
}

/** English id → its translation, for every category and testimonial already translated. */
async function translatedReferences(metadata: MetadataDocument[], lang: string) {
  const translated = new Map<string, Translated>()
  for (const { schemaTypes, translations } of metadata) {
    const [type] = schemaTypes
    if (!REMAPPED_TYPES.includes(type)) continue
    const source = translations.find(({ _key }) => _key === DEFAULT_LANGUAGE)?.value._ref
    const translation = translations.find(({ _key }) => _key === lang)?.value._ref
    if (source && translation) translated.set(source, { id: translation, type, published: false })
  }

  const ids = [...translated.values()].map(({ id }) => id)
  const live = new Set(await client.fetch<string[]>(`*[_id in $ids]._id`, { ids }))
  for (const entry of translated.values()) entry.published = live.has(entry.id)
  return translated
}

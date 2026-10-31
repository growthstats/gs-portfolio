/**
 * Sets `language: 'en'` on every document of a translatable type that has no
 * language yet (ADR 0002). Covers published documents, plus their drafts and
 * release versions, so publishing one of those later can't drop the language.
 *
 *   npx sanity exec scripts/migrations/backfill-language.ts -- --dry-run
 *   npx sanity exec scripts/migrations/backfill-language.ts
 *
 * Run on the Node version in `.nvmrc`; `sanity exec` fails on newer majors.
 *
 * Project and dataset come from NEXT_PUBLIC_SANITY_PROJECT_ID / _DATASET, writes
 * use SANITY_API_WRITE_TOKEN for reads and writes (all from `.env`). Idempotent: `setIfMissing` never
 * overwrites a language or an editor's concurrent change, and a second run finds nothing.
 */
import { existsSync } from 'node:fs'
import { createClient } from 'next-sanity'
import { DEFAULT_LANGUAGE } from '@/lib/languages'
import { translatableTypes } from '@/sanity/schemaTypes/utils/language'

if (existsSync('.env')) process.loadEnvFile('.env')

const dryRun = process.argv.includes('--dry-run')
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !dataset) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or _DATASET')
// Also needed for the dry run: without a token, drafts are invisible and the counts come out short.
if (!token) throw new Error('Missing SANITY_API_WRITE_TOKEN')

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-02-19',
  perspective: 'raw',
  useCdn: false,
})

type Doc = { _id: string; _type: string }

const MISSING = `*[_type in $types && !defined(language)]`
const params = { types: translatableTypes }

const kind = ({ _id }: Doc) =>
  _id.startsWith('drafts.') ? 'draft' : _id.startsWith('versions.') ? 'version' : 'published'

async function main() {
  const docs = await client.fetch<Doc[]>(`${MISSING}{ _id, _type }`, params)

  const counts: Record<string, Record<string, number>> = {}
  for (const doc of docs) {
    const byKind = (counts[doc._type] ??= {})
    const k = kind(doc)
    byKind[k] = (byKind[k] ?? 0) + 1
  }

  console.log(`${projectId}/${dataset}: ${docs.length} documents without a language`)
  console.table(counts)

  if (dryRun) {
    console.log(
      `Dry run: nothing written. Without --dry-run, sets language: '${DEFAULT_LANGUAGE}'.`,
    )
    return
  }

  const BATCH = 100
  for (let i = 0; i < docs.length; i += BATCH) {
    const tx = client.transaction()
    for (const { _id } of docs.slice(i, i + BATCH)) {
      tx.patch(_id, (patch) => patch.setIfMissing({ language: DEFAULT_LANGUAGE }))
    }
    await tx.commit({ visibility: 'async' })
    console.log(`Patched ${Math.min(i + BATCH, docs.length)}/${docs.length}`)
  }

  const left = await client.fetch<number>(`count(${MISSING})`, params)
  console.log(`Done. Documents still without a language: ${left}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

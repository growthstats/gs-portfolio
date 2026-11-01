/**
 * Writes the translatable strings of every published English document to
 * `i18n-work/<lang>/<type>/<id>.json` (ADR 0003). See `README.md` for the workflow.
 *
 *   npm run i18n:export -- --lang de [--type page] [--id <id>]
 *
 * Read-only on Sanity. Overwrites earlier exports of the same documents.
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { DEFAULT_LANGUAGE } from '@/lib/languages'
import { documentType, parseOptions, published, run, target, workFile } from './cli'
import { flatten } from './strings'

type Doc = { _id: string; _type: string }

run(async () => {
  const { lang, types, ids } = parseOptions()

  const docs = await published.fetch<Doc[]>(
    `*[_type in $types && coalesce(language, $default) == $default ${ids ? '&& _id in $ids' : ''}]
      | order(_type asc, _id asc)`,
    { types, ids: ids ?? [], default: DEFAULT_LANGUAGE },
  )

  console.log(`${target}: ${docs.length} English documents`)

  let written = 0
  for (const doc of docs) {
    const strings = flatten(doc, documentType(doc._type))
    const count = Object.keys(strings).length
    if (!count) {
      console.log(`  skip  ${doc._type}/${doc._id}: no translatable strings`)
      continue
    }

    const file = workFile(lang, doc._type, doc._id)
    await mkdir(path.dirname(file), { recursive: true })
    await writeFile(file, `${JSON.stringify(strings, null, 2)}\n`)
    console.log(`  wrote ${path.relative(process.cwd(), file)} (${count} strings)`)
    written++
  }

  console.log(`Done: ${written} files.`)
})

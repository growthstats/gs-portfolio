/** Shared setup for `export.ts` and `import.ts`: arguments, Sanity client, Studio schema. */
// Must load before the schema: esbuild-register compiles the schema's JSX to `React.createElement`.
import './react-global'
import { existsSync } from 'node:fs'
import path from 'node:path'
import { parseArgs } from 'node:util'
import { createClient } from 'next-sanity'
import { codeInput } from '@sanity/code-input'
import { createSchema, type ObjectSchemaType, type SchemaTypeDefinition } from 'sanity'
import { DEFAULT_LANG, isSupportedLanguage, supportedLanguages } from '@/lib/i18n'
import { schemaTypes } from '@/sanity/schemaTypes'
import { translatableTypes } from '@/sanity/schemaTypes/utils/language'

if (existsSync('.env')) process.loadEnvFile('.env')

export function parseOptions() {
  // `sanity exec script.ts -- --lang de` passes the `--` through.
  const args = process.argv.slice(2).filter((arg) => arg !== '--')
  const { values } = parseArgs({
    args,
    options: {
      lang: { type: 'string' },
      type: { type: 'string', multiple: true },
      id: { type: 'string', multiple: true },
      'dry-run': { type: 'boolean', default: false },
      force: { type: 'boolean', default: false },
    },
  })

  const lang = values.lang
  const targets = supportedLanguages.map(({ id }) => id).filter((id) => id !== DEFAULT_LANG)
  if (!isSupportedLanguage(lang) || !targets.includes(lang)) {
    throw new Error(`--lang must be one of: ${targets.join(', ')}`)
  }

  const types = values.type ?? translatableTypes
  const unknown = types.filter((type) => !translatableTypes.includes(type))
  if (unknown.length) {
    throw new Error(
      `Not a translatable type: ${unknown.join(', ')}. Use one of: ${translatableTypes.join(', ')}`,
    )
  }

  return { lang, types, ids: values.id, dryRun: values['dry-run'], force: values.force }
}

/** `i18n-work/<lang>/<type>/<id>.json`, git-ignored. */
export const workDir = (lang: string) => path.resolve('i18n-work', lang)
export const workFile = (lang: string, type: string, id: string) =>
  path.join(workDir(lang), type, `${id}.json`)

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
const token = process.env.SANITY_API_WRITE_TOKEN
if (!projectId || !dataset) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID or _DATASET')
// Also needed for reads: drafts and translation metadata are only visible with a token.
if (!token) throw new Error('Missing SANITY_API_WRITE_TOKEN')

export const target = `${projectId}/${dataset}`

/** Raw perspective: drafts, published documents and metadata as stored. */
export const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: '2025-02-19',
  perspective: 'raw',
  useCdn: false,
})

/** English originals are always the published version. */
export const published = client.withConfig({ perspective: 'published' })

// `code` comes from the @sanity/code-input plugin, not `schemaTypes`.
const schema = createSchema({
  name: 'default',
  types: [...schemaTypes, ...(codeInput().schema?.types as SchemaTypeDefinition[])],
})

export function documentType(name: string) {
  const type = schema.get(name)
  if (!type) throw new Error(`Unknown schema type: ${name}`)
  return type as ObjectSchemaType
}

export function run(main: () => Promise<void>) {
  main().catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
}

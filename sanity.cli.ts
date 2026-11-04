import { defineCliConfig } from 'sanity/cli'
import { projectId, dataset } from '@/sanity/lib/env'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  // `npm run typegen`: extracts the schema, then types every `defineQuery` result.
  typegen: {
    path: './src/{app,lib,sanity,ui}/**/*.{ts,tsx}',
    schema: './src/sanity/schema.json',
    generates: './src/sanity/sanity.types.ts',
  },
})

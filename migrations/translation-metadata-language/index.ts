/**
 * document-internationalization v6 reads a translation entry's language from a
 * `language` field; v4 kept it in `_key`. This moves every `translation.metadata`
 * entry to the new format and gives it a random `_key`.
 *
 * Run once against `production`, right after the epic that ships Sanity 6 reaches
 * `main` (#118). Back up the dataset first, then dry-run:
 *
 *   npx sanity migration run translation-metadata-language
 *   npx sanity migration run translation-metadata-language --no-dry-run
 *
 * The site reads both formats (`src/sanity/lib/localized.ts`), so pages keep
 * working before and after it runs.
 */
import { migrateToLanguageField } from 'sanity-plugin-internationalized-array/migrations'

export default migrateToLanguageField(['translation.metadata'])

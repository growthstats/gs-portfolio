/**
 * The document-internationalization plugin's metadata, built as its source builds it,
 * so the pipeline writes exactly what the Studio's Translations menu writes:
 *
 * - `node_modules/@sanity/document-internationalization/src/utils/createReference.ts`
 * - `node_modules/@sanity/document-internationalization/src/components/LanguageOption.tsx` (`handleCreate`)
 * - `node_modules/@sanity/document-internationalization/src/constants.ts`
 *
 * `sanity.config.ts` leaves `weakReferences` off, so references are strengthened on publish.
 */
import { randomKey } from '@sanity/util/content'
import { isReference } from 'sanity'
import type { MetadataDocument, TranslationReference } from '@sanity/document-internationalization'

// Not exported by the plugin (`METADATA_SCHEMA_NAME` in constants.ts).
export const METADATA_TYPE = 'translation.metadata'

/**
 * One entry of `translations`: a weak reference to the published id, its language in
 * `language` under a random `_key` (document-internationalization v6).
 */
export function translationReference(
  language: string,
  id: string,
  type: string,
): TranslationReference {
  return {
    language,
    _key: randomKey(),
    _type: 'internationalizedArrayReferenceValue',
    value: { _type: 'reference', _ref: id, _weak: true, _strengthenOnPublish: { type } },
  }
}

/**
 * An entry's language. Entries written before the v6 migration hold it in `_key`
 * and have no `language` field.
 */
export function languageOf(entry: Pick<TranslationReference, '_key'> & { language?: string }) {
  return entry.language || entry._key
}

/** A new metadata document, as the plugin creates it before adding the translation. */
export function metadataDocument(
  id: string,
  type: string,
  source: TranslationReference,
): MetadataDocument {
  return { _id: id, _type: METADATA_TYPE, schemaTypes: [type], translations: [source] }
}

/** The translated version of an English document, if any. */
export type Translated = { id: string; type: string; published: boolean }

/**
 * Points references at the translated document where one exists. A translation
 * that is only a draft can't take a strong reference yet, so the reference is
 * weak and strengthened when that draft is published, as the Studio does.
 */
export function remapReferences<T>(value: T, translated: Map<string, Translated>): T {
  if (Array.isArray(value)) return value.map((item) => remapReferences(item, translated)) as T
  if (typeof value !== 'object' || value === null) return value

  const object = value as Record<string, unknown>
  const target = isReference(object) ? translated.get(object._ref) : undefined
  if (target) {
    const reference: Record<string, unknown> = { ...object, _ref: target.id }
    delete reference._weak
    delete reference._strengthenOnPublish
    return (
      target.published
        ? reference
        : { ...reference, _weak: true, _strengthenOnPublish: { type: target.type } }
    ) as T
  }

  return Object.fromEntries(
    Object.entries(object).map(([key, child]) => [key, remapReferences(child, translated)]),
  ) as T
}

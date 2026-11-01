/**
 * The document-internationalization plugin's data shapes, copied from its source
 * so the pipeline writes exactly what the Studio's Translations menu writes:
 *
 * - `node_modules/@sanity/document-internationalization/src/utils/createReference.ts`
 * - `node_modules/@sanity/document-internationalization/src/components/LanguageOption.tsx` (`handleCreate`)
 * - `node_modules/@sanity/document-internationalization/src/constants.ts`
 *
 * `sanity.config.ts` leaves `weakReferences` off, so references are strengthened on publish.
 */

export const METADATA_TYPE = 'translation.metadata'

export type TranslationReference = {
  _key: string
  _type: 'internationalizedArrayReferenceValue'
  value: { _type: 'reference'; _ref: string; _weak: true; _strengthenOnPublish: { type: string } }
}

export type MetadataDocument = {
  _id: string
  _type: typeof METADATA_TYPE
  schemaTypes: string[]
  translations: TranslationReference[]
}

/** One entry of `translations`: keyed by language, a weak reference to the published id. */
export function translationReference(
  language: string,
  id: string,
  type: string,
): TranslationReference {
  return {
    _key: language,
    _type: 'internationalizedArrayReferenceValue',
    value: { _type: 'reference', _ref: id, _weak: true, _strengthenOnPublish: { type } },
  }
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
  const target = typeof object._ref === 'string' ? translated.get(object._ref) : undefined
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

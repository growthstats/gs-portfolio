import { defineField, getPublishedId, type SlugIsUniqueValidator } from 'sanity'
import { DEFAULT_LANGUAGE } from '@/lib/languages'

/** Document types with a translation per language (ADR 0002). */
export const translatableTypes = [
  'page',
  'blog.post',
  'navigation',
  'global-module',
  'blog.category',
  'testimonial',
  'site',
]

/** Set by the document-internationalization plugin, never by editors. */
export const languageField = defineField({
  name: 'language',
  type: 'string',
  readOnly: true,
  hidden: true,
})

/** Prefixes a preview subtitle with a `[lang]` badge. */
export function withLanguage(language: string | undefined, subtitle?: string) {
  return [language && `[${language}]`, subtitle].filter(Boolean).join(' ')
}

/**
 * Slug uniqueness per type and language, so a German translation can keep
 * the English slug. Replaces Sanity's default per-type check. Documents written
 * before the backfill count as the default language.
 */
export const isUniquePerLanguage: SlugIsUniqueValidator = (slug, { document, path, getClient }) => {
  if (!document || !path) throw new Error('Slug validation needs `document` and `path`.')

  const slugPath = [...path, 'current'].join('.')
  const language = (document.language as string | undefined) ?? DEFAULT_LANGUAGE

  return getClient({ apiVersion: '2025-02-19' })
    .withConfig({ perspective: 'raw' })
    .fetch(
      `!defined(*[
        _type == $type &&
        !sanity::versionOf($published) &&
        ${slugPath} == $slug &&
        coalesce(language, $defaultLanguage) == $language
      ][0]._id)`,
      {
        type: document._type,
        published: getPublishedId(document._id),
        slug,
        language,
        defaultLanguage: DEFAULT_LANGUAGE,
      },
      { tag: 'validation.slug-is-unique-per-language' },
    )
}

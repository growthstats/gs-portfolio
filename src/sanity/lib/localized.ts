import { groq } from 'next-sanity'
import resolveSlug from '@/sanity/lib/resolveSlug'
import { DEFAULT_LANG, isEnabledLanguage, localizePath } from '@/lib/i18n'

/*
 * "This language, else English" (ADR 0002). Every fragment reads the `$lang`
 * query param. A translation is the document `translation.metadata` lists
 * under the language's key; one that isn't visible in the current perspective
 * (an unpublished draft, in production) doesn't count, so English is used.
 */

/** A document's language; documents written before the backfill count as English. */
// @sanity-typegen-ignore
export const LANGUAGE = groq`coalesce(language, '${DEFAULT_LANG}')`

/**
 * The plugin's translation entries for the document whose id `id` evaluates to.
 * document-internationalization v6 stores each entry's language in `language`
 * with a random `_key`; entries written before its migration hold it in `_key`.
 * Both are read until the migration has run on every dataset (ADR 0005, #118).
 */
const translationsOf = (id: string) =>
  groq`*[_type == 'translation.metadata' && references(${id})][0].translations`

/**
 * The `$lang` translation of the document whose id `id` evaluates to, or null.
 * Repeats `translationsOf` rather than calling it: TypeGen can't follow a parameter
 * passed on to another function, and every typed query reaches this through {@link IN_LANGUAGE}.
 */
const translationOf = (id: string) =>
  groq`*[_type == 'translation.metadata' && references(${id})][0].translations[language == $lang || _key == $lang][0].value->`

/**
 * Filter: the document is in `$lang`, or it is English and has no `$lang`
 * translation. Keeps one document per translation group; an unlinked German
 * copy of an English document passes too, so single lookups add {@link PREFER_LANGUAGE}.
 */
// @sanity-typegen-ignore
export const IN_LANGUAGE = groq`(
	${LANGUAGE} == $lang
	|| (${LANGUAGE} == '${DEFAULT_LANG}' && !defined(${translationOf('^._id')}))
)`

/** Pipe: sorts `$lang` documents first. */
// @sanity-typegen-ignore
export const PREFER_LANGUAGE = groq`order(select(${LANGUAGE} == $lang => 0, 1))`

/**
 * Site settings in `$lang`: `site-<lang>` when it exists, else the English
 * `site` (see `siteDocumentId`). Not linked by `translation.metadata`.
 */
// @sanity-typegen-ignore
export const SITE = groq`coalesce(*[_id == 'site-' + $lang][0], *[_id == 'site'][0])`

/** Projection: dereferences the reference `field` in `$lang`, else the referenced document. */
export const localizedRef = (field: string) =>
  groq`coalesce(${translationOf(`^.${field}._ref`)}, ${field}->)`

/** Projection: dereferences each reference in the array `field` in `$lang`. */
export const localizedRefs = (field: string) =>
  groq`${field}[]{ 'doc': coalesce(${translationOf('^._ref')}, @->) }.doc`

/** Projection fields that {@link withTranslationLinks} turns into `isFallback` and `translations`. */
// @sanity-typegen-ignore
export const LOCALIZED_FIELDS = groq`
	'isFallback': ${LANGUAGE} != $lang,
	'translations': coalesce(
		${translationsOf('^._id')}[defined(value->)]{
			'lang': coalesce(language, _key),
			'slug': value->metadata.slug.current
		},
		[{ 'lang': ${LANGUAGE}, 'slug': metadata.slug.current }]
	)
`

/** A document as fetched with {@link LOCALIZED_FIELDS}. */
export type LocalizedResult<T> = T & {
  isFallback: boolean
  translations: { lang: string; slug?: string }[]
}

/** Turns the fetched `translations` into a URL path per enabled language. */
export function withTranslationLinks<T extends Sanity.PageBase>(
  doc: LocalizedResult<T>,
): Sanity.Localized<T> {
  const translations = doc.translations
    .filter((t): t is { lang: Sanity.TranslationLink['lang']; slug: string } =>
      Boolean(isEnabledLanguage(t.lang) && t.slug),
    )
    .map(({ lang, slug }) => ({
      lang,
      url: localizePath(resolveSlug({ _type: doc._type, internal: slug })!, lang),
    }))

  return { ...doc, translations } as Sanity.Localized<T>
}

import { groq } from 'next-sanity'
import resolveUrl from '@/lib/resolveUrl'
import { DEFAULT_LANG, isEnabledLanguage, type Lang } from '@/lib/i18n'

/*
 * "This language, else English" (ADR 0002). Every fragment reads the `$lang`
 * query param. A translation is the document `translation.metadata` lists
 * under the language's key; one that isn't visible in the current perspective
 * (an unpublished draft, in production) doesn't count, so English is used.
 */

const LANGUAGE = groq`coalesce(language, '${DEFAULT_LANG}')`

/** The `$lang` translation of the document whose id `id` evaluates to, or null. */
const translationOf = (id: string) =>
  groq`*[_type == 'translation.metadata' && references(${id})][0].translations[_key == $lang][0].value->`

/**
 * Filter: the document is in `$lang`, or it is English and has no `$lang`
 * translation. Keeps exactly one document per translation group.
 */
export const IN_LANGUAGE = groq`(
	${LANGUAGE} == $lang
	|| (${LANGUAGE} == '${DEFAULT_LANG}' && !defined(${translationOf('^._id')}))
)`

/**
 * Site settings in `$lang`: the `$siteId` document (see `siteDocumentId`) when
 * it exists, else the English `site`. Not linked by `translation.metadata`.
 */
export const SITE = groq`coalesce(*[_id == $siteId][0], *[_id == 'site'][0])`

/** Projection: dereferences the reference `field` in `$lang`, else the referenced document. */
export const localizedRef = (field: string) =>
  groq`coalesce(${translationOf(`^.${field}._ref`)}, ${field}->)`

/** Projection: dereferences each reference in the array `field` in `$lang`. */
export const localizedRefs = (field: string) =>
  groq`${field}[]{ 'doc': coalesce(${translationOf('^._ref')}, @->) }.doc`

/** Projection fields that {@link withTranslationLinks} turns into `isFallback` and `translations`. */
export const LOCALIZED_FIELDS = groq`
	'isFallback': ${LANGUAGE} != $lang,
	'translations': coalesce(
		*[_type == 'translation.metadata' && references(^._id)][0].translations[defined(value->)]{
			'lang': _key,
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
  const translations = doc.translations.flatMap(({ lang, slug }) =>
    isEnabledLanguage(lang) && slug
      ? [
          {
            lang,
            url: resolveUrl(
              { _type: doc._type, metadata: { slug: { current: slug } } } as Sanity.PageBase,
              { base: false, language: lang },
            ),
          },
        ]
      : [],
  )

  return { ...doc, translations } as Sanity.Localized<T>
}

/**
 * Slugs to prerender in `lang`: its own documents, plus every English one,
 * which renders as itself or as a fallback.
 */
export function staticSlugs(docs: { slug: string; language: string }[], lang: Lang) {
  const slugs = docs
    .filter(({ language }) => language === lang || language === DEFAULT_LANG)
    .map(({ slug }) => slug)

  return [...new Set(slugs)]
}

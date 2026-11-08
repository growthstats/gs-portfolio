import { defineQuery } from 'next-sanity'
import { DEFAULT_LANG, type Lang } from '@/lib/i18n'
import { NOT_FOUND_MODULES_QUERY, PAGE_MODULES_QUERY } from '@/sanity/lib/queries'
import {
  IN_LANGUAGE,
  LANGUAGE,
  LOCALIZED_FIELDS,
  PREFER_LANGUAGE,
  type Localized,
  type LocalizedResult,
} from '@/sanity/lib/localized'
import type { BlogPost } from '@/sanity/queries/blog.groq'
import type { NOT_FOUND_PAGE_QUERY_RESULT, PAGE_QUERY_RESULT } from '@/sanity/sanity.types'

/** The page at `$slug` in `$lang`, else its English version, inside its global modules. */
export const PAGE_QUERY = defineQuery(`
	*[
		_type == 'page'
		&& metadata.slug.current == $slug
		&& ${IN_LANGUAGE}
	] | ${PREFER_LANGUAGE}[0]{
		...,
		'modules': ${PAGE_MODULES_QUERY},
		metadata {
			...,
			'ogimage': image.asset->url + '?w=1200'
		},
		${LOCALIZED_FIELDS}
	}
`)

/** Slugs to prerender for `$lang`: its own pages, plus the English ones it renders as fallbacks. */
export const PAGE_SLUGS_QUERY = defineQuery(`
	array::unique(*[
		_type == 'page'
		&& defined(metadata.slug.current)
		&& !(metadata.slug.current in ['index'])
		&& ${LANGUAGE} in [$lang, '${DEFAULT_LANG}']
	].metadata.slug.current)
`)

/** The 404 page in `$lang`, else English, inside the site-wide global modules. */
export const NOT_FOUND_PAGE_QUERY = defineQuery(`
	*[
		_type == 'page'
		&& metadata.slug.current == '404'
		&& ${IN_LANGUAGE}
	] | ${PREFER_LANGUAGE}[0]{
		...,
		'modules': ${NOT_FOUND_MODULES_QUERY}
	}
`)

/** A page as the page route fetches it, before its translation links are added. */
export type PageResult = LocalizedResult<NonNullable<PAGE_QUERY_RESULT>>

/** A page as the page route renders it. */
export type Page = Localized<NonNullable<PAGE_QUERY_RESULT>>

/** A module in a page's own or global modules, as the page query returns it. */
export type PageModule = NonNullable<NonNullable<NonNullable<PAGE_QUERY_RESULT>['modules']>[number]>

/** A module placed in a section, inline or as a reference. Some types only occur here. */
export type SectionChild = NonNullable<
  NonNullable<Extract<PageModule, { _type: 'section' }>['module']>[number]
>

/** Every module type the site renders, at the top level or in a section. */
export type ModuleType = PageModule['_type'] | SectionChild['_type']

/** The module of type `T`, as the page query returns it. */
export type ModuleOf<T extends ModuleType> = Extract<PageModule | SectionChild, { _type: T }>

/** What `Modules` hands the component for a module of type `T`: its fields, and the extras. */
export type ModuleProps<T extends ModuleType> = ModuleOf<T> & {
  lang: Lang
  'data-sanity'?: string
} & (T extends 'blog-post-content'
    ? { post?: BlogPost }
    : T extends 'breadcrumbs'
      ? { currentPage?: Page | BlogPost }
      : Record<never, never>)

/** The 404 page, when it exists. */
export type NotFoundPage = NOT_FOUND_PAGE_QUERY_RESULT

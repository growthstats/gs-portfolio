import { defineQuery } from 'next-sanity'
import { IN_LANGUAGE, PREFER_LANGUAGE } from '@/sanity/lib/localized'
import { MODULES_QUERY } from '@/sanity/lib/queries'

/* The Markdown copies of pages and posts (#138). A page's copy has only its own modules, not its global ones. */

/** The page at `$slug` in `$lang`, else its English version. */
export const MARKDOWN_PAGE_QUERY = defineQuery(`
	*[
		_type == 'page'
		&& metadata.slug.current == $slug
		&& !(metadata.slug.current in ['404'])
		&& metadata.noIndex != true
		&& ${IN_LANGUAGE}
	] | ${PREFER_LANGUAGE}[0]{
		'title': coalesce(metadata.title, title),
		'description': metadata.description,
		modules[]{ ${MODULES_QUERY} },
	}
`)

/** The post at `$slug` in `$lang`, else its English version. */
export const MARKDOWN_POST_QUERY = defineQuery(`
	*[
		_type == 'blog.post'
		&& metadata.slug.current == $slug
		&& metadata.noIndex != true
		&& ${IN_LANGUAGE}
	] | ${PREFER_LANGUAGE}[0]{
		'title': coalesce(title, metadata.title),
		'description': metadata.description,
		publishDate,
		'authors': authors[]->name,
		body[]{
			...,
			_type == 'image' => { 'src': asset->url, alt, caption },
		},
	}
`)

/** The blog page at `$blog` in `$lang`, else English, and every post in `$lang`, newest first. */
export const MARKDOWN_BLOG_INDEX_QUERY = defineQuery(`{
	'page': *[_type == 'page' && metadata.slug.current == $blog && ${IN_LANGUAGE}] | ${PREFER_LANGUAGE}[0]{
		'title': coalesce(metadata.title, title),
		'description': metadata.description,
		modules[]{ ${MODULES_QUERY} },
	},
	'posts': *[
		_type == 'blog.post'
		&& defined(metadata.slug.current)
		&& metadata.noIndex != true
		&& ${IN_LANGUAGE}
	] | order(publishDate desc){
		'title': coalesce(title, metadata.title),
		'slug': metadata.slug.current,
		'description': metadata.description,
	}
}`)

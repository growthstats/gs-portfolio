import { defineQuery } from 'next-sanity'
import { BLOG_DIR } from '@/lib/env'
import { IN_LANGUAGE, LANGUAGE, LOCALIZED_FIELDS, SITE } from '@/sanity/lib/localized'

/** The blog page, its posts and the copyright line, for the Atom feed in `$lang`. */
export const BLOG_RSS_QUERY = defineQuery(`{
	'blog': *[_type == 'page' && metadata.slug.current == '${BLOG_DIR}' && ${IN_LANGUAGE}][0]{
		_type,
		title,
		metadata,
		'image': metadata.image.asset->url,
	},
	'posts': *[_type == 'blog.post' && ${IN_LANGUAGE}]{
		_type,
		title,
		body,
		publishDate,
		authors[]->,
		metadata,
		'image': metadata.image.asset->url,
	},
	'copyright': pt::text(${SITE}.copyright)
}`)

/** `$lang` pages and posts for `llms.txt` and `agents.md`. */
export const AGENT_INDEX_QUERY = defineQuery(`{
	'siteTitle': ${SITE}.title,
	'siteDesc': *[_type == 'page' && metadata.slug.current == 'index' && ${LANGUAGE} == $lang][0].metadata.description,
	'pages': *[
		_type == 'page' &&
		${LANGUAGE} == $lang &&
		metadata.noIndex != true &&
		!(metadata.slug.current in ['404', 'index'])
	]|order(metadata.slug.current){
		'title': coalesce(metadata.title, title),
		'slug': metadata.slug.current,
		'desc': metadata.description,
	},
	'posts': *[_type == 'blog.post' && ${LANGUAGE} == $lang && metadata.noIndex != true]|order(publishDate desc){
		'title': coalesce(title, metadata.title),
		'slug': metadata.slug.current,
		'desc': metadata.description,
	}
}`)

/** Every published document in `$languages`. `$lang` only feeds `isFallback`. */
export const SITEMAP_QUERY = defineQuery(`*[
	_type in ['page', 'blog.post']
	&& defined(metadata.slug.current)
	&& !(metadata.slug.current in ['404'])
	&& metadata.noIndex != true
	&& ${LANGUAGE} in $languages
]|order(_type desc, metadata.slug.current){
	_type,
	_updatedAt,
	language,
	metadata { slug },
	${LOCALIZED_FIELDS}
}`)

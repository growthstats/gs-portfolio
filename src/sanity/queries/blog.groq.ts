import { defineQuery, groq } from 'next-sanity'
import { DEFAULT_LANG } from '@/lib/i18n'
import { BLOG_POST_MODULES_QUERY, IMAGE_QUERY } from '@/sanity/lib/queries'
import {
  IN_LANGUAGE,
  LANGUAGE,
  LOCALIZED_FIELDS,
  PREFER_LANGUAGE,
  localizedRefs,
} from '@/sanity/lib/localized'
import type { BLOG_FRONTPAGE_QUERY_RESULT, BLOG_POST_QUERY_RESULT } from '@/sanity/sanity.types'

/** The fields a post preview, the blog filters and the list's structured data read. */
// @sanity-typegen-ignore
const POST_PREVIEW = groq`
	_type,
	_id,
	_createdAt,
	_updatedAt,
	title,
	featured,
	publishDate,
	language,
	'categories': (${localizedRefs('categories')})[_type == 'blog.category']{ _id, title, slug },
	authors[]->,
	metadata {
		...,
		image { ${IMAGE_QUERY} },
		'ogimage': image.asset->url + '?w=1200'
	}
`

/** Every post in `$lang`, newest first. */
export const BLOG_FRONTPAGE_QUERY = defineQuery(`
	*[
		_type == 'blog.post'
		&& ${IN_LANGUAGE}
	] | order(publishDate desc) { ${POST_PREVIEW} }
`)

/**
 * Posts in `$lang`, optionally only those in `$filteredCategory` (pass `''` for all), featured
 * posts first when `$featuredFirst`, then newest first, up to index `$last` (`-1` for all).
 */
export const BLOG_LIST_QUERY = defineQuery(`
	*[
		_type == 'blog.post'
		&& ${IN_LANGUAGE}
		&& ($filteredCategory == '' || $filteredCategory in ${localizedRefs('categories')}._id)
	] | order(select($featuredFirst => featured, false) desc, publishDate desc)
	[0..$last] { ${POST_PREVIEW} }
`)

/** The post at `$slug` in `$lang`, else its English version, with the modules of the blog template. */
export const BLOG_POST_QUERY = defineQuery(`
	*[
		_type == 'blog.post'
		&& metadata.slug.current == $slug
		&& ${IN_LANGUAGE}
	] | ${PREFER_LANGUAGE}[0]{
		...,
		body[]{
			...,
			_type == 'image' => {
				${IMAGE_QUERY},
				asset->
			}
		},
		'readTime': length(string::split(pt::text(body), ' ')) / 200,
		'headings': body[style in ['display-hero', 'display-xxl', 'display-xl', 'h1', 'h2', 'h3']]{
			style,
			'text': pt::text(@)
		},
		'categories': (${localizedRefs('categories')})[_type == 'blog.category'],
		authors[]->,
		metadata {
			...,
			'ogimage': image.asset->url + '?w=1200'
		},
		'modules': ${BLOG_POST_MODULES_QUERY},
		${LOCALIZED_FIELDS}
	}
`)

/** Slugs to prerender for `$lang`: its own posts, plus the English ones it renders as fallbacks. */
export const BLOG_POST_SLUGS_QUERY = defineQuery(`
	array::unique(*[
		_type == 'blog.post'
		&& defined(metadata.slug.current)
		&& ${LANGUAGE} in [$lang, '${DEFAULT_LANG}']
	].metadata.slug.current)
`)

/** A post as the blog list queries return it. */
export type BlogPostPreview = BLOG_FRONTPAGE_QUERY_RESULT[number]

/** A post as the post page fetches it. */
export type BlogPost = Sanity.Localized<NonNullable<BLOG_POST_QUERY_RESULT>>

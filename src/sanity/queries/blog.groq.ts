import { defineQuery, groq } from 'next-sanity'
import { IMAGE_QUERY } from '@/sanity/lib/queries'
import { IN_LANGUAGE, localizedRefs } from '@/sanity/lib/localized'
import type { BLOG_FRONTPAGE_QUERY_RESULT } from '@/sanity/sanity.types'

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

/** A post as the blog list queries return it. */
export type BlogPostPreview = BLOG_FRONTPAGE_QUERY_RESULT[number]

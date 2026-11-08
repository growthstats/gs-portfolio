import { defineQuery } from 'next-sanity'

/**
 * Documents in `$scope` matching `$searchQuery`. `$path` is only read by the `path` scope (pass
 * `''` otherwise), and any scope not listed here searches everything.
 */
export const SEARCH_QUERY = defineQuery(`*[
	(
		($scope == 'pages' && _type == 'page')
		|| ($scope == 'path'
			&& _type == 'page'
			&& metadata.slug.current match $path
			&& !(metadata.slug.current in ['404']))
		|| ($scope == 'blog posts' && _type == 'blog.post')
		|| (!($scope in ['pages', 'path', 'blog posts'])
			&& _type in ['page', 'blog.post']
			&& !(metadata.slug.current in ['404']))
	) &&
	[
		body[].children[].text,
		modules[].content[].children[].text,
		modules[].intro[].children[].text,
		title,
		metadata.title,
		metadata.description
	] match $searchQuery
]{
	_id,
	_type,
	title,
	metadata
}`)

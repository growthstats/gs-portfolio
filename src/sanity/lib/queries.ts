import { groq } from 'next-sanity'
import { BLOG_DIR } from '@/lib/env'
import { IN_LANGUAGE, localizedRef } from './localized'

// @sanity-typegen-ignore
export const LINK_QUERY = groq`
	...,
	internal->{
		_type,
		title,
		metadata
	}
`

// @sanity-typegen-ignore
export const IMAGE_QUERY = groq`
	...,
	'lqip': @.asset->metadata.lqip
`

// @sanity-typegen-ignore
const ASSET_IMG_QUERY = groq`
	...,
	image { ${IMAGE_QUERY} }
`

// @sanity-typegen-ignore
export const CTA_QUERY = groq`
	...,
	link{ ${LINK_QUERY} },
	style
`

// @sanity-typegen-ignore
export const REPUTATION_QUERY = groq`
	_type == 'reputation-block' => { reputation-> }
`

const MODULES_BASE_PROJECTION = `
	...,
	ctas[]{
		...,
		link{ ${LINK_QUERY} }
	},
	_type == 'blog-list' => { 'filteredCategory': ${localizedRef('filteredCategory')} },
	_type == 'breadcrumbs' => { crumbs[]{ ${LINK_QUERY} } },
	_type == 'callout' => {
		content[]{
			...,
			${REPUTATION_QUERY}
		}
	},
	_type == 'card-list' => {
		cards[]{
			...,
			ctas[]{ ${CTA_QUERY} }
		}
	},
	_type == 'creative-module' => {
		modules[]{
			...,
			subModules[]{
				...,
				ctas[]{ ${CTA_QUERY} }
			}
		}
	},
	_type == 'hero' => {
		content[]{
			...,
			${REPUTATION_QUERY}
		},
		assets[]{
			...,
			_type == 'img' => { ${ASSET_IMG_QUERY} },
			_type == 'video' => {
				'url': file.asset->url,
				'mimeType': file.asset->mimeType,
				autoplay,
				loop,
				muted,
				poster{ ${ASSET_IMG_QUERY} }
			}
		}
	},
	_type == 'hero.saas' => {
		content[]{
			...,
			${REPUTATION_QUERY}
		},
		assets[]{
			...,
			_type == 'img' => { ${ASSET_IMG_QUERY} },
			_type == 'video' => {
				'url': file.asset->url,
				'mimeType': file.asset->mimeType,
				autoplay,
				loop,
				muted,
				poster{ ${ASSET_IMG_QUERY} }
			}
		}
	},
	_type == 'hero.split' => {
		content[]{
			...,
			${REPUTATION_QUERY}
		},
		assets[]{
			...,
			_type == 'img' => { ${ASSET_IMG_QUERY} },
			_type == 'video' => {
				'url': file.asset->url,
				'mimeType': file.asset->mimeType,
				autoplay,
				loop,
				muted,
				poster{ ${ASSET_IMG_QUERY} }
			}
		}
	},
	_type == 'image-gallery' => {
		rows[]{
			...,
			images[]{ ${IMAGE_QUERY} }
		}
	},
	_type == 'logo-list' => { logos[]-> },
	_type == 'project-list' => {
		projects[]{
			...,
			cta{ ${CTA_QUERY} },
			asset{ ${IMAGE_QUERY} }
		}
	},
	_type == 'person-list' => { people[]-> },
	_type == 'pricing-list' => {
		tiers[]->{
			...,
			ctas[]{ ${CTA_QUERY} }
		}
	},
	_type == 'richtext-module' => {
		content[]{
			...,
			_type == 'image' => { ${IMAGE_QUERY} }
		},
		'headings': select(
			tableOfContents => content[style in ['display-hero', 'display-xxl', 'display-xl', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']]{
				style,
				'text': pt::text(@)
			}
		),
	},
	_type == 'service-details' => {
		features[]{
			...,
			img{ ${IMAGE_QUERY} }
		}
	},
	_type == 'tabbed-content' => {
		tabs[]{
			...,
			ctas[]{ ${CTA_QUERY} }
		}
	},
	_type == 'testimonial.featured' => { testimonial-> },
	_type == 'testimonial-list' => { testimonials[]-> },
	_type == 'faq' => {
		pretitle,
		title,
		description,
		items[]{
		  _key,
		  question,
		  answer,
		  open
		},
		accessibleAccordion,
		generateSchema
	  },
  _type == 'service-list' => {
	  services[]{
		  _key,
		  title,
		  description,
		  layout,
      keywords,
      icon,
      image{ ${IMAGE_QUERY} },
      ctas[]{ ${CTA_QUERY} },
    }
  },
`

// @sanity-typegen-ignore
export const MODULES_QUERY = groq`
	${MODULES_BASE_PROJECTION}
	_type == 'section' => {
		...,
		"module": module[]{
			...select(
				defined(_ref) => {
					"_key": coalesce(_key, _ref->_id),
					..._ref->{
						${MODULES_BASE_PROJECTION}
					}
				},
				{
					${MODULES_BASE_PROJECTION}
				}
			)
		}
	},
`

// @sanity-typegen-ignore
export const GLOBAL_MODULE_PATH_QUERY = groq`
	string::startsWith($slug, path)
	&& select(
		defined(excludePaths) => count(excludePaths[string::startsWith($slug, @)]) == 0,
		true
	)
`

/*
 * A document's modules wrapped in the global modules in `$lang`: the site-wide ones
 * (`path == '*'`) outermost, then those for the document's path. One constant per route
 * rather than a helper taking the path filter: TypeGen only follows literal arguments.
 */

// @sanity-typegen-ignore
const SITE_MODULES_BEFORE = groq`*[_type == 'global-module' && path == '*' && ${IN_LANGUAGE}].before[]{ ${MODULES_QUERY} }`

// @sanity-typegen-ignore
const SITE_MODULES_AFTER = groq`*[_type == 'global-module' && path == '*' && ${IN_LANGUAGE}].after[]{ ${MODULES_QUERY} }`

/** A page's `modules` inside the global modules whose path matches `$slug`. */
// @sanity-typegen-ignore
export const PAGE_MODULES_QUERY = groq`(
	${SITE_MODULES_BEFORE}
	+ *[_type == 'global-module' && path != '*' && ${GLOBAL_MODULE_PATH_QUERY} && ${IN_LANGUAGE}].before[]{ ${MODULES_QUERY} }
	+ modules[]{ ${MODULES_QUERY} }
	+ *[_type == 'global-module' && path != '*' && ${GLOBAL_MODULE_PATH_QUERY} && ${IN_LANGUAGE}].after[]{ ${MODULES_QUERY} }
	+ ${SITE_MODULES_AFTER}
)`

/** The 404 page's `modules`, inside the site-wide global modules only. */
// @sanity-typegen-ignore
export const NOT_FOUND_MODULES_QUERY = groq`(
	${SITE_MODULES_BEFORE}
	+ modules[]{ ${MODULES_QUERY} }
	+ ${SITE_MODULES_AFTER}
)`

/** A blog post has no modules of its own: the blog template's global modules render it. */
// @sanity-typegen-ignore
export const BLOG_POST_MODULES_QUERY = groq`(
	${SITE_MODULES_BEFORE}
	+ *[_type == 'global-module' && path == '${BLOG_DIR}/' && ${IN_LANGUAGE}].before[]{ ${MODULES_QUERY} }
	+ *[_type == 'global-module' && path == '${BLOG_DIR}/' && ${IN_LANGUAGE}].after[]{ ${MODULES_QUERY} }
	+ ${SITE_MODULES_AFTER}
)`

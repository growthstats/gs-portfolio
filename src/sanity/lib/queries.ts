import { fetchSanityLive } from './fetch'
import { groq } from 'next-sanity'
import errors from '@/lib/errors'
import { DEFAULT_LANG, type Lang } from '@/lib/i18n'
import { createSectionModuleQuery } from '@/sanity/queries/modules/section.groq'
import { IN_LANGUAGE, localizedRef, SITE } from './localized'
import { cache } from 'react'

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
const NAVIGATION_QUERY = groq`
	title,
	items[]{
		${LINK_QUERY},
		link{ ${LINK_QUERY} },
		links[]{ ${LINK_QUERY} }
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
		  answer
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
		${createSectionModuleQuery(MODULES_BASE_PROJECTION)}
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

/**
 * `modules` wrapped in the global modules in `$lang`: the site-wide ones (`path == '*'`)
 * outermost, then those matching `pathFilter`.
 */
export function withGlobalModules(modules: string, pathFilter = 'false') {
  const globalModules = (filter: string, position: 'before' | 'after') =>
    groq`*[_type == 'global-module' && ${filter} && ${IN_LANGUAGE}].${position}[]{ ${MODULES_QUERY} }`

  return groq`(
		${globalModules(`path == '*'`, 'before')}
		+ ${globalModules(`path != '*' && ${pathFilter}`, 'before')}
		+ ${modules}
		+ ${globalModules(`path != '*' && ${pathFilter}`, 'after')}
		+ ${globalModules(`path == '*'`, 'after')}
	)`
}

/**
 * Site settings in `lang`: `site-<lang>` when it exists, else `site` (ADR 0002).
 * Menus follow their references to the `lang` translation. Business details
 * for structured data always come from the English `site`: call it without `lang`.
 */
export function getSite(lang: Lang = DEFAULT_LANG) {
  return fetchSite(lang)
}

const fetchSite = cache(async (lang: Lang) => {
  const site = await fetchSanityLive<Sanity.Site>({
    query: groq`
			${SITE}{
				...,
				ctas[]{ ${CTA_QUERY} },
				'headerMenu': ${localizedRef('headerMenu')}{ ${NAVIGATION_QUERY} },
				'footerMenu': ${localizedRef('footerMenu')}{ ${NAVIGATION_QUERY} },
				social->{ ${NAVIGATION_QUERY} },
				'ogimage': ogimage.asset->url
			}
		`,
    params: { lang },
  })

  if (!site) throw new Error(errors.missingSiteSettings)

  return site
})

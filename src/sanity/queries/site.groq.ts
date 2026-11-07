import { defineQuery, groq } from 'next-sanity'
import { CTA_QUERY, LINK_QUERY } from '@/sanity/lib/queries'
import { localizedRef, SITE } from '@/sanity/lib/localized'

// @sanity-typegen-ignore
const NAVIGATION_QUERY = groq`
	title,
	items[]{
		${LINK_QUERY},
		link{ ${LINK_QUERY} },
		links[]{ ${LINK_QUERY} }
	}
`

/** Site settings in `$lang`, with their menus following references to the `$lang` translation. */
export const SITE_QUERY = defineQuery(`
	${SITE}{
		...,
		ctas[]{ ${CTA_QUERY} },
		'headerMenu': ${localizedRef('headerMenu')}{ ${NAVIGATION_QUERY} },
		'footerMenu': ${localizedRef('footerMenu')}{ ${NAVIGATION_QUERY} },
		social->{ ${NAVIGATION_QUERY} },
		'ogimage': ogimage.asset->url
	}
`)

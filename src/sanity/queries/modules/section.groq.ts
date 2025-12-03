import { groq } from 'next-sanity'

export const SECTION_CHILD_MODULE_TYPES = [
  'accordion-list',
  'blog-frontpage',
  'blog-list',
  'blog-post-content',
  'breadcrumbs',
  'callout',
  'card-list',
  'creative-module',
  'custom-html',
  'flag-list',
  'hero',
  'hero.saas',
  'hero.split',
  'logo-list',
  'person-list',
  'pricing-list',
  'richtext-module',
  'schedule-module',
  'search-module',
  'service-list',
  'stat-list',
  'step-list',
  'tabbed-content',
  'testimonial-list',
  'testimonial.featured',
] as const

export const createSectionModuleQuery = (childProjection: string) =>
  groq`
	...,
	"module": module[]{
		...select(
			defined(_ref) => {
				"_key": coalesce(_key, _ref->_id),
				..._ref->{
					${childProjection}
				}
			},
			{
				${childProjection}
			}
		)
	}
`

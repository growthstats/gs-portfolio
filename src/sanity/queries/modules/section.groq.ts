import { groq } from 'next-sanity'

export const SECTION_CHILD_MODULE_TYPES = ['accordion-list'] as const

export const createSectionModuleQuery = (childProjection: string) =>
	groq`
	...,
	"module": select(
		defined(module[0]) => select(
			defined(module[0]._ref) => module[0]->{
				${childProjection}
			},
			module[0]{
				${childProjection}
			}
		),
		null
	)
`

import { defineArrayMember, defineField, defineType } from 'sanity'
import { TbLayoutGridAdd } from 'react-icons/tb'
import { getBlockText } from 'sanitypress-utils'
import { count } from '@/lib/utils'

export default defineType({
	name: 'project-list',
	title: 'Project list',
	icon: TbLayoutGridAdd,
	type: 'object',
	groups: [{ name: 'content', default: true }, { name: 'options' }],
	fields: [
		defineField({
			name: 'options',
			title: 'Module options',
			type: 'module-options',
			group: 'options',
		}),
		defineField({
			name: 'pretitle',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'title',
			type: 'string',
			group: 'content',
		}),
		defineField({
			name: 'intro',
			type: 'array',
			of: [{ type: 'block' }],
			group: 'content',
		}),
		defineField({
			name: 'projects',
			type: 'array',
			of: [
				defineArrayMember({
					type: 'object',
					name: 'project',
					fields: [
						defineField({
							name: 'name',
							type: 'string',
							validation: (Rule) => Rule.required(),
						}),
						defineField({
							name: 'description',
							type: 'array',
							of: [{ type: 'block' }],
						}),
						defineField({
							name: 'asset',
							type: 'image',
							options: {
								hotspot: true,
								metadata: ['lqip'],
							},
							fields: [
								defineField({
									name: 'alt',
									type: 'string',
								}),
								defineField({
									name: 'loading',
									type: 'string',
									options: {
										list: ['lazy', 'eager'],
										layout: 'radio',
									},
									initialValue: 'lazy',
								}),
							],
						}),
						defineField({
							name: 'cta',
							type: 'cta',
							title: 'CTA',
						}),
					],
					preview: {
						select: {
							title: 'name',
							media: 'asset',
							subtitle: 'cta.link.label',
						},
						prepare: ({ title, media, subtitle }) => ({
							title,
							subtitle: subtitle || 'Project',
							media,
						}),
					},
				}),
			],
			group: 'content',
		}),
		defineField({
			name: 'initialProjects',
			title: 'Projects shown by default',
			type: 'number',
			initialValue: 3,
			validation: (Rule) => Rule.min(1),
			group: 'options',
		}),
	],
	preview: {
		select: {
			pretitle: 'pretitle',
			title: 'title',
			intro: 'intro',
			projects: 'projects',
		},
		prepare: ({ pretitle, title, intro, projects }) => ({
			title: title || getBlockText(intro) || pretitle || 'Projects',
			subtitle: count(projects, 'project'),
		}),
	},
})

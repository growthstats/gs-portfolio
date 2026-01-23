import { defineArrayMember, defineField, defineType } from 'sanity'
import { TbLayoutGridAdd } from 'react-icons/tb'
import { count } from '@/lib/utils'
import { richTextBlock } from '../fragments'

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
              of: [richTextBlock],
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
              hidden: ({ parent }) => !parent?.ctaEnabled,
            }),
            defineField({
              name: 'ctaEnabled',
              title: 'Enable CTA',
              type: 'boolean',
              initialValue: false,
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
      projects: 'projects',
    },
    prepare: ({ projects }) => ({
      title: 'Projects',
      subtitle: count(projects, 'project'),
    }),
  },
})

import { defineArrayMember, defineField, defineType } from 'sanity'
import { RiServiceLine } from 'react-icons/ri'
import { OPTIONAL_LUCIDE_ICON_OPTIONS } from '../utils/lucideIconOptions'

export default defineType({
  name: 'service-list',
  title: 'Service List',
  type: 'object',
  icon: RiServiceLine,
  fields: [
    defineField({
      name: 'options',
      title: 'Options',
      type: 'module-options',
    }),
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'serviceItem',
          title: 'Service Item',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'array',
              of: [{ type: 'block' }],
            }),
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Lucide icon name',
              options: {
                list: OPTIONAL_LUCIDE_ICON_OPTIONS,
                layout: 'dropdown',
              },
              validation: (Rule) =>
                Rule.custom((value) => {
                  if (!value) return true
                  return OPTIONAL_LUCIDE_ICON_OPTIONS.some((option) => option.value === value)
                    ? true
                    : 'Select a valid Lucide icon'
                }),
            }),
            defineField({
              name: 'image',
              title: 'Image (large/hero image)',
              type: 'image',
              options: { hotspot: true, metadata: ['lqip'] },
            }),
            defineField({
              name: 'layout',
              title: 'Layout Variant',
              type: 'string',
              options: {
                list: [
                  { title: 'Text left — Icon right', value: 'text-left' },
                  { title: 'Text right — Icon left', value: 'text-right' },
                ],
                layout: 'radio',
              },
              initialValue: 'text-left',
            }),
            defineField({
              name: 'keywords',
              title: 'Keywords / Tags',
              type: 'array',
              of: [{ type: 'string' }],
              options: {
                layout: 'tags',
              },
            }),
            defineField({
              name: 'ctas',
              title: 'CTAs',
              type: 'array',
              of: [{ type: 'cta' }],
            }),
            defineField({
              name: 'accentIconSize',
              title: 'Accent Icon Size (px)',
              type: 'number',
              initialValue: 120,
            }),
            defineField({
              name: 'accentBg',
              title: 'Accent background toggle',
              type: 'boolean',
              initialValue: true,
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'pretitle',
    },
  },
})

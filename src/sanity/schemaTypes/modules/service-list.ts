import { defineArrayMember, defineField, defineType } from 'sanity'
import { RiServiceLine } from 'react-icons/ri'

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
      name: 'pretitle',
      title: 'Pretitle',
      type: 'string',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
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
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [defineArrayMember({ type: 'service.item' })],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'pretitle',
    },
  },
})

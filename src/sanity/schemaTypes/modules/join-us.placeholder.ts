import { defineField, defineType } from 'sanity'
import { AddUserIcon } from '@sanity/icons'

export default defineType({
  name: 'join-us.placeholder',
  title: 'Join Us Placeholder',
  type: 'object',
  icon: AddUserIcon,
  fields: [
    defineField({
      name: 'options',
      title: 'Options',
      type: 'module-options',
    }),
  ],
  preview: {
    select: {
      title: 'options.title',
    },
    prepare({ title }) {
      return {
        title: title || 'Join Us Placeholder',
        subtitle: 'Module: join-us.placeholder',
        media: AddUserIcon,
      }
    },
  },
})

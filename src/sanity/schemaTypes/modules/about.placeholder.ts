import { defineField, defineType } from 'sanity'
import { InfoOutlineIcon } from '@sanity/icons'

export default defineType({
  name: 'about.placeholder',
  title: 'About Placeholder',
  type: 'object',
  icon: InfoOutlineIcon,
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
        title: title || 'About Placeholder',
        subtitle: 'Module: about.placeholder',
        media: InfoOutlineIcon,
      }
    },
  },
})

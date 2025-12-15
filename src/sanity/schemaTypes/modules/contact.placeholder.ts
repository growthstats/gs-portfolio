import { defineField, defineType } from 'sanity'
import { InfoOutlineIcon } from '@sanity/icons'

export default defineType({
  name: 'contact.placeholder',
  title: 'Contact Us Placeholder',
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
        title: title || 'Contact Us Placeholder',
        subtitle: 'Module: contact.placeholder',
        media: InfoOutlineIcon,
      }
    },
  },
})

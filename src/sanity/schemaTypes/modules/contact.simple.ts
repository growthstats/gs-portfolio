import { defineField, defineType } from 'sanity'
import { TfiEmail } from 'react-icons/tfi'
import { getBlockText } from 'sanitypress-utils'
import { richTextBlock } from '../fragments'

export default defineType({
  name: 'contact.simple',
  title: 'Contact (Simple)',
  icon: TfiEmail,
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
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
    }),

    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'array',
      of: [richTextBlock],
      group: 'content',
    }),

    defineField({
      name: 'ctas',
      title: 'Call-to-actions',
      type: 'array',
      of: [{ type: 'cta' }],
      group: 'content',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      excerpt: 'excerpt',
    },
    prepare: ({ title, excerpt }) => ({
      title: title || getBlockText(excerpt) || 'Contact (Simple)',
      subtitle: 'Contact (Simple)',
    }),
  },
})

import { defineField, defineType } from 'sanity'
import { CommentIcon } from '@sanity/icons'

export default defineType({
  name: 'lets-talk-placeholder',
  title: "Let's Talk Placeholder",
  type: 'object',
  icon: CommentIcon,
  fields: [
    defineField({
      name: 'options',
      title: 'Options',
      type: 'module-options',
    }),
  ],
  preview: {
    prepare: () => ({
      title: "Let's Talk Placeholder",
      subtitle: 'Module: lets-talk-placeholder',
      media: CommentIcon,
    }),
  },
})

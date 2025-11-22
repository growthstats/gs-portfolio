import { defineField, defineType } from 'sanity'
import { UsersIcon } from '@sanity/icons'

export default defineType({
  name: 'team.placeholder',
  title: 'Team Placeholder',
  type: 'object',
  icon: UsersIcon,
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
        title: title || 'Team Placeholder',
        subtitle: 'Module: team.placeholder',
        media: UsersIcon,
      }
    },
  },
})

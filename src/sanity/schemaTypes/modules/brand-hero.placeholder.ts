import { defineField, defineType } from 'sanity'
import { TbBrandDatabricks } from 'react-icons/tb'

export default defineType({
  name: 'brand-hero.placeholder',
  title: 'Brand Hero (Placeholder)',
  type: 'object',
  icon: TbBrandDatabricks,
  fields: [
    defineField({
      name: 'options',
      title: 'Module options',
      type: 'module-options',
      group: 'options',
    }),
  ],
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'options', title: 'Options' },
  ],
  preview: {
    prepare: () => ({
      title: 'Brand Hero Placeholder',
      subtitle: 'Two-column layout',
    }),
  },
})

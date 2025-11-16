import { defineField, defineType } from 'sanity'
import { VscLayout } from 'react-icons/vsc'

export default defineType({
  name: 'section',
  title: 'Section',
  type: 'object',
  icon: VscLayout,
  groups: [{ name: 'content', default: true }, { name: 'options' }],
  fields: [
    defineField({
      name: 'options',
      title: 'Module options',
      type: 'module-options',
      group: 'options',
    }),
    defineField({
      name: 'headingBadge',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'icon',
      type: 'string',
      group: 'content',
      description: 'Lucide icon name (e.g. Sparkles).',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          return /^[A-Z][A-Za-z0-9]+$/.test(value)
            ? true
            : 'Use a valid Lucide icon name (e.g. Sparkles)'
        }),
    }),
    defineField({
      name: 'pretitle',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'title',
      type: 'string',
      group: 'content',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      type: 'text',
      group: 'content',
    }),
    defineField({
      name: 'module',
      type: 'array',
      group: 'content',
      of: [
        { type: 'accordion-list' },
        { type: 'blog-frontpage' },
        { type: 'blog-list' },
        { type: 'blog-post-content' },
        { type: 'breadcrumbs' },
        { type: 'callout' },
        { type: 'card-list' },
        { type: 'creative-module' },
        { type: 'custom-html' },
        { type: 'faq' },
        { type: 'flag-list' },
        { type: 'hero' },
        { type: 'hero.saas' },
        { type: 'hero.split' },
        { type: 'logo-list' },
        { type: 'person-list' },
        { type: 'pricing-list' },
        { type: 'richtext-module' },
        { type: 'schedule-module' },
        { type: 'search-module' },
        { type: 'stat-list' },
        { type: 'step-list' },
        { type: 'tabbed-content' },
        { type: 'testimonial-list' },
        { type: 'testimonial.featured' },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      pretitle: 'pretitle',
      module: 'module',
    },
    prepare: ({ title, pretitle, module }) => {
      const childModule = Array.isArray(module) ? module[0] : null
      const childLabel =
        childModule?._type === 'reference'
          ? 'Referenced module'
          : childModule?._type?.replace('.', ' › ')

      return {
        title: title || 'Section',
        subtitle: [pretitle, childLabel || 'Select a module'].filter(Boolean).join(' · '),
      }
    },
  },
})

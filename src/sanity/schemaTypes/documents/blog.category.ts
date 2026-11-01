import { defineField, defineType } from 'sanity'
import { VscTag } from 'react-icons/vsc'
import { isUniquePerLanguage, languageField, withLanguage } from '../utils/language'

export default defineType({
  name: 'blog.category',
  title: 'Blog category',
  type: 'document',
  icon: VscTag,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {
        source: 'title',
        isUnique: isUniquePerLanguage,
      },
      validation: (Rule) => Rule.required(),
    }),
    languageField,
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      language: 'language',
    },
    prepare: ({ title, slug, language }) => ({
      title,
      subtitle: withLanguage(language, slug),
    }),
  },
})

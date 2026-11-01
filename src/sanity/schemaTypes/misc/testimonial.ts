import { defineField, defineType } from 'sanity'
import { GrBlockQuote } from 'react-icons/gr'
import { getBlockText } from 'sanitypress-utils'
import { richTextBlock } from '../fragments'
import { languageField, withLanguage } from '../utils/language'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  icon: GrBlockQuote,
  type: 'document',
  fields: [
    defineField({
      name: 'content',
      type: 'array',
      of: [richTextBlock],
    }),
    defineField({
      name: 'source',
      type: 'url',
    }),
    defineField({
      name: 'author',
      type: 'object',
      fields: [
        defineField({
          name: 'name',
          type: 'string',
        }),
        defineField({
          name: 'title',
          type: 'string',
        }),
        defineField({
          name: 'image',
          type: 'image',
          options: {
            hotspot: true,
          },
        }),
      ],
    }),
    languageField,
  ],
  preview: {
    select: {
      content: 'content',
      author: 'author',
      language: 'language',
    },
    prepare: ({ content, author, language }) => ({
      title: author?.name || author?.title || 'No author',
      subtitle: withLanguage(language, getBlockText(content)),
      media: author?.image,
    }),
  },
})

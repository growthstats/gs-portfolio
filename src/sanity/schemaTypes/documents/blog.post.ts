import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscEdit } from 'react-icons/vsc'
import { imageBlock, admonition, richTextBlock } from '../fragments'

export default defineType({
  name: 'blog.post',
  title: 'Blog post',
  icon: VscEdit,
  type: 'document',
  groups: [{ name: 'content', default: true }, { name: 'options' }, { name: 'metadata' }],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        richTextBlock,
        imageBlock,
        admonition,
        defineArrayMember({
          title: 'Code block',
          type: 'code',
          options: {
            withFilename: true,
          },
        }),
        { type: 'custom-html' },
      ],
      group: 'content',
    }),
    defineField({
      name: 'categories',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'blog.category' }],
        },
      ],
      group: 'content',
    }),
    defineField({
      name: 'authors',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{ type: 'person' }],
        },
      ],
      group: 'content',
    }),
    defineField({
      name: 'publishDate',
      type: 'date',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'featured',
      type: 'boolean',
      group: 'options',
      initialValue: false,
    }),
    defineField({
      name: 'hideTableOfContents',
      type: 'boolean',
      group: 'options',
      initialValue: false,
    }),
    defineField({
      name: 'metadata',
      type: 'metadata',
      group: 'metadata',
    }),
    defineField({
      name: 'language',
      type: 'string',
      readOnly: true,
      hidden: true,
    }),
  ],
  preview: {
    select: {
      featured: 'featured',
      title: 'title',
      metaTitle: 'metadata.title',
      publishDate: 'publishDate',
      language: 'language',
      image: 'metadata.image',
    },
    prepare: ({ featured, title, metaTitle, publishDate, image, language }) => ({
      title: [featured && '★', title || metaTitle].filter(Boolean).join(' '),
      subtitle: [language && `[${language}] `, publishDate].filter(Boolean).join(''),
      media: image,
    }),
  },
  orderings: [
    {
      title: 'Date',
      name: 'date',
      by: [{ field: 'publishDate', direction: 'desc' }],
    },
    {
      title: 'Title',
      name: 'title',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})

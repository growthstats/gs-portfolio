import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscListOrdered } from 'react-icons/vsc'
import { getBlockText } from 'sanitypress-utils'
import { richTextBlock } from '../fragments'

export default defineType({
  name: 'step-list',
  title: 'Step list',
  icon: VscListOrdered,
  type: 'object',
  fields: [
    defineField({
      name: 'pretitle',
      type: 'string',
    }),
    defineField({
      name: 'intro',
      type: 'array',
      of: [richTextBlock],
    }),
    defineField({
      name: 'steps',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'step',
          icon: VscListOrdered,
          fields: [
            defineField({
              name: 'content',
              type: 'array',
              of: [richTextBlock],
            }),
          ],
          preview: {
            select: {
              content: 'content',
            },
            prepare: ({ content }) => ({
              title: getBlockText(content),
            }),
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      intro: 'intro',
    },
    prepare: ({ intro }) => ({
      title: getBlockText(intro),
      subtitle: 'Step list',
    }),
  },
})

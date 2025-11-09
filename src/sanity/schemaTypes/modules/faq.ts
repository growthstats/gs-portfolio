
import { defineArrayMember, defineField, defineType } from 'sanity'
import { MdQuestionAnswer } from 'react-icons/md'
import { getBlockText } from 'sanitypress-utils'
import { imageBlock } from '../fragments'

export default defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'object',
  icon: MdQuestionAnswer,
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'options', title: 'Options' },
  ],
  fields: [
    defineField({
      name: 'options',
      title: 'Module options',
      type: 'module-options',
      group: 'options',
    }),
    defineField({
      name: 'pretitle',
      title: 'Pretitle',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'content',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
      group: 'content',
    }),
    defineField({
      name: 'items',
      title: 'FAQ items',
      type: 'array',
      group: 'content',
      of: [
        defineArrayMember({
          name: 'faqItem',
          title: 'FAQ Item',
          type: 'object',
          fields: [
            defineField({
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'answer',
              title: 'Answer',
              type: 'array',
              of: [
                { type: 'block' },
                imageBlock,
                defineArrayMember({
                  title: 'Code block',
                  type: 'code',
                  options: { withFilename: true },
                }),
                { type: 'custom-html' },
              ],
            }),
            defineField({
              name: 'open',
              title: 'Initially open',
              type: 'boolean',
              initialValue: false,
            }),
          ],
          preview: {
            select: {
              title: 'question',
              content: 'answer',
            },
            prepare: ({ title, content }) => ({
              title,
              subtitle: getBlockText(content),
            }),
          },
        }),
      ],
    }),
    defineField({
      name: 'accessibleAccordion',
      title: 'Accessible accordion',
      type: 'boolean',
      initialValue: true,
      description:
        'Enable ARIA attributes and single-tab focus pattern (recommended).',
      group: 'options',
    }),
    defineField({
      name: 'generateSchema',
      title: 'Generate schema.org FAQPage markup',
      type: 'boolean',
      initialValue: true,
      description: 'Add JSON-LD for FAQPage (SEO).',
      group: 'options',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      description: 'description',
    },
    prepare: ({ title, description }) => ({
      title: title || 'FAQ',
      subtitle: getBlockText(description) || 'Frequently Asked Questions',
    }),
  },
})


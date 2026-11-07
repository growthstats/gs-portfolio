import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscFileMedia } from 'react-icons/vsc'
import { getBlockText } from 'sanitypress-utils'
import { richTextBlock } from '../fragments'

export default defineType({
  name: 'image-gallery',
  title: 'Image gallery',
  icon: VscFileMedia,
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
      name: 'pretitle',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'intro',
      type: 'array',
      of: [richTextBlock],
      group: 'content',
    }),
    defineField({
      name: 'rows',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'row',
          type: 'object',
          icon: VscFileMedia,
          fields: [
            defineField({
              name: 'images',
              type: 'array',
              of: [
                defineArrayMember({
                  type: 'image',
                  options: { hotspot: true, metadata: ['lqip'] },
                  fields: [
                    defineField({
                      name: 'alt',
                      type: 'string',
                      validation: (Rule) => Rule.required(),
                    }),
                    defineField({
                      name: 'caption',
                      type: 'string',
                    }),
                  ],
                }),
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: { images: 'images' },
            prepare: ({ images }) => ({
              title: `${images?.length ?? 0} images`,
              subtitle: 'Row',
              media: images?.[0],
            }),
          },
        }),
      ],
      group: 'content',
    }),
    defineField({
      name: 'autoScroll',
      type: 'boolean',
      description: 'Add enough images to fill a wide screen, or the loop shows a gap',
      initialValue: false,
      group: 'options',
    }),
    defineField({
      name: 'duration',
      type: 'number',
      description: 'Duration in seconds for a complete cycle',
      initialValue: 20,
      hidden: ({ parent }) => !parent?.autoScroll,
      group: 'options',
    }),
    defineField({
      name: 'alternateScrollDirection',
      title: 'Alternate scroll direction',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => !parent?.autoScroll,
      group: 'options',
    }),
  ],
  preview: {
    select: {
      pretitle: 'pretitle',
      intro: 'intro',
      media: 'rows.0.images.0',
    },
    prepare: ({ pretitle, intro, media }) => ({
      title: getBlockText(intro) || pretitle,
      subtitle: 'Image gallery',
      media,
    }),
  },
})

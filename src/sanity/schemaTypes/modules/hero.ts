import { defineArrayMember, defineField, defineType } from 'sanity'
import { TfiLayoutCtaCenter } from 'react-icons/tfi'
import { reputationBlock } from '../misc/reputation'
import { alignItems, textAlign } from 'sanitypress-utils'
import { getBlockText } from 'sanitypress-utils'
import { richTextBlock } from '../fragments'

export default defineType({
  name: 'hero',
  title: 'Hero',
  icon: TfiLayoutCtaCenter,
  type: 'object',
  groups: [{ name: 'content', default: true }, { name: 'asset' }, { name: 'options' }],
  fieldsets: [
    { name: 'alignment', options: { columns: 2 } },
    { name: 'image', options: { columns: 2 } },
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
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'content',
      type: 'array',
      of: [richTextBlock, { type: 'custom-html' }, reputationBlock],
      group: 'content',
    }),
    defineField({
      name: 'ctas',
      title: 'Call-to-actions',
      type: 'array',
      of: [{ type: 'cta' }],
      group: 'content',
    }),
    defineField({
      name: 'assets',
      title: 'Assets',
      type: 'array',
      of: [
        { type: 'img' },
        defineArrayMember({
          name: 'video',
          title: 'Video',
          type: 'object',
          fields: [
            defineField({
              name: 'file',
              title: 'Video file',
              type: 'file',
              options: { accept: 'video/*' },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'poster',
              title: 'Poster image',
              type: 'img',
              description: 'Optional fallback image while the video loads.',
            }),
            defineField({
              name: 'autoplay',
              title: 'Autoplay',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'loop',
              title: 'Loop',
              type: 'boolean',
              initialValue: true,
            }),
            defineField({
              name: 'muted',
              title: 'Muted',
              type: 'boolean',
              initialValue: true,
            }),
          ],
          preview: {
            select: {
              title: 'file.asset.originalFilename',
              media: 'poster.image',
            },
            prepare: ({ title, media }) => ({
              title: title || 'Video asset',
              subtitle: 'Background video',
              media,
            }),
          },
        }),
      ],
      validation: (Rule) => Rule.max(1),
      group: 'asset',
    }),
    defineField({
      ...alignItems,
      fieldset: 'alignment',
      group: 'options',
    }),
    defineField({
      ...textAlign,
      fieldset: 'alignment',
      group: 'options',
    }),
    defineField({
      name: 'overlayHeader',
      title: 'Overlay header',
      type: 'boolean',
      initialValue: false,
      description:
        'If enabled, pull the hero up by the header height so the header sits above the background asset.',
      group: 'options',
    }),
  ],
  preview: {
    select: {
      content: 'content',
      media: 'assets.0.image',
      poster: 'assets.0.poster.image',
    },
    prepare: ({ content, media, poster }) => {
      const visual = media || poster
      return {
        title: getBlockText(content),
        subtitle: 'Hero',
        media: visual,
      }
    },
  },
})

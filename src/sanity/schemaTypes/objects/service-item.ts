import { defineField, defineType } from 'sanity'
import { HiOutlineSparkles } from 'react-icons/hi' // optional icon

export default defineType({
  name: 'service.item',
  title: 'Service Item',
  type: 'object',
  icon: HiOutlineSparkles,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pretitle',
      title: 'Pretitle (small label)',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'icon',
      title: 'Icon (SVG or image reference)',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'image',
      title: 'Image (large/hero image)',
      type: 'image-block',
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords / Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
    }),
    defineField({
      name: 'ctas',
      title: 'CTAs',
      type: 'array',
      of: [{ type: 'cta' }],
    }),
    defineField({
      name: 'bookCallCta',
      title: 'Book a Call CTA',
      type: 'cta',
    }),
    defineField({
      name: 'accentIconSize',
      title: 'Accent Icon Size (px)',
      type: 'number',
      initialValue: 120,
    }),
    defineField({
      name: 'accentBg',
      title: 'Accent background toggle',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'pretitle',
      media: 'icon',
    },
  },
})

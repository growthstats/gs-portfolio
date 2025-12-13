import { IoIosImage } from 'react-icons/io'
import { LuServer } from 'react-icons/lu'
import { defineArrayMember, defineField, defineType } from 'sanity'

export default defineType({
  name: 'service-details',
  title: 'Service Details',
  icon: LuServer,
  type: 'object',
  description: 'Feature list for a specific service page.',
  fields: [
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      description: 'A list of key features for the service.',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            {
              name: 'name',
              type: 'string',
              title: 'Feature Name',
              description: 'The name of the feature.',
              validation: (Rule) => Rule.required().error('A name is required for each feature.'),
            },
            {
              name: 'description',
              type: 'text',
              title: 'Feature Description',
              description: 'A brief description of the feature.',
              rows: 3,
            },
            {
              name: 'img',
              type: 'image',
              title: 'Feature Image',
              description:
                'An image representing the feature. Use the Sanity DAM for asset management.',
              icon: IoIosImage,
              options: { hotspot: true },
              fields: [
                defineField({
                  name: 'caption',
                  type: 'text',
                  title: 'Image Caption',
                  description: 'A caption for the image.',
                  rows: 2,
                }),
                defineField({
                  name: 'alt',
                  type: 'string',
                  title: 'Alt Text',
                  description: 'Alternative text for the image for accessibility and SEO.',
                }),
                defineField({
                  name: 'source',
                  type: 'url',
                  title: 'Image Source',
                  description: 'The original source or credit for the image.',
                }),
                defineField({
                  name: 'loading',
                  type: 'string',
                  title: 'Loading Behavior',
                  description: 'Determines when the image should load.',
                  options: {
                    list: [
                      { title: 'Lazy', value: 'lazy' },
                      { title: 'Eager', value: 'eager' },
                    ],
                  },
                  initialValue: 'lazy',
                }),
              ],
            },
          ],
          preview: {
            select: {
              title: 'name',
              subtitle: 'description',
              media: 'img',
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title,
                subtitle: subtitle,
                media,
              }
            },
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: 'features.0.name',
      subtitle: 'features.0.description',
      media: 'features.0.img',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Service details',
        subtitle: subtitle || 'Feature list',
        media: media || IoIosImage,
      }
    },
  },
})

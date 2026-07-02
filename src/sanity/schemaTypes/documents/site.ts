import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'site',
  title: 'Site settings',
  type: 'document',
  groups: [
    { name: 'branding', default: true },
    { name: 'info' },
    { name: 'navigation' },
    { name: 'business' },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'branding',
    }),
    defineField({
      name: 'blurb',
      description: 'Content displayed in the footer',
      type: 'array',
      of: [{ type: 'block', lists: [] }],
      group: 'branding',
    }),
    defineField({
      name: 'logo',
      type: 'logo',
      group: 'branding',
    }),
    defineField({
      name: 'announcements',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'announcement' }] }],
      group: 'info',
    }),
    defineField({
      name: 'copyright',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
        },
      ],
      group: 'info',
    }),
    defineField({
      name: 'ctas',
      title: 'Call-to-action (global)',
      description: 'Typically used in the header and/or footer.',
      type: 'array',
      of: [{ type: 'cta' }],
      group: 'navigation',
    }),
    defineField({
      name: 'headerMenu',
      type: 'reference',
      to: [{ type: 'navigation' }],
      group: 'navigation',
    }),
    defineField({
      name: 'footerMenu',
      type: 'reference',
      to: [{ type: 'navigation' }],
      group: 'navigation',
    }),
    defineField({
      name: 'social',
      type: 'reference',
      to: [{ type: 'navigation' }],
      group: 'navigation',
    }),
    defineField({
      name: 'localBusiness',
      title: 'Local business (structured data)',
      description:
        'Powers LocalBusiness schema.org markup for local SEO. Leave blank if not a physical-location business — nothing is rendered when empty.',
      type: 'object',
      group: 'business',
      options: { collapsible: true, collapsed: true },
      fields: [
        defineField({ name: 'telephone', type: 'string' }),
        defineField({ name: 'email', type: 'string' }),
        defineField({
          name: 'priceRange',
          type: 'string',
          description: 'e.g. "$$" or "₹₹"',
        }),
        defineField({
          name: 'streetAddress',
          title: 'Street address',
          type: 'string',
        }),
        defineField({
          name: 'addressLocality',
          title: 'City / locality',
          type: 'string',
        }),
        defineField({
          name: 'addressRegion',
          title: 'State / region',
          type: 'string',
        }),
        defineField({ name: 'postalCode', type: 'string' }),
        defineField({
          name: 'addressCountry',
          title: 'Country code',
          type: 'string',
          description: 'ISO 3166-1 alpha-2, e.g. "IN", "US"',
        }),
        defineField({
          name: 'geo',
          title: 'Geo coordinates',
          type: 'object',
          options: { columns: 2 },
          fields: [
            defineField({ name: 'latitude', type: 'number' }),
            defineField({ name: 'longitude', type: 'number' }),
          ],
        }),
        defineField({
          name: 'openingHours',
          title: 'Opening hours',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                defineField({
                  name: 'days',
                  type: 'array',
                  of: [{ type: 'string' }],
                  options: {
                    list: [
                      'Monday',
                      'Tuesday',
                      'Wednesday',
                      'Thursday',
                      'Friday',
                      'Saturday',
                      'Sunday',
                    ],
                  },
                }),
                defineField({
                  name: 'opens',
                  type: 'string',
                  description: '24h format, e.g. "09:00"',
                }),
                defineField({
                  name: 'closes',
                  type: 'string',
                  description: '24h format, e.g. "18:00"',
                }),
              ],
              preview: {
                select: { days: 'days', opens: 'opens', closes: 'closes' },
                prepare: ({ days, opens, closes }) => ({
                  title: (days || []).join(', '),
                  subtitle: [opens, closes].filter(Boolean).join(' – '),
                }),
              },
            },
          ],
        }),
      ],
    }),
  ],
  preview: {
    prepare: () => ({
      title: 'Site settings',
    }),
  },
})

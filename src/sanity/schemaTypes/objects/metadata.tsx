import { defineField, defineType } from 'sanity'
import { CharacterCount } from 'sanitypress-utils'
import PreviewOG from '@/sanity/ui/PreviewOG'

export default defineType({
  name: 'metadata',
  title: 'Metadata',
  description: 'For search engines',
  type: 'object',
  fields: [
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'URL path or permalink',
      options: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        source: (doc: any) => doc.title || doc.metadata.title,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      type: 'string',
      description: 'The SEO Meta Title, ideally between 50 and 60 characters.',
      validation: (Rule) =>
        Rule.max(60).warning('The SEO Meta Title should be between 50 and 60 characters.'),
      components: {
        input: (props) => (
          <CharacterCount max={60} {...props}>
            <PreviewOG title={props.elementProps.value} />
          </CharacterCount>
        ),
      },
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      description: 'The SEO Meta Description, ideally between 50 and 160 characters.',
      validation: (Rule) =>
        Rule.max(160).warning('The SEO Meta Description should be between 50 and 160 characters.'),
      components: {
        input: (props) => <CharacterCount as="textarea" max={160} {...props} />,
      },
    }),
    defineField({
      name: 'image',
      description: 'Used for social sharing previews',
      type: 'image',
      options: {
        hotspot: true,
        metadata: ['lqip'],
      },
    }),
    defineField({
      name: 'noIndex',
      description: 'Prevent search engines from indexing this page',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})

import { defineArrayMember, defineField, defineType } from 'sanity'
import { VscTable } from 'react-icons/vsc'

// The shape (`table` > `rows` > `row` > `cells` > `cell` > `value`) and the `headerRows` name are
// what the Studio's native table editing expects (`portableText.plugins.table` in sanity.config.ts).
export default defineType({
  name: 'table',
  type: 'object',
  icon: VscTable,
  fields: [
    defineField({
      name: 'caption',
      type: 'string',
      description: 'Shown below the table, and read out to screen readers before it.',
    }),
    defineField({
      name: 'headerRows',
      type: 'number',
      initialValue: 1,
      hidden: true,
    }),
    defineField({
      name: 'rows',
      type: 'array',
      of: [
        defineArrayMember({
          name: 'row',
          type: 'object',
          fields: [
            defineField({
              name: 'cells',
              type: 'array',
              of: [
                defineArrayMember({
                  name: 'cell',
                  type: 'object',
                  fields: [
                    defineField({
                      name: 'value',
                      type: 'array',
                      of: [
                        defineArrayMember({
                          type: 'block',
                          styles: [{ title: 'Normal', value: 'normal' }],
                        }),
                      ],
                    }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      caption: 'caption',
      rows: 'rows',
    },
    prepare: ({ caption, rows }) => {
      const rowCount = rows?.length ?? 0
      const colCount = rows?.[0]?.cells?.length ?? 0

      return {
        title: caption || 'Table',
        subtitle: rowCount ? `${rowCount} × ${colCount}` : 'Empty table',
      }
    },
  },
})

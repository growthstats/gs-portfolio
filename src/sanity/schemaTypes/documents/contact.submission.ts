import { defineField, defineType } from 'sanity'
import { VscMail } from 'react-icons/vsc'

/**
 * Contact form leads, written by `POST /api/contact`.
 * Stored with `_id: "contact-submission.<uuid>"` — IDs containing a dot are
 * only readable with a token, which keeps leads private in our public dataset.
 */
export default defineType({
  name: 'contact.submission',
  title: 'Contact submission',
  type: 'document',
  icon: VscMail,
  fields: [
    defineField({
      name: 'status',
      type: 'string',
      initialValue: 'new',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Contacted', value: 'contacted' },
          { title: 'Closed', value: 'closed' },
          { title: 'Spam', value: 'spam' },
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
    }),
    defineField({ name: 'name', type: 'string', readOnly: true }),
    defineField({ name: 'email', type: 'string', readOnly: true }),
    defineField({ name: 'phone', type: 'string', readOnly: true }),
    defineField({ name: 'message', type: 'text', readOnly: true }),
    defineField({ name: 'submittedAt', type: 'datetime', readOnly: true }),
    defineField({
      name: 'sourcePath',
      title: 'Submitted from',
      type: 'string',
      readOnly: true,
    }),
    defineField({
      name: 'notified',
      title: 'Email notification sent',
      type: 'boolean',
      readOnly: true,
    }),
  ],
  orderings: [
    {
      title: 'Newest first',
      name: 'submittedAtDesc',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      name: 'name',
      email: 'email',
      status: 'status',
      submittedAt: 'submittedAt',
    },
    prepare: ({ name, email, status, submittedAt }) => ({
      title: name || email,
      subtitle: [
        status?.toUpperCase(),
        submittedAt && new Date(submittedAt).toLocaleString('en-IN'),
        email,
      ]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})

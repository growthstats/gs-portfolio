import { defineArrayMember } from 'sanity'

export default defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'Display Hero', value: 'display-hero' },
    { title: 'Display XXL', value: 'display-xxl' },
    { title: 'Display XL', value: 'display-xl' },
    { title: 'H1', value: 'h1' },
    { title: 'H2', value: 'h2' },
    { title: 'H3', value: 'h3' },
    { title: 'H4', value: 'h4' },
    { title: 'H5', value: 'h5' },
    { title: 'H6', value: 'h6' },
    { title: 'Blockquote', value: 'blockquote' },
  ],
})

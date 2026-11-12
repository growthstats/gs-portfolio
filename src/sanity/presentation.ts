'use client'

import { defineLocations, presentationTool } from 'sanity/presentation'
import { BLOG_DIR } from '@/lib/env'
import { documentHref, mainDocuments } from './presentationResolve'

export const presentation = presentationTool({
  name: 'editor',
  title: 'Editor',
  previewUrl: {
    previewMode: {
      enable: '/api/draft-mode/enable',
    },
  },
  resolve: {
    mainDocuments,
    locations: {
      site: defineLocations({
        select: { language: 'language' },
        resolve: (doc) => ({
          message: 'This document is used on all pages',
          locations: [{ title: 'Home', href: documentHref('/', doc?.language) }],
        }),
      }),
      page: defineLocations({
        select: {
          title: 'title',
          metaTitle: 'metadata.title',
          slug: 'metadata.slug.current',
          language: 'language',
        },
        resolve: (doc) => ({
          locations: [
            {
              title: doc?.title || doc?.metaTitle || 'Untitled',
              href: documentHref(
                doc?.slug && doc.slug !== 'index' ? `/${doc.slug}` : '/',
                doc?.language,
              ),
            },
          ],
        }),
      }),
      'blog.post': defineLocations({
        select: {
          title: 'title',
          metaTitle: 'metadata.title',
          slug: 'metadata.slug.current',
          language: 'language',
        },
        resolve: (doc) => ({
          locations: [
            {
              title: doc?.title || doc?.metaTitle || 'Untitled',
              href: documentHref(
                doc?.slug ? `/${BLOG_DIR}/${doc.slug}` : `/${BLOG_DIR}`,
                doc?.language,
              ),
            },
          ],
        }),
      }),
      'blog.category': defineLocations({
        select: {
          title: 'title',
          slug: 'slug.current',
          language: 'language',
        },
        resolve: (doc) => ({
          locations: [
            {
              title: doc?.title || 'Untitled',
              href:
                documentHref(`/${BLOG_DIR}`, doc?.language) +
                (doc?.slug ? `?category=${doc.slug}` : ''),
            },
          ],
        }),
      }),
    },
  },
})

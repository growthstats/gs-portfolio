/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SanityDocument } from 'next-sanity'

/*
 * Hand-written types for the one query TypeGen doesn't type yet: the announcements query. Everything
 * else uses the generated types in `src/sanity/sanity.types.ts`; delete these when it moves over.
 */
declare global {
  namespace Sanity {
    interface Announcement extends SanityDocument {
      content: any
      cta?: Link
      start?: string
      end?: string
    }

    interface Link {
      readonly _type: 'link'
      _key: string
      label: string
      type: 'internal' | 'external'
      internal?: {
        _type: string
        title?: string
        metadata?: { slug?: { current?: string } }
      }
      external?: string
      params?: string
    }

    interface ModuleOptions {
      hidden?: boolean
      uid?: string
    }

    interface Module<T = string> {
      _type: T
      _key: string
      options?: ModuleOptions
    }
  }
}

export {}

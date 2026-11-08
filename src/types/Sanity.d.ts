/* eslint-disable @typescript-eslint/no-explicit-any */
import type { SanityDocument } from 'next-sanity'

/*
 * Hand-written types for the queries TypeGen doesn't type yet: the global-module query in
 * `VisualEditingControls` (#185) and the announcements query. Everything else uses the generated
 * types in `src/sanity/sanity.types.ts`; delete these as those queries move over.
 */
declare global {
  namespace Sanity {
    interface GlobalModule extends SanityDocument {
      path: string
      excludePaths?: string[]
      modules?: Module[]
    }

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

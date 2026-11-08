/* eslint-disable @typescript-eslint/no-explicit-any */
import { VariantProps } from 'class-variance-authority'

import { buttonVariants } from '@/components/ui/button'

import type { PortableTextBlock } from '@portabletext/types'
import type { SanityAssetDocument, SanityDocument } from 'next-sanity'
import type { Lang } from '@/lib/i18n'

declare global {
  namespace Sanity {
    // pages

    interface PageBase extends SanityDocument {
      title?: string
      metadata: Metadata
      readonly language?: string
    }

    interface Page extends PageBase {
      readonly _type: 'page'
      modules?: Module[]
    }

    /** A published language version of a document and its URL path. */
    interface TranslationLink {
      lang: Lang
      url: string
    }

    /** A document fetched for a language (ADR 0002). */
    type Localized<T> = T & {
      /** The English document, rendered because `lang` has no published translation. */
      isFallback: boolean
      /** Every enabled language the document is published in, its own included. */
      translations: TranslationLink[]
    }

    interface GlobalModule extends SanityDocument {
      path: string
      excludePaths?: string[]
      modules?: Module[]
    }

    interface BlogPost extends PageBase {
      readonly _type: 'blog.post'
      title: string
      body: any
      readTime: number
      headings?: { style: string; text: string }[]
      categories: BlogCategory[]
      authors: Person[]
      featured: boolean
      hideTableOfContents: boolean
      publishDate: string
      faq?: FaqModule
    }

    interface BlogCategory extends SanityDocument {
      title: string
      slug: { current: string }
    }

    // miscellaneous

    interface Announcement extends SanityDocument {
      content: any
      cta?: Link
      start?: string
      end?: string
    }

    interface Person extends SanityDocument {
      name: string
      image?: Image
    }

    interface Pricing extends SanityDocument {
      title: string
      highlight?: string
      price: {
        base?: number
        strikethrough?: number
        suffix?: string
      }
      ctas?: CTA[]
      content?: any
    }

    interface Reputation extends SanityDocument {
      title?: string
      subtitle?: string
      repo?: string
      showForks?: boolean
      limit?: number
      avatars?: Image[]
    }

    interface Testimonial extends SanityDocument {
      content: any
      source?: string
      author?: {
        name: string
        title?: string
        image?: Image
      }
    }

    // objects

    interface Code {
      readonly _type: 'code'
      language: string
      code: string
      filename?: string
      highlightedLines?: number[]
    }

    interface CTA {
      readonly _type?: 'cta'
      _key?: string
      link?: Link
      style?: VariantProps<typeof buttonVariants>['variant']
    }

    interface CustomHTML extends Module<'custom-html'> {
      className?: string
      html?: {
        code: string
      }
    }

    interface Icon {
      readonly _type: 'icon'
      image?: Image
      ic0n?: string
      size?: string
    }

    interface Img {
      readonly _type: 'img'
      image: Image
      responsive?: {
        image: Image
        media: string
      }[]
      alt?: string
      loading?: 'lazy' | 'eager'
    }
    interface HeroVideo {
      readonly _type: 'video'
      url?: string
      mimeType?: string
      poster?: Img
      autoplay?: boolean
      loop?: boolean
      muted?: boolean
    }

    interface Image extends SanityAssetDocument {
      alt: string
      loading: 'lazy' | 'eager'
    }

    interface Link {
      readonly _type: 'link'
      _key: string
      label: string
      type: 'internal' | 'external'
      internal?: Page | BlogPost
      external?: string
      params?: string
    }

    interface Metadata {
      slug: { current: string }
      title: string
      description: string
      image?: Image
      ogimage?: string
      noIndex: boolean
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

    // modules

    type PortableText = PortableTextBlock[]

    type SectionChildModule = Module

    interface SectionModule extends Module<'section'> {
      headingBadge?: string
      icon?: string
      module?: (SectionChildModule | null)[] | null
      pretitle?: string
      subtitle?: string
      title: string
    }

    interface ImageGalleryModule extends Module {
      pretitle?: string
      intro?: PortableText
      rows?: {
        _key: string
        images?: (Image & { caption?: string; lqip?: string | null })[]
      }[]
      autoScroll?: boolean
      duration?: number
      alternateScrollDirection?: boolean
    }

    type FAQItem = {
      _key: string
      question: string
      answer: PortableTextBlock[]
      open?: boolean
    }

    interface FaqModule {
      _type: 'faq'
      _key: string
      pretitle?: string
      title?: string
      description?: any[]
      items: FaqItem[]
      accessibleAccordion?: boolean
      generateSchema?: boolean
    }

    interface ProjectListItem {
      _key?: string
      name?: string
      description?: PortableText
      asset?: Image
      cta?: CTA
      ctaEnabled?: boolean
    }

    interface ProjectListModule extends Module<'project-list'> {
      projects?: ProjectListItem[]
      initialProjects?: number
    }

    interface ServiceFeature {
      _key?: string
      name?: string
      description?: string
      img?: Image
    }

    interface ServiceDetailsModule extends Module<'service-details'> {
      features?: ServiceFeature[]
    }
  }
}

export {}

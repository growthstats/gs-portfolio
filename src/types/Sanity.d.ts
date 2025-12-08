/* eslint-disable @typescript-eslint/no-explicit-any */
import { VariantProps } from 'class-variance-authority'

import { buttonVariants } from '@/components/ui/button'

import type { PortableTextBlock } from '@portabletext/types'
import type { SanityAssetDocument, SanityDocument } from 'next-sanity'

declare global {
  namespace Sanity {
    // documents

    interface Site extends SanityDocument {
      // branding
      title: string
      blurb?: any
      logo?: Logo
      // info
      announcements?: Announcement[]
      copyright?: any
      ogimage?: string
      // navigation
      ctas?: CTA[]
      headerMenu?: Navigation
      footerMenu?: Navigation
      social?: Navigation
    }

    interface Navigation extends SanityDocument {
      title: string
      items?: (Link | LinkList)[]
    }

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

    interface Translation {
      slug: string
      translations?: {
        slug: string
        slugBlogAlt?: string
        language: string
      }[]
    }

    interface GlobalModule extends SanityDocument {
      path: string
      excludePaths?: string[]
      modules?: Module[]
    }

    interface BlogPost extends PageBase {
      readonly _type: 'blog.post'
      body: any
      readTime: number
      headings?: { style: string; text: string }[]
      categories: BlogCategory[]
      authors: Person[]
      featured: boolean
      hideTableOfContents: boolean
      publishDate: string
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

    interface Logo extends SanityDocument {
      name: string
      image?: Partial<{
        default: Image
        light: Image
        dark: Image
      }>
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

    interface Image extends SanityAssetDocument {
      alt: string
      loading: 'lazy' | 'eager'
    }

    interface Link {
      readonly _type: 'link'
      label: string
      type: 'internal' | 'external'
      internal?: Page | BlogPost
      external?: string
      params?: string
    }

    interface LinkList {
      readonly _type: 'link.list'
      link?: Link
      links?: Link[]
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
    }

    interface ProjectListModule extends Module<'project-list'> {
      pretitle?: string
      title?: string
      intro?: PortableText
      projects?: ProjectListItem[]
      initialProjects?: number
    }
  }
}

export {}

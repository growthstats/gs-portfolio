import AboutPlaceholder from './AboutPlaceholder'
import AccordionList from './AccordionList'
import BlogFrontpage from './blog/BlogFrontpage'
import BlogList from './blog/BlogList'
import BlogPostContent from './blog/PostContent'
import Breadcrumbs from './Breadcrumbs'
import Callout from './Callout'
import CardList from './CardList'
import ContactSimple from './ContactSimple'
import contactPlaceholder from './contactPlaceholder'
import BrandHeroPlaceholder from './BrandHeroPlaceholder'
import CustomHTML from './CustomHTML'
import FlagList from './FlagList'
import Hero from './Hero'
import HeroSplit from './HeroSplit'
import HeroSaaS from './HeroSaaS'
import ImageGallery from './ImageGallery'
import JoinUsPlaceholder from './JoinUsPlaceholder'
import LetsTalkPlaceholder from './LetsTalkPlaceholder'
import LogoList from './LogoList'
import ProjectList from './ProjectList'
import RichtextModule from './RichtextModule'
import ScheduleModule from './ScheduleModule'
import ServiceList from './ServiceList'
import SearchModule from './SearchModule'
import StatList from './StatList'
import StepList from './StepList'
import TabbedContent from './TabbedContent'
import TeamPlaceholder from './TeamPlaceholder'
import TestimonialList from './TestimonialList'
import TestimonialFeatured from './TestimonialFeatured'
import Section, { type SectionChild } from './Section'
import Faq from './Faq'
import ServiceDetails from './ServiceDetails'

import dynamic from 'next/dynamic'
import type { ComponentType, ReactNode } from 'react'
import { createDataAttribute } from 'next-sanity'
import type { Lang } from '@/lib/i18n'
import type { BlogPost } from '@/sanity/queries/blog.groq'
import type { ModuleOf, Page, PageModule } from '@/sanity/queries/page.groq'

export const MODULE_MAP = {
  'about.placeholder': AboutPlaceholder,
  'accordion-list': AccordionList,
  'blog-frontpage': BlogFrontpage,
  'blog-list': BlogList,
  'blog-post-content': BlogPostContent,
  breadcrumbs: Breadcrumbs,
  callout: Callout,
  'card-list': CardList,
  'brand-hero.placeholder': BrandHeroPlaceholder,
  'contact.placeholder': contactPlaceholder,
  'contact.simple': ContactSimple,
  'creative-module': dynamic(() => import('./CreativeModule')),
  'custom-html': CustomHTML,
  faq: Faq,
  'flag-list': FlagList,
  hero: Hero,
  'hero.saas': HeroSaaS,
  'hero.split': HeroSplit,
  'image-gallery': ImageGallery,
  'join-us.placeholder': JoinUsPlaceholder,
  'lets-talk-placeholder': LetsTalkPlaceholder,
  'logo-list': LogoList,
  'project-list': ProjectList,
  'person-list': dynamic(() => import('./PersonList')),
  'pricing-list': dynamic(() => import('./PricingList')),
  'richtext-module': RichtextModule,
  'schedule-module': ScheduleModule,
  'search-module': SearchModule,
  'service-list': ServiceList,
  'service-details': ServiceDetails,
  'stat-list': StatList,
  'step-list': StepList,
  'tabbed-content': TabbedContent,
  'testimonial-list': TestimonialList,
  'testimonial.featured': TestimonialFeatured,
  'team.placeholder': TeamPlaceholder,
} as const

/**
 * A module as any route's modules query returns it, a section's child, or a scheduled module
 * (which the modules query doesn't project, so it arrives as stored).
 */
type RenderedModule =
  PageModule | SectionChild | NonNullable<ModuleOf<'schedule-module'>['modules']>[number]

export default function Modules({
  lang,
  modules,
  page,
  post,
}: Readonly<{
  /** The page language, handed to every module so server modules can call `getDictionary(lang)`. */
  lang: Lang
  modules?: (RenderedModule | null)[] | null
  page?: Page
  post?: BlogPost
}>) {
  const getAdditionalProps = (module: RenderedModule) => {
    switch (module._type) {
      case 'blog-post-content':
        return { post }
      case 'breadcrumbs':
        return { currentPage: post || page }
      default:
        return {}
    }
  }

  const renderModule = (module: RenderedModule, path: string): ReactNode => {
    const elementKey = module._key || `${module._type}-${path}`

    const dataAttribute = page?._id
      ? createDataAttribute({
          id: page._id,
          type: page._type,
          path,
        }).toString()
      : undefined

    if (module._type === 'section') {
      return (
        <Section
          data={module}
          dataSanity={dataAttribute}
          renderModule={(child, childIndex) => renderModule(child, `${path}.module[${childIndex}]`)}
          key={elementKey}
        />
      )
    }

    const Component = MODULE_MAP[module._type as keyof typeof MODULE_MAP] as
      ComponentType<Record<string, unknown>> | undefined
    if (!Component) return null

    return (
      <Component
        {...module}
        {...getAdditionalProps(module)}
        lang={lang}
        data-sanity={dataAttribute}
        key={elementKey}
      />
    )
  }

  return (
    <>
      {modules?.map((module) => {
        if (!module) return null
        const path = `page[_key == "${module._key}"]`
        return renderModule(module, path)
      })}
    </>
  )
}

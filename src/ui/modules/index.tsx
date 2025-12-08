import AboutPlaceholder from './AboutPlaceholder'
import AccordionList from './AccordionList'
import BlogFrontpage from './blog/BlogFrontpage'
import BlogList from './blog/BlogList'
import BlogPostContent from './blog/PostContent'
import Breadcrumbs from './Breadcrumbs'
import Callout from './Callout'
import CardList from './CardList'
import CustomHTML from './CustomHTML'
import FlagList from './FlagList'
import Hero from './Hero'
import HeroSplit from './HeroSplit'
import HeroSaaS from './HeroSaaS'
import JoinUsPlaceholder from './JoinUsPlaceholder'
import LogoList from './LogoList'
import ProjectList from './ProjectList'
import RichtextModule from './RichtextModule'
import ScheduleModule from './ScheduleModule'
import SearchModule from './SearchModule'
import StatList from './StatList'
import StepList from './StepList'
import TabbedContent from './TabbedContent'
import TeamPlaceholder from './TeamPlaceholder'
import TestimonialList from './TestimonialList'
import TestimonialFeatured from './TestimonialFeatured'
import Section from './Section'
import Faq from './Faq'
import ContactSimple from './ContactSimple'
import ServiceDetails from './ServiceDetails'

import dynamic from 'next/dynamic'
import type { ReactNode } from 'react'
import { createDataAttribute } from 'next-sanity'

export const MODULE_MAP = {
  'about.placeholder': AboutPlaceholder,
  'accordion-list': AccordionList,
  'blog-frontpage': BlogFrontpage,
  'blog-list': BlogList,
  'blog-post-content': BlogPostContent,
  breadcrumbs: Breadcrumbs,
  callout: Callout,
  'card-list': CardList,
  'contact.simple': ContactSimple,
  'creative-module': dynamic(() => import('./CreativeModule')),
  'custom-html': CustomHTML,
  faq: Faq,
  'flag-list': FlagList,
  hero: Hero,
  'hero.saas': HeroSaaS,
  'hero.split': HeroSplit,
  'join-us.placeholder': JoinUsPlaceholder,
  'logo-list': LogoList,
  'project-list': ProjectList,
  'person-list': dynamic(() => import('./PersonList')),
  'pricing-list': dynamic(() => import('./PricingList')),
  'richtext-module': RichtextModule,
  'schedule-module': ScheduleModule,
  'search-module': SearchModule,
  'service-details': ServiceDetails,
  'stat-list': StatList,
  'step-list': StepList,
  'tabbed-content': TabbedContent,
  'testimonial-list': TestimonialList,
  'testimonial.featured': TestimonialFeatured,
  'team.placeholder': TeamPlaceholder,
} as const

export default function Modules({
  modules,
  page,
  post,
}: Readonly<{
  modules?: Sanity.Module[]
  page?: Sanity.Page
  post?: Sanity.BlogPost
}>) {
  const getAdditionalProps = (module: Sanity.Module) => {
    switch (module._type) {
      case 'blog-post-content':
        return { post }
      case 'breadcrumbs':
        return { currentPage: post || page }
      default:
        return {}
    }
  }

  const renderModule = (module: Sanity.Module | null | undefined, path: string): ReactNode => {
    if (!module) return null

    const elementKey = module._key || (module as { _id?: string })?._id || `${module._type}-${path}`

    const dataAttribute = page?._id
      ? createDataAttribute({
          id: page._id,
          type: page?._type,
          path,
        }).toString()
      : undefined

    if (module._type === 'section') {
      return (
        <Section
          data={module as Sanity.SectionModule}
          dataSanity={dataAttribute}
          renderModule={(child, childIndex) => renderModule(child, `${path}.module[${childIndex}]`)}
          key={elementKey}
        />
      )
    }

    const Component = MODULE_MAP[module._type as keyof typeof MODULE_MAP]
    if (!Component) return null

    return (
      <Component
        {...module}
        {...getAdditionalProps(module)}
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

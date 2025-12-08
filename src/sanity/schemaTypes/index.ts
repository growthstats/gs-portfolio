import { type SchemaTypeDefinition } from 'sanity'

// documents
import site from './documents/site'
import page from './documents/page'
import globalModule from './documents/global-module'
import blogPost from './documents/blog.post'
import blogCategory from './documents/blog.category'
import navigation from './documents/navigation'
import redirect from './documents/redirect'

// miscellaneous
import announcement from './misc/announcement'
import logo from './misc/logo'
import person from './misc/person'
import pricing from './misc/pricing'
import reputation from './misc/reputation'
import testimonial from './misc/testimonial'

// objects
import cta from './objects/cta'
import icon from './objects/icon'
import img from './objects/img'
import link from './objects/link'
import linkList from './objects/link.list'
import metadata from './objects/metadata'
import moduleOptions from './objects/module-options'

// modules
import accordionList from './modules/accordion-list'
import blogFrontpage from './modules/blog-frontpage'
import blogList from './modules/blog-list'
import blogPostContent from './modules/blog-post-content'
import breadcrumbs from './modules/breadcrumbs'
import callout from './modules/callout'
import cardList from './modules/card-list'
import creativeModule from './modules/creative'
import customHtml from './modules/custom-html'
import faq from './modules/faq'
import contactSimple from './modules/contact.simple'
import flagList from './modules/flag-list'
import hero from './modules/hero'
import heroSaas from './modules/hero.saas'
import heroSplit from './modules/hero.split'
import logoList from './modules/logo-list'
import personList from './modules/person-list'
import pricingList from './modules/pricing-list'
import projectList from './modules/project-list'
import richtextModule from './modules/richtext-module'
import scheduleModule from './modules/schedule-module'
import searchModule from './modules/search-module'
import serviceDetails from './modules/service-details'
import section from './modules/section'
import statList from './modules/stat-list'
import stepList from './modules/step-list'
import tabbedContent from './modules/tabbed-content'
import teamPlaceholder from './modules/team.placeholder'
import testimonialFeatured from './modules/testimonial.featured'
import testimonialList from './modules/testimonial-list'
import joinUsPlaceholder from './modules/join-us.placeholder'
import aboutPlaceholder from './modules/about.placeholder'

export const schemaTypes: SchemaTypeDefinition[] = [
  // documents
  site,
  page,
  globalModule,
  blogPost,
  blogCategory,
  navigation,

  // miscellaneous
  announcement,
  redirect,
  logo,
  person,
  pricing,
  reputation,
  testimonial,

  // objects
  cta,
  icon,
  img,
  link,
  linkList,
  metadata,
  moduleOptions,

  // modules
  aboutPlaceholder,
  accordionList,
  blogFrontpage,
  blogList,
  blogPostContent,
  breadcrumbs,
  callout,
  cardList,
  contactSimple,
  creativeModule,
  customHtml,
  faq,
  flagList,
  hero,
  heroSaas,
  heroSplit,
  joinUsPlaceholder,
  logoList,
  personList,
  pricingList,
  projectList,
  richtextModule,
  scheduleModule,
  searchModule,
  serviceDetails,
  section,
  statList,
  stepList,
  tabbedContent,
  teamPlaceholder,
  testimonialFeatured,
  testimonialList,
]

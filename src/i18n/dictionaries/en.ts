/**
 * English UI strings, the source of truth for every other dictionary (ADR 0003).
 * Values are plain strings so the dictionary can cross the server/client boundary;
 * `{name}` placeholders are filled by `format()`, and `{ one, other }` pairs by `plural()`.
 */
const en = {
  common: {
    skipToContent: 'Skip to content',
    loading: 'Loading...',
    clickToCopy: 'Click to copy',
    toggleNavigation: 'Toggle navigation',
    breadcrumbs: 'Breadcrumb',
    showMore: 'Show more',
    showLess: 'Show less',
    faq: 'Frequently Asked Questions',
  },
  pagination: {
    prev: 'Prev',
    next: 'Next',
    of: 'of',
  },
  about: {
    badge: 'About GrowthStats',
    imageAlt: 'About GrowthStats',
    headingLine1: 'An Agency With Classic',
    headingLine2: 'Revolutionary Skills',
    missionTitle: 'Your Growth, Our Mission',
    missionText:
      'We focus on driving measurable success. Our team partners with you to unlock opportunities and achieve lasting impact.',
    partnershipTitle: 'Success Through Partnership',
    partnershipText:
      'Our priority is your growth. By combining guidance, innovation, and teamwork, we help you achieve digital excellence.',
  },
  brandHero: {
    headingLine1: 'Get the Growth',
    headingLine2: 'Your Brand',
    headingLine3: 'Deserves',
    intro:
      'We design digital experiences that reflect your brand, monitor promotions, design standout visuals, and deliver content, branding, and marketing to elevate your business online.',
    cta: `Let's Work Together`,
    services: {
      keywordResearch: 'Keyword Research',
      technicalSeo: 'Technical SEO',
      localSeo: 'Local SEO',
      campaignManagement: 'Campaign Management',
      uiUx: 'UI UX',
      webDevelopment: 'Web Development',
      emailMarketing: 'Email Marketing',
      performanceMarketing: 'Performance Marketing',
    },
  },
  joinUs: {
    badge: 'Join Us Now',
    headingLine1: 'Each Project we Undertake',
    headingLine2: 'is a Unique Opportunity.',
    text: 'Ready to take the next step? Join us now and start transforming your vision into reality with expert support.',
    cta: 'Book an Appointment',
  },
  letsTalk: {
    heading: `Let's Talk`,
  },
  team: {
    label: 'Key features',
    expertise: {
      title: 'Expertise',
      description:
        'Our skilled team brings together expertise, creativity, and technological mastery to accelerate business growth online',
    },
    clientCentric: {
      title: 'Client-Centric Approach',
      description:
        'We prioritize our clients by delivering customized strategies designed to meet unique goals, challenges, and opportunities',
    },
    results: {
      title: 'Result Driven Solutions',
      description:
        'We focus on measurable outcomes, combining innovation, technical excellence, and strategic insight to drive enduring development',
    },
  },
  contact: {
    formHeading: 'Get in Touch',
    infoHeading: 'Contact Us',
    mapTitle: 'Google Map',
    location: 'Location',
    addressLine1: '1st Floor,',
    addressLine2: 'Citadel Commercial Complex,',
    addressLine3: 'Pune, Maharashtra 411001',
    generalInquiries: 'General Inquiries',
    social: 'Social',
  },
  contactForm: {
    labels: {
      name: 'Name',
      phone: 'Phone Number',
      email: 'Email',
      website: 'Website',
      optional: '(optional)',
      message: 'Message',
    },
    placeholders: {
      name: 'Enter Your name',
      phone: '+91 XXXX XXXXX',
      email: 'example@gmail.com',
      website: 'yourcompany.com',
    },
    submit: 'Submit',
    submitting: 'Submitting…',
    success: 'Form submitted successfully!',
    error: 'Error submitting the form. Please try again.',
    errors: {
      nameRequired: 'Name is required',
      phoneRequired: 'Phone number is required',
      emailInvalid: 'Enter a valid email',
      websiteInvalid: 'Enter a valid website',
      messageRequired: 'Message is required',
      tooLong: 'Must be at most {max} characters',
    },
  },
  blog: {
    readTime: {
      one: 'Read time: {count} minute',
      other: 'Read time: {count} minutes',
    },
    featured: 'Featured',
    allCategories: 'All',
    filterByCategory: 'Filter by category',
    categories: 'Blog categories',
    noPosts: 'No posts found...',
  },
  search: {
    placeholder: {
      all: 'Search',
      pages: 'Search pages',
      blogPosts: 'Search blog posts',
    },
    searching: 'Searching...',
    resultsFor: {
      one: '{count} result found for',
      other: '{count} results found for',
    },
    typeBlog: 'Blog',
    typePage: 'Page',
    google: 'Search on Google',
  },
}

export type Dictionary = typeof en

export default en

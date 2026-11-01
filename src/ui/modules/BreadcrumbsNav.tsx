'use client'

import { useDictionary } from '@/i18n/DictionaryProvider'

/** Labels the breadcrumb `<nav>` for assistive tech in the page language. */
export default function BreadcrumbsNav(props: React.ComponentProps<'nav'>) {
  const { common } = useDictionary()
  return <nav aria-label={common.breadcrumbs} {...props} />
}

import Pretitle from '@/ui/Pretitle'
import { stegaClean } from 'next-sanity'
import { Suspense } from 'react'
import SearchForm from './SearchForm'
import CTAList from '@/ui/CTAList'
import moduleProps from '@/lib/moduleProps'
import PortableText from '@/ui/PortableText'
import type { ModuleProps } from '@/sanity/queries/page.groq'

export default function SearchModule({
  pretitle,
  intro,
  ctas,
  scope,
  path,
  ...props
}: ModuleProps<'search-module'>) {
  return (
    <section className="section space-y-8" {...moduleProps(props)}>
      {(pretitle || intro) && (
        <header className="richtext text-center">
          <Pretitle>{pretitle}</Pretitle>
          {intro && <PortableText value={intro ?? []} />}
        </header>
      )}

      <div className="mx-auto max-w-screen-sm">
        <Suspense fallback={<div className="skeleton-[calc(1lh+.5rem+2px)]" />}>
          <SearchForm scope={stegaClean(scope)} path={stegaClean(path)} />
        </Suspense>
      </div>

      <CTAList className="justify-center" ctas={ctas} />
    </section>
  )
}

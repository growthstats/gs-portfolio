'use client'

import { useMemo, useState } from 'react'
import { PortableText, stegaClean } from 'next-sanity'
import moduleProps from '@/lib/moduleProps'
import Pretitle from '@/ui/Pretitle'
import Heading from '@/ui/Heading'
import { Img } from '@/ui/Img'
import CTA from '@/ui/CTA'
import { Button } from '@/components/ui/button'

type ProjectCard = {
  _key?: string
  name?: string
  description?: any
  asset?: Sanity.Image
  cta?: Sanity.CTA
}

export default function ProjectList({
  pretitle,
  title,
  intro,
  projects,
  initialProjects = 3,
  ...props
}: Partial<{
  pretitle: string
  title: string
  intro: any
  projects: ProjectCard[]
  initialProjects: number
}> &
  Sanity.Module) {
  const visibleByDefault = useMemo(() => {
    const cleaned = stegaClean(initialProjects)
    const parsed = typeof cleaned === 'number' ? cleaned : Number(cleaned)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 3
  }, [initialProjects])

  const [showAll, setShowAll] = useState(false)

  const visibleProjects = showAll ? projects : projects?.slice(0, visibleByDefault)
  const hasMore = (projects?.length || 0) > visibleByDefault

  return (
    <section className="section space-y-10" {...moduleProps(props)}>
      {(pretitle || title || intro) && (
        <header className="richtext mx-auto max-w-3xl space-y-3 text-center text-balance">
          <Pretitle>{pretitle}</Pretitle>
          {title && (
            <Heading
              as="h2"
              variant="h2"
              // className="text-3xl font-semibold md:text-4xl"
            >
              {title}
            </Heading>
          )}
          <PortableText value={intro} />
        </header>
      )}

      <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProjects?.map((project, index) => {
          if (!project) return null
          const key = project._key || project.name || `project-${index}`

          return (
            <article
              className="border-ink/10 flex h-full flex-col gap-4 rounded-2xl border bg-white/60 p-6 shadow-sm backdrop-blur-sm"
              key={key}
            >
              {project.asset && (
                <figure className="border-ink/5 overflow-hidden rounded-lg border">
                  <Img
                    className="aspect-video w-full object-cover"
                    image={project.asset}
                    width={640}
                  />
                </figure>
              )}

              <div className="flex grow flex-col gap-3">
                {project.name && (
                  <Heading
                    as="h3"
                    variant="h4"
                    // className="text-lg leading-tight text-balance"
                  >
                    {project.name}
                  </Heading>
                )}
                {project.description && (
                  <div className="richtext text-muted-foreground grow text-sm">
                    <PortableText value={project.description} />
                  </div>
                )}
              </div>

              {project.cta && (
                <div className="pt-2">
                  <CTA {...project.cta} />
                </div>
              )}
            </article>
          )
        })}
      </div>

      {hasMore && (
        <div className="flex justify-center">
          <Button variant="ghost" onClick={() => setShowAll((state) => !state)}>
            {showAll ? 'Show less' : 'Show more'}
          </Button>
        </div>
      )}
    </section>
  )
}

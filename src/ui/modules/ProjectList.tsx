'use client'

import { useMemo, useState } from 'react'
import { PortableText, stegaClean } from 'next-sanity'
import moduleProps from '@/lib/moduleProps'
import Heading from '@/ui/Heading'
import { Img } from '@/ui/Img'
import CTA from '@/ui/CTA'
import { Button } from '@/components/ui/button'

type ProjectCard = {
  _key?: string
  name?: string
  description?: Sanity.PortableText
  asset?: Sanity.Image
  cta?: Sanity.CTA
  ctaEnabled?: boolean
}

export default function ProjectList({
  projects,
  initialProjects = 3,
  ...props
}: Partial<{
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
    <div className="section space-y-10" {...moduleProps(props)}>
      <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProjects?.map((project, index) => {
          if (!project) return null
          const key = project._key || project.name || `project-${index}`

          return (
            <article
              className="flex h-full flex-col items-center gap-4 overflow-hidden rounded-3xl px-6 py-8 text-center shadow-(--shadow-card) transition-shadow duration-300"
              key={key}
            >
              {project.asset && (
                <figure className="border-ink/5 w-full overflow-hidden rounded-2xl border">
                  <Img
                    className="aspect-video w-full object-cover"
                    image={project.asset}
                    width={640}
                  />
                </figure>
              )}

              <div className="flex grow flex-col gap-3">
                {project.name && (
                  <Heading as="h3" variant="h4">
                    {project.name}
                  </Heading>
                )}
                {project.description && (
                  <div className="richtext text-muted-foreground grow text-sm">
                    <PortableText value={project.description ?? []} />
                  </div>
                )}
              </div>

              {project.ctaEnabled && project.cta && (
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
    </div>
  )
}

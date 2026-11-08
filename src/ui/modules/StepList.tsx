import Pretitle from '@/ui/Pretitle'
import PortableText from '@/ui/PortableText'
import type { ModuleProps } from '@/sanity/queries/page.groq'

export default function StepList({ pretitle, intro, steps }: ModuleProps<'step-list'>) {
  return (
    <section className="section space-y-8">
      {(pretitle || intro) && (
        <header className="mx-auto max-w-xl richtext text-center text-balance">
          <Pretitle>{pretitle}</Pretitle>
          {intro && <PortableText value={intro ?? []} />}
        </header>
      )}

      <ol className="grid gap-8 md:grid-cols-[repeat(auto-fit,minmax(250px,1fr))]">
        {steps?.map((step, index) => (
          <li className="grid grid-cols-[auto_1fr] gap-2" key={index}>
            <b className="aspect-square h-[1em] -translate-y-4 text-gradient text-center text-6xl tabular-nums">
              {index + 1}
            </b>

            <div className="richtext">
              {step.content && <PortableText value={step.content ?? []} />}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}

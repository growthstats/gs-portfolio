import CTAList from '@/ui/CTAList'
import Code from './RichtextModule/Code'
import Reputation from '@/ui/Reputation'
import PortableText from '@/ui/PortableText'
import type { ModuleProps } from '@/sanity/queries/page.groq'

export default function Callout({ content, ctas }: ModuleProps<'callout'>) {
  return (
    <section className="section text-center">
      <div className="section max-w-screen-lg rounded bg-accent/3">
        <div className="mx-auto max-w-screen-sm richtext text-balance">
          {content && (
            <PortableText
              value={content ?? []}
              components={{
                types: {
                  code: ({ value }) => (
                    <Code value={value} className="mx-auto max-w-max" theme="snazzy-light" />
                  ),
                  'reputation-block': ({ value }) => (
                    <Reputation className="!mt-4 justify-center" reputation={value.reputation} />
                  ),
                },
              }}
            />
          )}
          <CTAList className="!mt-8 justify-center" ctas={ctas} />
        </div>
      </div>
    </section>
  )
}

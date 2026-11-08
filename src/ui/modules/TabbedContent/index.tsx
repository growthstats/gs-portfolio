import Pretitle from '@/ui/Pretitle'
import TabList from './TabList'
import Wrapper from './Wrapper'
import CTAList from '@/ui/CTAList'
import Asset from '@/ui/modules/Asset'
import { cn } from '@/lib/utils'
import PortableText from '@/ui/PortableText'
import type { ModuleProps } from '@/sanity/queries/page.groq'

export default function TabbedContent({ pretitle, intro, tabs }: ModuleProps<'tabbed-content'>) {
  return (
    <section className="section space-y-8">
      {(pretitle || intro) && (
        <header className="richtext text-center">
          <Pretitle>{pretitle}</Pretitle>
          {intro && <PortableText value={intro ?? []} />}
        </header>
      )}

      <TabList tabs={tabs} />

      {tabs?.map(
        (tab, index) =>
          !!tab && (
            <Wrapper
              className="grid items-center gap-8 *:mx-auto *:max-w-lg md:grid-cols-2 md:gap-x-12"
              index={index}
              key={index}
            >
              <figure
                className={cn(
                  'anim-fade-to-r',
                  tab.assetOnRight && 'md:order-last md:anim-fade-to-l',
                  tab.assetBelowContent && 'max-md:order-last',
                )}
              >
                <Asset asset={tab.assets?.[0]} />
              </figure>

              <div
                className={cn(
                  'w-full anim-fade-to-r richtext',
                  !tab.assetOnRight && 'md:anim-fade-to-l',
                )}
              >
                <Pretitle>{tab.pretitle}</Pretitle>
                {tab.content && <PortableText value={tab.content ?? []} />}
                <CTAList ctas={tab.ctas} />
              </div>
            </Wrapper>
          ),
      )}
    </section>
  )
}

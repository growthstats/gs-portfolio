import moduleProps from '@/lib/moduleProps'
import { stegaClean } from 'next-sanity'
import CTAsSubModule from './CTAsSubModule'
import CustomHTMLSubmodule from './CustomHTMLSubmodule'
import Icon, { getPixels } from '@/ui/Icon'
import ImageSubModule from './ImageSubModule'
import RichtextSubModule from './RichtextSubModule'
import { cn } from '@/lib/utils'
import PortableText from '@/ui/PortableText'
import type { ModuleOf, ModuleProps } from '@/sanity/queries/page.groq'

type SubModule = NonNullable<
  NonNullable<NonNullable<ModuleOf<'creative-module'>['modules']>[number]['subModules']>[number]
>

/** A creative module's sub-module of type `T`, as the page query returns it. */
export type CreativeSubModule<T extends SubModule['_type']> = Extract<SubModule, { _type: T }>

export default function CreativeModule({
  intro,
  modules,
  columns,
  visualSeparation,
  textAlign: ta,
  alignItems: ai,
  ...props
}: ModuleProps<'creative-module'>) {
  const width = Math.round((1200 / (columns || modules?.length || 1)) * 1.5)

  const textAlign = stegaClean(ta)
  const alignItems = stegaClean(ai)

  return (
    <section {...moduleProps(props)}>
      <div className="section space-y-8">
        {intro && (
          <header className="mx-auto max-w-xl richtext text-center text-balance">
            {intro && <PortableText value={intro ?? []} />}
          </header>
        )}

        <div
          className={cn(
            'grid items-center md:grid-cols-[repeat(var(--col,1),minmax(0px,1fr))]',
            visualSeparation ? 'gap-4' : 'gap-x-12 gap-y-8',
          )}
          style={
            {
              '--col': columns || modules?.length,
              textAlign,
              alignItems,
            } as React.CSSProperties
          }
        >
          {modules?.map(({ subModules, colSpan = 1 }, i) => (
            <article
              className={cn('space-y-4', {
                'md:col-(--col-span,1)': colSpan > 1,
                'rounded bg-accent/3 p-6': visualSeparation,
                'flex flex-col justify-center': alignItems === 'stretch',
              })}
              style={
                {
                  '--col-span': colSpan > 1 && `span ${colSpan}`,
                } as React.CSSProperties
              }
              key={i}
            >
              {subModules?.map((subModule, ii) => {
                switch (subModule._type) {
                  case 'image':
                    return <ImageSubModule module={subModule} width={width * colSpan} key={ii} />

                  case 'icon':
                    return (
                      <figure
                        className={cn(textAlign === 'center' && '[&_img]:mx-auto')}
                        style={{ height: getPixels(subModule?.size) }}
                      >
                        <Icon icon={subModule} key={ii} />
                      </figure>
                    )

                  case 'richtext':
                    return <RichtextSubModule module={subModule} key={ii} />

                  case 'ctas':
                    return (
                      <CTAsSubModule
                        module={subModule}
                        className={cn(textAlign === 'center' && 'justify-center')}
                        key={ii}
                      />
                    )

                  case 'custom-html':
                    return <CustomHTMLSubmodule module={subModule} />

                  default:
                    return null
                }
              })}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

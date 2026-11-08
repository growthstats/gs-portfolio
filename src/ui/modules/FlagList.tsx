import Pretitle from '@/ui/Pretitle'
import { stegaClean } from 'next-sanity'
import Icon, { getPixels } from '@/ui/Icon'
import { cn } from '@/lib/utils'
import PortableText from '@/ui/PortableText'
import type { ModuleProps } from '@/sanity/queries/page.groq'

export default function FlagList({
  pretitle,
  intro,
  items,
  iconPosition,
}: ModuleProps<'flag-list'>) {
  return (
    <section className="section space-y-8">
      {(pretitle || intro) && (
        <header className="mx-auto max-w-xl richtext text-center text-balance">
          <Pretitle>{pretitle}</Pretitle>
          {intro && <PortableText value={intro ?? []} />}
        </header>
      )}

      <div className="grid items-start gap-x-8 gap-y-6 md:grid-cols-[repeat(auto-fit,minmax(200px,1fr))]">
        {items?.map(({ icon, content }, key) => (
          <article
            className={cn(
              'grid gap-4',
              stegaClean(iconPosition) === 'left' && icon && 'grid-cols-[var(--size)_1fr]',
            )}
            style={
              {
                '--size': icon?.size ?? '40px',
              } as React.CSSProperties
            }
            key={key}
          >
            {icon && (
              <figure style={{ height: getPixels(icon?.size) }}>
                <Icon icon={icon} />
              </figure>
            )}

            <div className="richtext">{content && <PortableText value={content ?? []} />}</div>
          </article>
        ))}
      </div>
    </section>
  )
}

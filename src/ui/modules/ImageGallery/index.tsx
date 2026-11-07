import { stegaClean } from 'next-sanity'
import moduleProps from '@/lib/moduleProps'
import { cn } from '@/lib/utils'
import { Img } from '@/ui/Img'
import PortableText from '@/ui/PortableText'
import Pretitle from '@/ui/Pretitle'
import css from './ImageGallery.module.css'
import { galleryRows, type GalleryImage } from './rows'
import { getDictionary } from '@/i18n'
import type { Lang } from '@/lib/i18n'

function Figure({ image, copy }: { image: GalleryImage; copy?: boolean }) {
  return (
    <figure
      className={cn('relative shrink-0 snap-center', copy && css.copy)}
      aria-hidden={copy || undefined}
    >
      <Img
        className="h-56 w-auto max-w-none rounded-lg object-cover md:h-75"
        image={image}
        height={600}
        sizes="(max-width: 768px) 70vw, 400px"
        alt={copy ? '' : stegaClean(image.alt)}
      />
      {image.caption && (
        <figcaption className="absolute start-2 bottom-2 rounded bg-foreground/70 px-2 py-0.5 text-xs text-background backdrop-blur">
          {image.caption}
        </figcaption>
      )}
    </figure>
  )
}

export default function ImageGallery({
  pretitle,
  intro,
  rows,
  autoScroll,
  duration,
  alternateScrollDirection,
  lang,
  ...props
}: Sanity.ImageGalleryModule & { lang: Lang }) {
  const label = stegaClean(pretitle) || getDictionary(lang).imageGallery.label

  return (
    <section className="section space-y-8" {...moduleProps(props)}>
      {(pretitle || intro) && (
        <header className="mx-auto max-w-screen-sm richtext text-center text-balance">
          <Pretitle>{pretitle}</Pretitle>
          {intro && <PortableText value={intro} />}
        </header>
      )}

      <div className="space-y-2">
        {galleryRows(rows, autoScroll && alternateScrollDirection).map(
          ({ key, images, reverse }) => (
            // Focusable so the row scrolls with the arrow keys; focus pauses any auto-scroll.
            <div
              className={cn(
                css.scroller,
                'no-scrollbar overflow-x-auto max-md:full-bleed',
                !autoScroll && 'snap-x',
              )}
              role="region"
              aria-label={label}
              tabIndex={0}
              key={key}
            >
              <div
                className={cn(css.track, autoScroll && css.auto, reverse && css.reverse)}
                style={{ '--duration': `${duration || 20}s` } as React.CSSProperties}
              >
                {images.map((image) => (
                  <Figure image={image} key={image._key} />
                ))}
                {autoScroll &&
                  images.map((image) => <Figure image={image} copy key={`${image._key}-copy`} />)}
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  )
}

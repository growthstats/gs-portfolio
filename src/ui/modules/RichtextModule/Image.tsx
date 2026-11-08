import { Img } from '@/ui/Img'
import { stegaClean } from 'next-sanity'
import ImageSource from './ImageSource'
import type { ImgSource } from '@/ui/Img'

export default function Image({
  value,
}: {
  value: ImgSource &
    Partial<{
      caption: string
      source: string
      float: 'left' | 'right'
    }>
}) {
  return (
    <figure
      className="space-y-2 text-center max-lg:full-bleed md:[grid-column:bleed]!"
      style={{ float: stegaClean(value.float) }}
    >
      <Img className="mx-auto max-h-svh w-auto bg-accent/3 text-[0px]" image={value} width={1500} />

      {value.caption && (
        <figcaption className="px-4 text-sm text-balance text-ink/70 italic">
          {value.caption}

          {value.source && (
            <>
              {' ('}
              <ImageSource href={value.source} />
              {')'}
            </>
          )}
        </figcaption>
      )}
    </figure>
  )
}

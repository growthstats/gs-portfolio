import { ResponsiveImg, type ImgValue } from '@/ui/Img'
import { urlFor } from '@/sanity/lib/image'
import Code from './RichtextModule/Code'
import CustomHTML from './CustomHTML'
import type { SanityImageSource } from '@sanity/image-url'
import type { Code as CodeValue, CustomHtml } from '@/sanity/sanity.types'

/** A video asset, as the modules query projects it. */
export type VideoValue = {
  _type: 'video'
  url: string | null
  mimeType: string | null
  autoplay: boolean | null
  loop: boolean | null
  muted: boolean | null
  poster: ImgValue | null
}

/** An asset a module shows beside its content. */
export type AssetValue = (ImgValue & { _type: 'img' }) | VideoValue | CodeValue | CustomHtml

export default function Asset({ asset }: { asset?: AssetValue | null }) {
  switch (asset?._type) {
    case 'img':
      return <ResponsiveImg img={asset} className="w-full" width={1200} />
    case 'video':
      return <Video asset={asset} />
    case 'code':
      return (
        <Code className="richtext [&_.inner]:max-h-[20lh] [&_.inner]:overflow-auto" value={asset} />
      )
    case 'custom-html':
      return <CustomHTML {...asset} />
    default:
      return null
  }
}

function Video({ asset }: { asset: VideoValue }) {
  const poster = asset.poster?.image
    ? urlFor(asset.poster.image as SanityImageSource)
        .width(1200)
        .url()
    : undefined
  return (
    <video
      className="w-full rounded-2xl"
      autoPlay={asset.autoplay ?? true}
      loop={asset.loop ?? true}
      muted={asset.muted ?? true}
      playsInline
      poster={poster}
    >
      <source src={asset.url ?? undefined} type={asset.mimeType || 'video/mp4'} />
    </video>
  )
}

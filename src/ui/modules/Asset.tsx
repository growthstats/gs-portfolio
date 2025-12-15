import { ResponsiveImg } from '@/ui/Img'
import { urlFor } from '@/sanity/lib/image'
import Code from './RichtextModule/Code'
import CustomHTML from './CustomHTML'

type AssetType = Sanity.Img | Sanity.HeroVideo | Sanity.Code | Sanity.CustomHTML

export default function Asset({ asset }: { asset?: AssetType }) {
  if (!asset) return null

  const Component = ASSET_MAP[asset._type] as React.ComponentType<{ asset: AssetType }> | undefined

  return Component ? <Component asset={asset} /> : null
}

const ASSET_MAP = {
  img: ({ asset }: { asset: Sanity.Img }) => (
    <ResponsiveImg img={asset} className="w-full" width={1200} />
  ),
  video: ({ asset }: { asset: Sanity.HeroVideo }) => {
    const poster = asset.poster?.image ? urlFor(asset.poster.image).width(1200).url() : undefined
    return (
      <video
        className="w-full rounded-2xl"
        autoPlay={asset.autoplay ?? true}
        loop={asset.loop ?? true}
        muted={asset.muted ?? true}
        playsInline
        poster={poster}
      >
        <source src={asset.url} type={asset.mimeType || 'video/mp4'} />
      </video>
    )
  },
  code: ({ asset }: { asset: Sanity.Code }) => (
    <Code className="richtext [&_.inner]:max-h-[20lh] [&_.inner]:overflow-auto" value={asset} />
  ),
  'custom-html': ({ asset }: { asset: Sanity.CustomHTML }) => <CustomHTML {...asset} />,
} as const

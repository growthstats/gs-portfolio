import moduleProps from '@/lib/moduleProps'
import Pretitle from '@/ui/Pretitle'
import Code from './RichtextModule/Code'
import CustomHTML from './CustomHTML'
import Reputation from '@/ui/Reputation'
import CTAList from '@/ui/CTAList'
import { ResponsiveImg } from '@/ui/Img'
import { cn } from '@/lib/utils'
import { urlFor } from '@/sanity/lib/image'
import PortableText from '@/ui/PortableText'

export default function HeroSaaS({
  pretitle,
  content,
  ctas,
  assets,
  assetFaded,
  ...props
}: Partial<{
  pretitle: string
  content: Sanity.PortableText
  ctas: Sanity.CTA[]
  assets: Array<Sanity.Img | Sanity.HeroVideo>
  assetFaded?: boolean
}> &
  Sanity.Module) {
  const asset = assets?.[0]

  return (
    <section className="section space-y-8 text-center" {...moduleProps(props)}>
      <div className="richtext mx-auto max-w-2xl text-balance">
        <Pretitle>{pretitle}</Pretitle>
        {content && (
          <PortableText
            value={content}
            components={{
              types: {
                code: ({ value }) => (
                  <Code value={value} className="mx-auto mt-6! max-w-max" theme="snazzy-light" />
                ),
                'custom-html': ({ value }) => <CustomHTML {...value} />,
                'reputation-block': ({ value }) => (
                  <Reputation className="!mt-4 justify-center" reputation={value.reputation} />
                ),
              },
            }}
          />
        )}
        <CTAList ctas={ctas} className="!mt-8 justify-center" />
      </div>

      {(() => {
        switch (asset?._type) {
          case 'img':
            return (
              <ResponsiveImg
                img={asset}
                pictureProps={{
                  className: cn(
                    'anim-fade-to-t w-full block [animation-duration:1s]',
                    assetFaded && '[mask:linear-gradient(to_top,transparent,#000_50%)]',
                  ),
                }}
                width={2400}
                draggable={false}
              />
            )
          case 'video': {
            const video = asset
            const poster = video.poster?.image
              ? urlFor(video.poster.image).width(2400).url()
              : undefined
            return (
              <video
                className={cn(
                  'anim-fade-to-t block w-full rounded-2xl [animation-duration:1s]',
                  assetFaded && '[mask:linear-gradient(to_top,transparent,#000_50%)]',
                )}
                autoPlay={video.autoplay ?? true}
                loop={video.loop ?? true}
                muted={video.muted ?? true}
                playsInline
                poster={poster}
              >
                <source src={video.url} type={video.mimeType || 'video/mp4'} />
              </video>
            )
          }
          default:
            return null
        }
      })()}
    </section>
  )
}

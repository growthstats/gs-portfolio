import moduleProps from '@/lib/moduleProps'
import { ResponsiveImg } from '@/ui/Img'
import { stegaClean } from 'next-sanity'
import PortableText from '@/ui/PortableText'
import CTAList from '@/ui/CTAList'
import Pretitle from '@/ui/Pretitle'
import CustomHTML from './CustomHTML'
import Reputation from '@/ui/Reputation'
import { cn } from '@/lib/utils'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'
import { getHeadingConfig } from '@/ui/portableTextHeading'
import { urlFor } from '@/sanity/lib/image'
import type { CSSProperties } from 'react'
import type { SanityImageSource } from '@sanity/image-url'
import type { ModuleProps } from '@/sanity/queries/page.groq'

export default function Hero({
  pretitle,
  content,
  ctas,
  assets,
  overlayHeader,
  textAlign: ta = 'center',
  alignItems: ai,
  ...props
}: ModuleProps<'hero'>) {
  const asset = assets?.[0]
  const isImage = asset?._type === 'img'
  const isVideo = asset?._type === 'video' && !!asset?.url
  const hasVisual = isImage || isVideo
  const videoPoster = isVideo && asset.poster?.image ? asset.poster?.image : undefined
  const videoPosterUrl = videoPoster
    ? urlFor(videoPoster as SanityImageSource)
        .width(2400)
        .url()
    : undefined

  const textAlign = stegaClean(ta)
  const alignItems = stegaClean(ai)
  const pullUnderHeader = Boolean(stegaClean(overlayHeader))

  return (
    <section
      className={cn(
        hasVisual && 'grid overflow-hidden bg-ink text-black *:col-span-full *:row-span-full',
      )}
      style={
        pullUnderHeader
          ? {
              marginTop: 'calc(var(--header-height) * -2)',
              paddingTop: 'calc(var(--header-height) * 1)',
            }
          : undefined
      }
      {...moduleProps(props)}
    >
      {isImage && asset && (
        <ResponsiveImg
          img={asset}
          className="size-full max-h-fold object-cover"
          width={2400}
          draggable={false}
        />
      )}
      {isVideo && (
        <video
          className="size-full max-h-fold object-cover"
          autoPlay={asset.autoplay ?? true}
          loop={asset.loop ?? true}
          muted={asset.muted ?? true}
          playsInline
          poster={videoPosterUrl}
        >
          <source src={asset.url ?? undefined} type={asset.mimeType || 'video/mp4'} />
          Your browser does not support the video tag.
        </video>
      )}

      {content && (
        <div className="section flex w-full flex-col text-balance">
          <div
            className={cn(
              'relative isolate max-w-2xl richtext headings:text-balance',
              isImage && 'text-shadow',
              {
                'mb-8': alignItems === 'start',
                'my-auto': alignItems === 'center',
                'mt-auto': alignItems === 'end',
                'me-auto': ['left', 'start'].includes(textAlign),
                'mx-auto': textAlign === 'center',
                'ms-auto': ['right', 'end'].includes(textAlign),
              },
            )}
            style={{ textAlign: textAlign as CSSProperties['textAlign'] }}
          >
            <Pretitle className={cn(isImage && 'text-white')}>{pretitle}</Pretitle>

            <PortableText
              value={content}
              components={{
                block: ({ children, value }) => {
                  const headingConfig = getHeadingConfig(value?.style)

                  if (headingConfig) {
                    return (
                      <Heading
                        as={headingConfig.as}
                        variant={headingConfig.variant}
                        className={cn(isImage && 'text-white')}
                      >
                        {children}
                      </Heading>
                    )
                  }

                  return (
                    <Text as="p" variant="body" className={cn(isImage && 'text-white')}>
                      {children}
                    </Text>
                  )
                },
                types: {
                  'custom-html': ({ value }) => <CustomHTML {...value} />,
                  'reputation-block': ({ value }) => (
                    <Reputation
                      className={cn('!mt-4', isImage && '[&_strong]:text-amber-400', {
                        'justify-start': ['left', 'start'].includes(textAlign),
                        'justify-center': textAlign === 'center',
                        'justify-end': ['right', 'end'].includes(textAlign),
                      })}
                      reputation={value.reputation}
                    />
                  ),
                },
              }}
            />

            <CTAList
              ctas={ctas}
              className={cn('!mt-4', {
                'justify-start': textAlign === 'left',
                'justify-center': textAlign === 'center',
                'justify-end': textAlign === 'right',
              })}
            />
          </div>
        </div>
      )}
    </section>
  )
}

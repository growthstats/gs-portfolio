import { getSite } from '@/sanity/lib/queries'
import CTA from './CTA'
import { cn } from '@/lib/utils'
import {
  FaBluesky,
  FaFacebookF,
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
  FaTelegram,
  FaThreads,
} from 'react-icons/fa6'
import { IoIosLink } from 'react-icons/io'
import type { ComponentProps } from 'react'

type SocialProps = ComponentProps<'div'> & {
  shareUrl?: string
  shareText?: string
}

export default async function Social({ className, shareUrl, shareText }: SocialProps) {
  const { social } = await getSite()

  if (!social?.items?.length) return null

  return (
    <nav className={cn('group flex flex-wrap items-center', className)}>
      {social.items.map((item) => {
        const isInstagram = item._type === 'link' && item.external?.includes('instagram.com')

        if (shareUrl && isInstagram) return null

        const shareHref =
          shareUrl && item._type === 'link'
            ? getShareUrl(item.external, shareUrl, shareText)
            : item._type === 'link'
              ? item.external
              : undefined

        switch (item._type) {
          case 'link':
            return (
              <CTA
                className="px-2 py-1 group-has-[a:hover]:opacity-50 hover:!opacity-100"
                link={{
                  ...item,
                  type: 'external',
                  external: shareHref,
                }}
                key={item._key}
                style={'link'}
                target="_blank"
                rel="noreferrer"
              >
                <Icon
                  url={item.external}
                  aria-label={shareUrl ? `Share on ${item.label}` : item.label}
                />
              </CTA>
            )

          default:
            return null
        }
      })}
    </nav>
  )
}

function Icon({ url, ...props }: { url?: string } & React.ComponentProps<'svg'>) {
  if (!url) return null

  return url?.includes('t.me') ? (
    <FaTelegram {...props} />
  ) : url?.includes('bsky.app') ? (
    <FaBluesky {...props} />
  ) : url?.includes('facebook.com') ? (
    <FaFacebookF {...props} />
  ) : url?.includes('github.com') ? (
    <FaGithub {...props} />
  ) : url?.includes('threads.net') || url?.includes('threads.com') ? (
    <FaThreads {...props} />
  ) : url?.includes('instagram.com') ? (
    <FaInstagram {...props} />
  ) : url?.includes('linkedin.com') ? (
    <FaLinkedinIn {...props} />
  ) : url?.includes('tiktok.com') ? (
    <FaTiktok {...props} />
  ) : url?.includes('twitter.com') || url?.includes('x.com') ? (
    <FaXTwitter {...props} />
  ) : url?.includes('youtube.com') ? (
    <FaYoutube {...props} />
  ) : (
    <IoIosLink {...props} />
  )
}

function getShareUrl(platformUrl: string | undefined, shareUrl: string, shareText?: string) {
  const url = platformUrl ?? ''
  const encodedUrl = encodeURIComponent(shareUrl)
  const encodedText = encodeURIComponent(shareText ?? '')

  if (url.includes('t.me')) {
    return `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`
  }

  if (url.includes('bsky.app')) {
    const text = encodedText ? `${encodedText}%20${encodedUrl}` : encodedUrl
    return `https://bsky.app/intent/compose?text=${text}`
  }

  if (url.includes('facebook.com')) {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  }

  if (url.includes('linkedin.com')) {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  }

  if (url.includes('tiktok.com')) {
    return `https://www.tiktok.com/share?url=${encodedUrl}`
  }

  if (url.includes('twitter.com') || url.includes('x.com')) {
    return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
  }

  if (url.includes('threads.net') || url.includes('threads.com')) {
    const text = encodedText ? `${encodedText}%20${encodedUrl}` : encodedUrl
    return `https://www.threads.net/intent/post?text=${text}`
  }

  return shareUrl
}

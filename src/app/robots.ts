import type { MetadataRoute } from 'next'
import { BASE_URL } from '@/lib/env'
import { isIndexable } from '@/lib/indexing'

export default function robots(): MetadataRoute.Robots {
  // `next.config.ts` also sends `X-Robots-Tag: noindex` outside production.
  if (!isIndexable()) return { rules: { userAgent: '*', disallow: '/' } }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}

import { createClient, groq } from 'next-sanity'
import { projectId, dataset, apiVersion } from '@/sanity/lib/env'
// import { token } from '@/lib/sanity/token'
import { BLOG_DIR } from '@/lib/env'
import { indexRedirects, isIndexable } from '@/lib/indexing'
import { sanity } from 'next-sanity/live/cache-life'
import type { NextConfig } from 'next'

const client = createClient({
  projectId,
  dataset,
  // token, // for private datasets
  apiVersion,
  useCdn: true,
})

export default {
  // Memoizes components automatically; `eslint-plugin-react-hooks` flags code it can't compile.
  reactCompiler: true,

  // Published content stays cached until Sanity Live or the `/api/revalidate` webhook expires it.
  cacheComponents: true,
  cacheLife: { default: sanity },

  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },

  async redirects() {
    const sanityRedirects = await client.fetch(groq`*[_type == 'redirect']{
			source,
			'destination': select(
				destination.type == 'internal' =>
					select(
						destination.internal->._type == 'blog.post' => '/${BLOG_DIR}/',
						'/'
					) + destination.internal->.metadata.slug.current,
				destination.external
			),
			permanent
		}`)

    return [...indexRedirects(), ...sanityRedirects]
  },

  async headers() {
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-DNS-Prefetch-Control', value: 'on' },
      {
        key: 'Strict-Transport-Security',
        value: 'max-age=63072000; includeSubDomains; preload',
      },
      {
        key: 'Permissions-Policy',
        value: 'camera=(), microphone=(), geolocation=()',
      },
      // Auto-upgrade any http:// subresource to https:// (fixes mixed content
      // from CMS content). This directive only upgrades — it blocks nothing.
      { key: 'Content-Security-Policy', value: 'upgrade-insecure-requests' },
    ]

    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Keep the `develop` deploy, previews and local dev out of search results.
      ...(isIndexable()
        ? []
        : [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex' }] }]),
      {
        // Long-lived caching for immutable static assets
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|woff|woff2|ttf|otf)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },

  env: {
    SC_DISABLE_SPEEDY: 'false',
  },

  // logging: {
  // 	fetches: {
  // 		fullUrl: true,
  // 	},
  // },
} satisfies NextConfig

import { createClient, groq } from 'next-sanity'
import { projectId, dataset, apiVersion } from '@/sanity/lib/env'
// import { token } from '@/lib/sanity/token'
import { BLOG_DIR } from '@/lib/env'
import { supportedLanguages } from '@/lib/i18n'
import type { NextConfig } from 'next'

const client = createClient({
  projectId,
  dataset,
  // token, // for private datasets
  apiVersion,
  useCdn: true,
})

export default {
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
    return await client.fetch(groq`*[_type == 'redirect']{
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
  },

  async rewrites() {
    if (!supportedLanguages?.length) return []

    return [
      {
        source: `/:lang/${BLOG_DIR}/:slug`,
        destination: `/${BLOG_DIR}/:lang/:slug`,
      },
    ]
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

  typescript: {
    ignoreBuildErrors: true,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  // logging: {
  // 	fetches: {
  // 		fullUrl: true,
  // 	},
  // },
} satisfies NextConfig

import { NextResponse, type NextRequest, type MiddlewareConfig } from 'next/server'
import { DEFAULT_LANG, isEnabledLanguage, parseLangFromPath } from './lib/i18n'

// Pure pathname work (ADR 0001): no Sanity fetch, no cookies, no geo.
export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl
  const { lang, path } = parseLangFromPath(pathname)

  // `/services` is English: serve `/en/services` without changing the URL.
  if (!lang)
    return NextResponse.rewrite(new URL(`/${DEFAULT_LANG}${pathname}${search}`, request.url))

  // English has one URL, the unprefixed one.
  if (lang === DEFAULT_LANG) return NextResponse.redirect(new URL(path + search, request.url), 308)

  // A supported but disabled language: serve the site's 404 page.
  if (!isEnabledLanguage(lang))
    return NextResponse.rewrite(new URL(`/${DEFAULT_LANG}/404`, request.url), { status: 404 })

  return NextResponse.next()
}

export const config: MiddlewareConfig = {
  matcher: [
    // Everything except API routes, the Studio, Next internals and files with an extension…
    '/((?!api|admin|_next|_vercel|sitemap\\.xml|robots\\.txt|llms\\.txt|.*\\..*).*)',
    // …but the blog feed is a page route under `[lang]`.
    '/blog/rss.xml',
    '/:lang/blog/rss.xml',
  ],
}

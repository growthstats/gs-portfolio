import { BASE_URL, BLOG_DIR } from '@/lib/env'
import {
  DEFAULT_LANG,
  isEnabledLanguage,
  localizePath,
  parseLangFromPath,
  type Lang,
} from '@/lib/i18n'
import { linkList, pageToMd, postToMd } from '@/lib/markdown'
import { markdownUrl } from '@/lib/seo'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import {
  MARKDOWN_BLOG_INDEX_QUERY,
  MARKDOWN_PAGE_QUERY,
  MARKDOWN_POST_QUERY,
} from '@/sanity/queries/markdown.groq'
import type {
  MARKDOWN_BLOG_INDEX_QUERY_RESULT,
  MARKDOWN_PAGE_QUERY_RESULT,
  MARKDOWN_POST_QUERY_RESULT,
} from '@/sanity/sanity.types'

/*
 * Markdown copies of pages and posts (#138). `next.config.ts` rewrites
 * `/services.md` to `/api/md/services` and `/de/blog/post.md` to
 * `/api/md/de/blog/post`. English has no prefix (ADR 0001); a language
 * without a translation gets the English document (ADR 0002).
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string[] }> }) {
  const { lang: prefix, path } = parseLangFromPath('/' + (await params).slug.join('/'))
  const lang = prefix ?? DEFAULT_LANG
  const slug = path.slice(1)

  // English has one URL, the unprefixed one; disabled languages aren't served.
  if (prefix === DEFAULT_LANG || !isEnabledLanguage(lang) || !slug) return notFound()

  const markdown =
    slug === BLOG_DIR
      ? await blogIndexMd(lang)
      : slug.startsWith(`${BLOG_DIR}/`)
        ? await postMd(lang, slug.slice(BLOG_DIR.length + 1))
        : await pageMd(lang, slug)

  if (!markdown) return notFound()

  return new Response(markdown, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

const notFound = () =>
  new Response('Not found\n', {
    status: 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })

async function pageMd(lang: Lang, slug: string) {
  const page = await fetchSanityLive<MARKDOWN_PAGE_QUERY_RESULT>({
    query: MARKDOWN_PAGE_QUERY,
    params: { lang, slug },
  })

  return page && pageToMd(page)
}

async function postMd(lang: Lang, slug: string) {
  const post = await fetchSanityLive<MARKDOWN_POST_QUERY_RESULT>({
    query: MARKDOWN_POST_QUERY,
    params: { lang, slug },
  })

  return post && postToMd(post)
}

/** The blog page's own copy, then a link to every post's Markdown copy. */
async function blogIndexMd(lang: Lang) {
  const { page, posts } = await fetchSanityLive<MARKDOWN_BLOG_INDEX_QUERY_RESULT>({
    query: MARKDOWN_BLOG_INDEX_QUERY,
    params: { lang, blog: BLOG_DIR },
  })

  if (!page && !posts.length) return null

  const links = linkList(
    posts.map(({ title, slug, description }) => ({
      title,
      description,
      url: markdownUrl(BASE_URL + localizePath(`/${BLOG_DIR}/${slug}`, lang)),
    })),
  )

  return pageToMd({ ...page, title: page?.title || 'Blog' }).concat(
    links.length ? ['', '## Posts', '', ...links, ''].join('\n') : '',
  )
}

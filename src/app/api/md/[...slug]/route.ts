import { groq } from 'next-sanity'
import { BASE_URL, BLOG_DIR } from '@/lib/env'
import {
  DEFAULT_LANG,
  isEnabledLanguage,
  localizePath,
  parseLangFromPath,
  type Lang,
} from '@/lib/i18n'
import { linkList, pageToMd, postToMd, type MarkdownPage, type MarkdownPost } from '@/lib/markdown'
import { markdownUrl } from '@/lib/seo'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { IN_LANGUAGE, PREFER_LANGUAGE } from '@/sanity/lib/localized'
import { MODULES_QUERY } from '@/sanity/lib/queries'

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
  const page = await fetchSanityLive<MarkdownPage | null>({
    query: groq`*[
			_type == 'page'
			&& metadata.slug.current == $slug
			&& !(metadata.slug.current in ['404'])
			&& metadata.noIndex != true
			&& ${IN_LANGUAGE}
		] | ${PREFER_LANGUAGE}[0]{
			'title': coalesce(metadata.title, title),
			'description': metadata.description,
			modules[]{ ${MODULES_QUERY} },
		}`,
    params: { lang, slug },
  })

  return page && pageToMd(page)
}

async function postMd(lang: Lang, slug: string) {
  const post = await fetchSanityLive<MarkdownPost | null>({
    query: groq`*[
			_type == 'blog.post'
			&& metadata.slug.current == $slug
			&& metadata.noIndex != true
			&& ${IN_LANGUAGE}
		] | ${PREFER_LANGUAGE}[0]{
			'title': coalesce(title, metadata.title),
			'description': metadata.description,
			publishDate,
			'authors': authors[]->name,
			body[]{
				...,
				_type == 'image' => { 'src': asset->url, alt, caption },
			},
		}`,
    params: { lang, slug },
  })

  return post && postToMd(post)
}

/** The blog page's own copy, then a link to every post's Markdown copy. */
async function blogIndexMd(lang: Lang) {
  const { page, posts } = await fetchSanityLive<{
    page: MarkdownPage | null
    posts: { title?: string; slug?: string; description?: string }[]
  }>({
    query: groq`{
			'page': *[_type == 'page' && metadata.slug.current == $blog && ${IN_LANGUAGE}] | ${PREFER_LANGUAGE}[0]{
				'title': coalesce(metadata.title, title),
				'description': metadata.description,
				modules[]{ ${MODULES_QUERY} },
			},
			'posts': *[
				_type == 'blog.post'
				&& defined(metadata.slug.current)
				&& metadata.noIndex != true
				&& ${IN_LANGUAGE}
			] | order(publishDate desc){
				'title': coalesce(title, metadata.title),
				'slug': metadata.slug.current,
				'description': metadata.description,
			}
		}`,
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

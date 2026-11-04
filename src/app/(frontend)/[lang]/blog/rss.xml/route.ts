import { fetchSanityLive } from '@/sanity/lib/fetch'
import { groq } from 'next-sanity'
import { BLOG_DIR } from '@/lib/env'
import resolveUrl from '@/lib/resolveUrl'
import { Feed } from 'feed'
import { escapeHTML, toHTML } from '@portabletext/to-html'
import { urlFor } from '@/sanity/lib/image'
import { enabledLanguages, isEnabledLanguage } from '@/lib/i18n'
import { IN_LANGUAGE, SITE } from '@/sanity/lib/localized'

export function generateStaticParams() {
  return enabledLanguages.map((lang) => ({ lang }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  // Next types route params as strings; the proxy only lets enabled languages through.
  if (!isEnabledLanguage(lang)) return new Response('Not found', { status: 404 })

  const { blog, posts, copyright } = await fetchSanityLive<{
    blog: Sanity.Page
    posts: Array<Sanity.BlogPost & { image?: string }>
    copyright: string
  }>({
    query: groq`{
			'blog': *[_type == 'page' && metadata.slug.current == '${BLOG_DIR}' && ${IN_LANGUAGE}][0]{
				_type,
				title,
				metadata,
				'image': metadata.image.asset->url,
			},
			'posts': *[_type == 'blog.post' && ${IN_LANGUAGE}]{
				_type,
				title,
				body,
				publishDate,
				authors[]->,
				metadata,
				'image': metadata.image.asset->url,
			},
			'copyright': pt::text(${SITE}.copyright)
		}`,
    params: { lang },
  })

  if (!blog || !posts) {
    return new Response('Missing either a blog page or blog posts in Sanity Studio', {
      status: 500,
    })
  }

  const url = resolveUrl(blog, { language: lang })

  const feed = new Feed({
    title: blog?.title || blog.metadata.title,
    description: blog.metadata.description,
    link: url,
    id: url,
    copyright,
    favicon: process.env.NEXT_PUBLIC_BASE_URL + '/favicon.ico',
    language: lang,
    generator: 'https://sanitypress.dev',
  })

  posts.map((post) => {
    const url = resolveUrl(post, { language: lang })
    const displayTitle = post.title || post.metadata.title

    return feed.addItem({
      title: escapeHTML(displayTitle),
      description: post.metadata.description,
      id: url,
      link: url,
      published: new Date(post.publishDate),
      date: new Date(post.publishDate),
      author: post.authors?.map((author) => ({ name: author.name })),
      content: toHTML(post.body, {
        components: {
          types: {
            image: ({ value: { alt = '', caption, source, ...value } }) => {
              const img = `<img src="${urlFor(value).url()}" alt="${escapeHTML(alt)}" />`
              const figcaption = caption && `<figcaption>${escapeHTML(caption)}</figcaption>`
              const aSource = source && `<a href="${source}">(Source)</a>`
              return `<figure>${[img, figcaption, aSource].filter(Boolean).join(' ')}</figure>`
            },
            admonition: ({ value: { title, content } }) => {
              return `<dl><dt>${title}</dt><dd>${toHTML(content)}</dd></dl>`
            },
            code: ({ value }) => `<pre><code>${escapeHTML(value.code)}</code></pre>`,
            'custom-html': () => '',
          },
        },
      }),
      image: post.image,
    })
  })

  return new Response(feed.atom1(), {
    headers: {
      'Content-Type': 'application/atom+xml',
    },
  })
}

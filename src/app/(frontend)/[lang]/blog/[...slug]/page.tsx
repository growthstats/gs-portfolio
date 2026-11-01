import { notFound } from 'next/navigation'
import Modules from '@/ui/modules'
import BlogPostSchema from '@/ui/BlogPostSchema'
import processMetadata from '@/lib/processMetadata'
import { client } from '@/sanity/lib/client'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { groq } from 'next-sanity'
import { BLOG_DIR } from '@/lib/env'
import { IMAGE_QUERY, withGlobalModules } from '@/sanity/lib/queries'
import {
  IN_LANGUAGE,
  LANGUAGE,
  LOCALIZED_FIELDS,
  PREFER_LANGUAGE,
  localizedRefs,
  withTranslationLinks,
  type LocalizedResult,
} from '@/sanity/lib/localized'
import { DEFAULT_LANG, type Lang } from '@/lib/i18n'
import { cache } from 'react'
import errors from '@/lib/errors'

export default async function Page({ params }: Props) {
  const post = await getPost(await params)
  if (!post) notFound()
  return (
    <>
      <BlogPostSchema post={post} />
      <Modules modules={post.modules} post={post} />
    </>
  )
}

export async function generateMetadata({ params }: Props) {
  const post = await getPost(await params)
  if (!post) notFound()
  // `processMetadata` doesn't read the new `translations` shape yet (#68).
  return processMetadata({ ...post, translations: undefined })
}

export async function generateStaticParams({ params: { lang } }: { params: { lang: Lang } }) {
  // Each language's own documents, plus the English ones it renders as fallbacks.
  const slugs = await client.fetch<string[]>(
    groq`array::unique(*[
			_type == 'blog.post'
			&& defined(metadata.slug.current)
			&& ${LANGUAGE} in [$lang, '${DEFAULT_LANG}']
		].metadata.slug.current)`,
    { lang },
  )

  return slugs.map((slug) => ({ slug: slug.split('/') }))
}

function getPost({ lang, slug }: Params) {
  return fetchPost(lang, slug.join('/'))
}

// Keyed by strings so `Page` and `generateMetadata` share one fetch.
const fetchPost = cache(async (lang: Lang, slug: string) => {
  const blogTemplateExists = await fetchSanityLive<boolean>({
    query: groq`count(*[_type == 'global-module' && path == '${BLOG_DIR}/']) > 0`,
  })

  if (!blogTemplateExists) throw new Error(errors.missingBlogTemplate)

  const post = await fetchSanityLive<
    LocalizedResult<Sanity.BlogPost & { modules: Sanity.Module[] }>
  >({
    query: groq`*[
			_type == 'blog.post'
			&& metadata.slug.current == $slug
			&& ${IN_LANGUAGE}
		] | ${PREFER_LANGUAGE}[0]{
			...,
			body[]{
				...,
				_type == 'image' => {
					${IMAGE_QUERY},
					asset->
				}
			},
			'readTime': length(string::split(pt::text(body), ' ')) / 200,
			'headings': body[style in ['display-hero', 'display-xxl', 'display-xl', 'h1', 'h2', 'h3']]{
				style,
				'text': pt::text(@)
			},
			'categories': ${localizedRefs('categories')},
			authors[]->,
			metadata {
				...,
				'ogimage': image.asset->url + '?w=1200'
			},
			'modules': ${withGlobalModules('[]', `path == '${BLOG_DIR}/'`)},
			${LOCALIZED_FIELDS}
		}`,
    params: { lang, slug },
  })

  return post && withTranslationLinks(post)
})

type Params = { lang: Lang; slug: string[] }

type Props = {
  params: Promise<Params>
}

import { notFound } from 'next/navigation'
import Modules from '@/ui/modules'
import BlogPostSchema from '@/ui/BlogPostSchema'
import processMetadata from '@/lib/processMetadata'
import { client } from '@/sanity/lib/client'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { groq } from 'next-sanity'
import { BLOG_DIR } from '@/lib/env'
import { IMAGE_QUERY, MODULES_QUERY } from '@/sanity/lib/queries'
import {
  IN_LANGUAGE,
  LOCALIZED_FIELDS,
  localizedRefs,
  staticSlugs,
  withTranslationLinks,
  type LocalizedResult,
} from '@/sanity/lib/localized'
import type { Lang } from '@/lib/i18n'
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
  const docs = await client.fetch<{ slug: string; language: string }[]>(
    groq`*[_type == 'blog.post' && defined(metadata.slug.current)]{
			'slug': metadata.slug.current,
			'language': coalesce(language, 'en')
		}`,
  )

  return staticSlugs(docs, lang).map((slug) => ({ slug: slug.split('/') }))
}

async function getPost({ lang, slug: segments }: Params) {
  const blogTemplateExists = await fetchSanityLive<boolean>({
    query: groq`count(*[_type == 'global-module' && path == '${BLOG_DIR}/']) > 0`,
  })

  if (!blogTemplateExists) throw new Error(errors.missingBlogTemplate)

  const slug = segments.join('/')

  const post = await fetchSanityLive<
    LocalizedResult<Sanity.BlogPost & { modules: Sanity.Module[] }>
  >({
    query: groq`*[
			_type == 'blog.post'
			&& metadata.slug.current == $slug
			&& ${IN_LANGUAGE}
		][0]{
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
			'modules': (
				// global modules (before)
				*[_type == 'global-module' && path == '*' && ${IN_LANGUAGE}].before[]{ ${MODULES_QUERY} }
				// path modules (before)
				+ *[_type == 'global-module' && path == '${BLOG_DIR}/' && ${IN_LANGUAGE}].before[]{ ${MODULES_QUERY} }
				// path modules (after)
				+ *[_type == 'global-module' && path == '${BLOG_DIR}/' && ${IN_LANGUAGE}].after[]{ ${MODULES_QUERY} }
				// global modules (after)
				+ *[_type == 'global-module' && path == '*' && ${IN_LANGUAGE}].after[]{ ${MODULES_QUERY} }
			),
			${LOCALIZED_FIELDS}
		}`,
    params: { lang, slug },
  })

  return post && withTranslationLinks(post)
}

type Params = { lang: Lang; slug: string[] }

type Props = {
  params: Promise<Params>
}

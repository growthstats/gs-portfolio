import { notFound } from 'next/navigation'
import Modules from '@/ui/modules'
import FallbackNotice from '@/ui/FallbackNotice'
import BlogPostSchema from '@/ui/BlogPostSchema'
import processMetadata from '@/lib/processMetadata'
import { client } from '@/sanity/lib/client'
import { fetchSanityLive } from '@/sanity/lib/fetch'
import { groq } from 'next-sanity'
import { BLOG_DIR } from '@/lib/env'
import { BLOG_POST_QUERY, BLOG_POST_SLUGS_QUERY } from '@/sanity/queries/blog.groq'
import type { BLOG_POST_QUERY_RESULT, BLOG_POST_SLUGS_QUERY_RESULT } from '@/sanity/sanity.types'
import { withTranslationLinks } from '@/sanity/lib/localized'
import { isEnabledLanguage, type Lang } from '@/lib/i18n'
import { cache } from 'react'
import errors from '@/lib/errors'

export default async function Page({ params }: Props) {
  const { lang, slug } = await params
  // Next types route params as strings; the proxy only lets enabled languages through.
  if (!isEnabledLanguage(lang)) notFound()
  const post = await getPost({ lang, slug })
  if (!post) notFound()
  return (
    <>
      {post.isFallback && <FallbackNotice key={post._id} />}
      <BlogPostSchema post={post} />
      <Modules lang={lang} modules={post.modules} post={post} />
    </>
  )
}

export async function generateMetadata({ params }: Props) {
  const post = await getPost(await params)
  if (!post) notFound()
  return processMetadata(post)
}

export async function generateStaticParams({ params: { lang } }: { params: { lang: string } }) {
  // Each language's own documents, plus the English ones it renders as fallbacks.
  const slugs = await client.fetch<BLOG_POST_SLUGS_QUERY_RESULT>(BLOG_POST_SLUGS_QUERY, { lang })

  return slugs.filter((slug) => slug !== null).map((slug) => ({ slug: slug.split('/') }))
}

function getPost({ lang, slug }: Params) {
  if (!isEnabledLanguage(lang)) notFound()
  return fetchPost(lang, slug.join('/'))
}

// Keyed by strings so `Page` and `generateMetadata` share one fetch.
const fetchPost = cache(async (lang: Lang, slug: string) => {
  const blogTemplateExists = await fetchSanityLive<boolean>({
    query: groq`count(*[_type == 'global-module' && path == '${BLOG_DIR}/']) > 0`,
  })

  if (!blogTemplateExists) throw new Error(errors.missingBlogTemplate)

  const post = await fetchSanityLive<BLOG_POST_QUERY_RESULT>({
    query: BLOG_POST_QUERY,
    params: { lang, slug },
  })

  return post && withTranslationLinks(post)
})

type Params = { lang: string; slug: string[] }

type Props = {
  params: Promise<Params>
}

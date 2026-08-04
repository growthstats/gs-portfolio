import { fetchSanity } from '@/sanity/lib/fetch'
import { groq, stegaClean } from 'next-sanity'
import { BASE_URL, BLOG_DIR } from '@/lib/env'

export const dynamic = 'force-static'
export const revalidate = 3600

type Entry = { title?: string; slug?: string; desc?: string }

const clean = (v?: string) => stegaClean(v)?.trim() || undefined

function line(baseUrl: string, { title, desc }: Entry) {
  if (!title || !baseUrl) return null
  return desc ? `- [${title}](${baseUrl}): ${desc}` : `- [${title}](${baseUrl})`
}

export async function GET() {
  const data = await fetchSanity<{
    siteTitle?: string
    siteDesc?: string
    pages?: Entry[]
    posts?: Entry[]
  }>({
    query: groq`{
      'siteTitle': *[_type == 'site'][0].title,
      'siteDesc': *[_type == 'page' && metadata.slug.current == 'index'][0].metadata.description,
      'pages': *[
        _type == 'page' &&
        metadata.noIndex != true &&
        !(metadata.slug.current in ['404', 'index'])
      ]|order(metadata.slug.current){
        'title': coalesce(metadata.title, title),
        'slug': metadata.slug.current,
        'desc': metadata.description,
      },
      'posts': *[_type == 'blog.post' && metadata.noIndex != true]|order(publishDate desc){
        'title': coalesce(title, metadata.title),
        'slug': metadata.slug.current,
        'desc': metadata.description,
      }
    }`,
  })

  const siteTitle = clean(data.siteTitle) || 'Growth Stats'
  const siteDesc = clean(data.siteDesc)

  const pageLines = (data.pages ?? [])
    .filter((p) => clean(p.slug) && !clean(p.slug)!.includes('*'))
    .map((p) =>
      line(`${BASE_URL}/${clean(p.slug)}`, { ...p, title: clean(p.title), desc: clean(p.desc) }),
    )
    .filter(Boolean)

  const postLines = (data.posts ?? [])
    .map((p) =>
      line(`${BASE_URL}/${BLOG_DIR}/${clean(p.slug) ?? ''}`, {
        ...p,
        title: clean(p.title),
        desc: clean(p.desc),
      }),
    )
    .filter(Boolean)

  const body = [
    `# ${siteTitle}`,
    ...(siteDesc ? ['', `> ${siteDesc}`] : []),
    ...(pageLines.length ? ['', '## Pages', ...pageLines] : []),
    ...(postLines.length ? ['', '## Blog', ...postLines] : []),
    '',
    '## Optional',
    `- [Sitemap](${BASE_URL}/sitemap.xml)`,
    '',
  ].join('\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

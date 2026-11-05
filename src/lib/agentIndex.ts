import { stegaClean } from 'next-sanity'
import { BLOG_DIR } from './env'
import { linkList } from './markdown'
import { markdownUrl } from './seo'

/*
 * The site index that `llms.txt` and `agents.md` both list, so the two can't drift.
 * Fetched by `fetchAgentIndex` in `src/sanity/lib/agentIndex.ts`.
 */

export type AgentIndexEntry = { title?: string; slug?: string; desc?: string }

export type AgentIndex = {
  siteTitle?: string
  siteDesc?: string
  pages?: AgentIndexEntry[]
  posts?: AgentIndexEntry[]
}

const clean = (value?: string) => stegaClean(value)?.trim() || undefined

/** Each entry as a link to its `.md` copy. */
function entries(baseUrl: string, items: AgentIndexEntry[] = [], dir = '') {
  return linkList(
    items
      .map((item) => ({ ...item, slug: clean(item.slug) }))
      // `*` slugs are catch-all templates, not pages.
      .filter((item): item is AgentIndexEntry & { slug: string } =>
        Boolean(item.slug && !item.slug.includes('*')),
      )
      .map(({ title, slug, desc }) => ({
        title,
        url: markdownUrl(`${baseUrl}/${dir}${slug}`),
        description: desc,
      })),
  )
}

function sections(baseUrl: string, index: AgentIndex) {
  const pages = entries(baseUrl, index.pages)
  const posts = entries(baseUrl, index.posts, `${BLOG_DIR}/`)
  return [
    ...(pages.length ? ['', '## Pages', ...pages] : []),
    ...(posts.length ? ['', '## Blog', ...posts] : []),
  ]
}

function title(index: AgentIndex) {
  const desc = clean(index.siteDesc)
  return [`# ${clean(index.siteTitle) || 'Growth Stats'}`, ...(desc ? ['', `> ${desc}`] : [])]
}

/** `/llms.txt` (llmstxt.org): the site, then links to the Markdown copy of each page and post. */
export function llmsTxt(baseUrl: string, index: AgentIndex) {
  return [
    ...title(index),
    ...sections(baseUrl, index),
    '',
    '## Optional',
    `- [Agent directions](${baseUrl}/agents.md)`,
    `- [Sitemap](${baseUrl}/sitemap.xml)`,
    '',
  ].join('\n')
}

/** `/agents.md`: how to read the site as Markdown, then the same lists as `llms.txt`. */
export function agentsMd(baseUrl: string, index: AgentIndex) {
  return [
    ...title(index),
    '',
    '## Reading this site',
    '',
    '- Every page and blog post has a Markdown copy: append `.md` to its URL, e.g. `/services` → `/services.md`. The homepage is `/index.md`.',
    `- \`${baseUrl}/${BLOG_DIR}.md\` lists every blog post.`,
    '- English URLs have no language prefix. Other languages are prefixed, e.g. `/de/services.md`; a page without a translation is served in English.',
    `- \`${baseUrl}/llms.txt\` and \`${baseUrl}/sitemap.xml\` list the same pages.`,
    ...sections(baseUrl, index),
    '',
  ].join('\n')
}

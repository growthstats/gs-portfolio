import { describe, expect, it, vi } from 'vitest'
import { agentsMd, llmsTxt, type AgentIndex } from './agentIndex'

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com'
})

const index: AgentIndex = {
  siteTitle: 'Growth Stats',
  siteDesc: 'SEO agency',
  pages: [
    { title: 'Services', slug: 'services', desc: 'What we do' },
    { title: 'Template', slug: 'services/*' },
  ],
  posts: [{ title: 'A post', slug: 'a-post' }],
}

describe('llmsTxt', () => {
  it('links the Markdown copy of each page and post', () => {
    expect(llmsTxt('https://x.io', index)).toBe(
      [
        '# Growth Stats',
        '',
        '> SEO agency',
        '',
        '## Pages',
        '- [Services](https://x.io/services.md): What we do',
        '',
        '## Blog',
        '- [A post](https://x.io/blog/a-post.md)',
        '',
        '## Optional',
        '- [Agent directions](https://x.io/agents.md)',
        '- [Sitemap](https://x.io/sitemap.xml)',
        '',
      ].join('\n'),
    )
  })
})

describe('agentsMd', () => {
  it('lists the same pages and posts as llms.txt', () => {
    const md = agentsMd('https://x.io', index)
    expect(md).toContain('## Reading this site')
    expect(md).toContain('- [Services](https://x.io/services.md): What we do')
    expect(md).toContain('- [A post](https://x.io/blog/a-post.md)')
    expect(md).not.toContain('Template')
  })
})

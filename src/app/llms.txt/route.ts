import { BASE_URL } from '@/lib/env'
import { llmsTxt } from '@/lib/agentIndex'
import { fetchAgentIndex } from '@/sanity/lib/agentIndex'

export async function GET() {
  return new Response(llmsTxt(BASE_URL, await fetchAgentIndex()), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

import { BASE_URL } from '@/lib/env'
import { agentsMd } from '@/lib/agentIndex'
import { fetchAgentIndex } from '@/sanity/lib/agentIndex'

export async function GET() {
  return new Response(agentsMd(BASE_URL, await fetchAgentIndex()), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

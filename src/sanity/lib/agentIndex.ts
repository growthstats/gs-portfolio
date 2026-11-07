import { fetchSanityLive } from './fetch'
import { DEFAULT_LANG } from '@/lib/i18n'
import { AGENT_INDEX_QUERY } from '@/sanity/queries/feeds.groq'
import type { AGENT_INDEX_QUERY_RESULT } from '@/sanity/sanity.types'

/** English pages and posts for `llms.txt` and `agents.md`: the files list unprefixed URLs. */
export function fetchAgentIndex() {
  return fetchSanityLive<AGENT_INDEX_QUERY_RESULT>({
    query: AGENT_INDEX_QUERY,
    params: { lang: DEFAULT_LANG },
  })
}

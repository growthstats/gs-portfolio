import { groq } from 'next-sanity'
import { fetchSanityLive } from './fetch'
import { LANGUAGE, SITE } from './localized'
import { DEFAULT_LANG } from '@/lib/i18n'
import type { AgentIndex } from '@/lib/agentIndex'

/** English pages and posts for `llms.txt` and `agents.md`: the files list unprefixed URLs. */
export function fetchAgentIndex() {
  return fetchSanityLive<AgentIndex>({
    query: groq`{
      'siteTitle': ${SITE}.title,
      'siteDesc': *[_type == 'page' && metadata.slug.current == 'index' && ${LANGUAGE} == $lang][0].metadata.description,
      'pages': *[
        _type == 'page' &&
        ${LANGUAGE} == $lang &&
        metadata.noIndex != true &&
        !(metadata.slug.current in ['404', 'index'])
      ]|order(metadata.slug.current){
        'title': coalesce(metadata.title, title),
        'slug': metadata.slug.current,
        'desc': metadata.description,
      },
      'posts': *[_type == 'blog.post' && ${LANGUAGE} == $lang && metadata.noIndex != true]|order(publishDate desc){
        'title': coalesce(title, metadata.title),
        'slug': metadata.slug.current,
        'desc': metadata.description,
      }
    }`,
    params: { lang: DEFAULT_LANG },
  })
}

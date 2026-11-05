import { groq } from 'next-sanity'
import { VisualEditing } from 'next-sanity/visual-editing'
import { draftMode } from 'next/headers'

import { dev } from '@/lib/env'
import { fetchSanityLive, SanityLive } from '@/sanity/lib/fetch'
import { refreshDrafts } from '@/sanity/lib/refreshDrafts'

import DraftModeControls from './DraftModeControls'

export default async function VisualEditingControls() {
  const { isEnabled } = await draftMode()

  return (
    <>
      <SanityLive
        includeDrafts={isEnabled || dev}
        // Draft mode skips the cache, so a refresh is enough there.
        action={dev && !isEnabled ? refreshDrafts : undefined}
      />

      {isEnabled && (
        <>
          <VisualEditing />
          <DraftModeControls
            globalModules={await fetchSanityLive<Sanity.GlobalModule[]>({
              query: groq`*[_type == 'global-module']{
                _id,
                path,
                excludePaths[]
              }`,
            })}
          />
        </>
      )}
    </>
  )
}

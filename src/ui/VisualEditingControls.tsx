import { groq } from 'next-sanity'
import { VisualEditing } from 'next-sanity/visual-editing'
import { draftMode } from 'next/headers'

import { dev } from '@/lib/env'
import { fetchSanityLive, SanityLive } from '@/sanity/lib/fetch'

import DraftModeControls from './DraftModeControls'

export default async function VisualEditingControls() {
  const { isEnabled } = await draftMode()

  return (
    <>
      <SanityLive includeDrafts={isEnabled || dev} />

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

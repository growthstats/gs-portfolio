import { groq } from 'next-sanity'
import { VisualEditing } from 'next-sanity/visual-editing'
import { draftMode } from 'next/headers'

import { fetchSanityLive, SanityLive } from '@/sanity/lib/fetch'

import DraftModeControls from './DraftModeControls'

export default async function VisualEditingControls() {
  const globalModules: Sanity.GlobalModule[] = await fetchSanityLive({
    query: groq`*[_type == 'global-module']{
			_id,
			path,
			excludePaths[]
		}`,
  })

  return (
    <>
      <SanityLive />

      {(await draftMode()).isEnabled && (
        <>
          <VisualEditing />
          <DraftModeControls globalModules={globalModules} />
        </>
      )}
    </>
  )
}

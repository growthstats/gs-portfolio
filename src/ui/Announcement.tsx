import { fetchSanityLive } from '@/sanity/lib/fetch'
import { ANNOUNCEMENTS_QUERY } from '@/sanity/queries/announcement.groq'
import type { ANNOUNCEMENTS_QUERY_RESULT } from '@/sanity/sanity.types'
import Scheduler from './Scheduler'
import CTA from '@/ui/CTA'
import PortableText from '@/ui/PortableText'

export default async function Announcement() {
  const announcements = await fetchSanityLive<ANNOUNCEMENTS_QUERY_RESULT>({
    query: ANNOUNCEMENTS_QUERY,
  })

  if (!announcements) return null

  return (
    <>
      {announcements?.map(({ start, end, content, cta, _id }) => (
        <Scheduler start={start} end={end} key={_id}>
          <aside
            id="announcement"
            className="flex flex-col items-center justify-center gap-2 bg-accent p-2 text-center text-balance text-canvas max-md:text-sm md:flex-row md:gap-x-6"
          >
            <div className="anim-fade-to-r [&_a]:link">
              {content && <PortableText value={content ?? []} />}
            </div>

            <CTA className="shrink anim-fade-to-l link" link={cta} />
          </aside>
        </Scheduler>
      ))}
    </>
  )
}

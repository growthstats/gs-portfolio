import Scheduler from '@/ui/Scheduler'
import Modules from '.'
import type { Lang } from '@/lib/i18n'

export default function ScheduleModule({
  lang,
  start,
  end,
  modules,
}: { lang: Lang } & Partial<{
  start: string
  end: string
  modules: Sanity.Module[]
}>) {
  return (
    <Scheduler start={start} end={end}>
      <Modules lang={lang} modules={modules} />
    </Scheduler>
  )
}

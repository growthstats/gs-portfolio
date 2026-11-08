import Scheduler from '@/ui/Scheduler'
import Modules from '.'
import type { Lang } from '@/lib/i18n'
import type { ModuleOf } from '@/sanity/queries/page.groq'

export default function ScheduleModule({
  lang,
  start,
  end,
  modules,
}: { lang: Lang } & Pick<ModuleOf<'schedule-module'>, 'start' | 'end' | 'modules'>) {
  return (
    <Scheduler start={start} end={end}>
      <Modules lang={lang} modules={modules} />
    </Scheduler>
  )
}

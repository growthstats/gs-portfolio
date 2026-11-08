'use client'

import { tabbedContentStore } from './store'
import type { ModuleProps } from '@/sanity/queries/page.groq'
import { cn } from '@/lib/utils'

export default function TabList({ tabs }: Pick<ModuleProps<'tabbed-content'>, 'tabs'>) {
  const { active, setActive } = tabbedContentStore()

  return (
    <nav className="no-scrollbar flex overflow-x-auto max-md:full-bleed">
      {tabs?.map((tab, key) => (
        <button
          className={cn(
            'shrink-0 grow basis-[min(150px,80vw)] rounded-t border-b p-2 transition-all',
            key === active
              ? 'border-b-2 border-accent'
              : 'border-ink/10 text-ink/50 hover:text-ink',
          )}
          onClick={() => setActive(key)}
          key={key}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}

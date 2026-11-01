'use client'

import type { ReactNode } from 'react'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'
import { useDictionary } from '@/i18n/DictionaryProvider'
import type { Dictionary } from '@/i18n'

export type TeamCardId = keyof Dictionary['team']['cards']

/** The team placeholder's cards; `icons` are rendered on the server by `TeamPlaceholder`. */
export default function TeamPlaceholderCards({
  icons,
  className,
}: Readonly<{ icons: Record<TeamCardId, ReactNode>; className: string }>) {
  const { team } = useDictionary()

  return (
    <div aria-label={team.label} className={`w-full px-4 py-2 sm:px-6 lg:px-10 ${className}`}>
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          {(Object.keys(icons) as TeamCardId[]).map((id) => (
            <div
              key={id}
              className="flex flex-col items-center gap-2 overflow-visible rounded-3xl px-6 py-8 text-center shadow-(--shadow-card) transition-shadow duration-300"
            >
              <div
                className="flex h-20 w-20 items-center justify-center rounded-2xl shadow-(--shadow-badge)"
                aria-hidden
              >
                <div className="m-2 p-1 text-black">{icons[id]}</div>
              </div>

              <Heading as="h3" variant="h5" className="mt-3 text-center">
                {team.cards[id].title}
              </Heading>

              <Text as="p" variant="body" className="text-ink/80 text-center">
                {team.cards[id].description}
              </Text>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

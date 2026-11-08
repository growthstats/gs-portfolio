import { codeToHtml, splitLines, bundledThemes } from 'shiki'
import ClickToCopy from '@/ui/ClickToCopy'
import css from './Code.module.css'
import { cn } from '@/lib/utils'
import { stegaClean } from 'next-sanity'
import type { ComponentProps } from 'react'
import type { Code as CodeValue } from '@/sanity/sanity.types'

export default async function Code({
  value,
  theme = 'dark-plus',
  className,
}: {
  theme?: keyof typeof bundledThemes
  value?: Omit<CodeValue, '_type'> | null
} & ComponentProps<'article'>) {
  const code = value?.code
  if (!code) return null

  const html = await codeToHtml(stegaClean(code), {
    lang: value.language ?? 'text',
    theme,
    decorations: value.highlightedLines
      ?.map((row) => ({
        row,
        characters: stegaClean(splitLines(code)[row - 1]?.[0])?.length,
      }))
      ?.filter(({ characters }) => characters > 0)
      ?.map(({ row, characters }) => ({
        start: { line: row - 1, character: 0 },
        end: { line: row - 1, character: characters },
        properties: { class: 'highlight' },
      })),
  })

  const [path, filename] = value.filename?.includes('/')
    ? value.filename.split(/(.*)\/(.*)$/).filter(Boolean)
    : [, value.filename]

  return (
    <article className={cn('group relative rounded bg-ink/5', className)} data-module="code">
      {value.filename && (
        <div className="sticky top-0 z-1 -mb-1 rounded-t bg-[#323232] p-1 pb-0 font-mono text-xs text-canvas">
          <span className="inline-block rounded-t border-b border-blue-400 bg-[#1E1E1E] px-3 py-2">
            {path && <span className="text-canvas/50">{path}/</span>}
            <span>{filename}</span>
          </span>
        </div>
      )}

      <div className="inner relative">
        <div className="sticky top-1 z-1">
          <menu className="absolute top-0 right-0 flex items-center justify-end">
            <li>
              <ClickToCopy
                value={stegaClean(value.code)}
                className={cn(
                  'm-1 hidden anim-fade-to-l rounded p-[.3em] text-lg backdrop-blur group-hover:block hover:bg-white/10 active:scale-95 active:bg-white/20 [&.pointer-events-none]:block',
                  !theme.includes('light') && 'text-white',
                )}
              />
            </li>
          </menu>
        </div>

        <div
          className={cn(css.code, '[--highlight-color:var(--color-green-400)]')}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    </article>
  )
}

import moduleProps from '@/lib/moduleProps'
import { stegaClean } from 'next-sanity'
import { Sparkles } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import { toPascalCase } from '@/lib/lucideIconName'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'
import { Badge } from '@/components/ui/badge'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import type { ModuleOf, SectionChild } from '@/sanity/queries/page.groq'

const FALLBACK_ICON: LucideIcon = Sparkles
const ICON_CACHE = new Map<string, Promise<LucideIcon>>()

type SectionProps = {
  data: ModuleOf<'section'>
  dataSanity?: string
  renderModule?: (module: SectionChild, index: number) => ReactNode
}

export default async function Section({ data, dataSanity, renderModule }: Readonly<SectionProps>) {
  const { _type, _key, options, headingBadge, icon, module } = data

  const badge = sanitizeString(headingBadge)
  const iconName = sanitizeString(icon)
  const IconComponent = iconName ? await loadIcon(iconName) : null
  const pretitle = sanitizeString(data.pretitle)
  const title = sanitizeString(data.title) ?? ''
  const subtitle = sanitizeString(data.subtitle)

  const childModules = module?.filter((child): child is SectionChild => Boolean(child?._type)) ?? []
  const renderedChildren = renderModule
    ? childModules
        .map((child, index) => renderModule(child, index))
        .filter((child): child is ReactNode => child !== null && child !== undefined)
    : []

  return (
    <section {...moduleProps({ _type, _key, options })} data-sanity={dataSanity}>
      <div className="section space-y-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
          {(IconComponent || badge) && (
            <Badge
              variant="outline"
              className="gap-2 rounded-full px-4 py-1.5 text-sm font-semibold tracking-[0.1em] shadow-(--shadow-badge)"
            >
              {IconComponent && <IconComponent aria-hidden className="size-4" />}

              {badge}
            </Badge>
          )}

          {pretitle && (
            <Text as="p" variant="technical" className="tracking-[0.4em] text-accent">
              {pretitle}
            </Text>
          )}

          {title && (
            <Heading as="h2" variant="h2" balance className="leading-tight">
              {title}
            </Heading>
          )}

          {subtitle && (
            <Text as="p" variant="subtitle" className="max-w-prose text-ink/80">
              {subtitle}
            </Text>
          )}
        </div>

        {renderedChildren.length > 0 && <div className="w-full space-y-12">{renderedChildren}</div>}
      </div>
    </section>
  )
}

export function sanitizeString(value?: string | null) {
  if (!value) return undefined
  const cleaned = stegaClean(value)
  return typeof cleaned === 'string' ? cleaned.trim() : value.trim()
}

function isLucideIcon(icon: unknown): icon is LucideIcon {
  if (!icon) return false
  if (typeof icon === 'function') return true
  return typeof icon === 'object' && 'render' in (icon as Record<string, unknown>)
}

export async function loadIcon(name: string): Promise<LucideIcon> {
  const resolved = resolveIconImporter(name)
  const cacheKey = resolved?.key ?? name

  const cached = ICON_CACHE.get(cacheKey)
  if (cached) return cached

  if (!resolved) {
    const fallback = Promise.resolve(FALLBACK_ICON)
    ICON_CACHE.set(cacheKey, fallback)
    return fallback
  }

  const loader = resolved
    .importer()
    .then((module) => {
      const Icon = module.default

      return isLucideIcon(Icon) ? Icon : FALLBACK_ICON
    })
    .catch(() => FALLBACK_ICON)

  ICON_CACHE.set(cacheKey, loader)
  return loader
}

const iconImports: Partial<Record<string, () => Promise<{ default: LucideIcon }>>> =
  dynamicIconImports

// The Studio stores PascalCase names (see lucideIconOptions), which can't be turned back into
// slugs reliably: `Settings2` is `settings-2`, `ArrowDown01` is `arrow-down-0-1`. Index the
// slugs by their PascalCase form instead.
let slugsByPascalName: Map<string, string> | undefined

export function resolveIconImporter(name: string) {
  slugsByPascalName ??= new Map(
    Object.keys(dynamicIconImports).map((slug) => [toPascalCase(slug), slug]),
  )

  for (const candidate of createIconCandidates(name)) {
    const key = iconImports[candidate] ? candidate : slugsByPascalName.get(candidate)
    const importer = key && iconImports[key]
    if (importer) {
      return { key, importer }
    }
  }

  return undefined
}

function createIconCandidates(value: string) {
  const trimmed = value.trim()
  const base = trimmed
    .replace(/^lucide[-_:]/i, '')
    .replace(/\.svg$/i, '')
    .replace(/[-_ ]?icon$/i, '')

  const slug = base
    .replaceAll(/[\s_:/]+/g, '-')
    .replaceAll(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replaceAll(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .replaceAll(/-+/g, '-')
    .replaceAll(/^-|-$/g, '')
    .toLowerCase()

  return Array.from(
    new Set([trimmed, trimmed.toLowerCase(), base, base.toLowerCase(), slug]),
  ).filter(Boolean)
}

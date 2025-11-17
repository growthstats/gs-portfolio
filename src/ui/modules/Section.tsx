import moduleProps from '@/lib/moduleProps'
import { stegaClean } from 'next-sanity'
import { Sparkles } from 'lucide-react'
import dynamicIconImports from 'lucide-react/dynamicIconImports'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'
import { Badge } from '@/components/ui/badge'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

const FALLBACK_ICON: LucideIcon = Sparkles
const ICON_CACHE = new Map<string, Promise<LucideIcon>>()

type SectionProps = {
  data: Sanity.SectionModule
  dataSanity?: string
  renderModule?: (module: Sanity.Module, index: number) => ReactNode
}

export default async function Section({ data, dataSanity, renderModule }: Readonly<SectionProps>) {
  const { headingBadge, icon, module } = data

  const badge = sanitizeString(headingBadge)
  const iconName = sanitizeString(icon)
  const IconComponent = iconName ? await loadIcon(iconName) : null
  const pretitle = sanitizeString(data.pretitle)
  const title = sanitizeString(data.title) ?? ''
  const subtitle = sanitizeString(data.subtitle)

  const childModules = Array.isArray(module) ? module.filter(isSanityModule) : []
  const renderedChildren = renderModule
    ? childModules
        .map((child, index) => renderModule(child, index))
        .filter((child): child is ReactNode => child !== null && child !== undefined)
    : []

  return (
    <section {...moduleProps(data)} data-sanity={dataSanity}>
      <div className="section space-y-8">
        <header className="mx-auto flex w-full max-w-4xl flex-col items-center gap-4 text-center">
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
            <Text as="p" variant="technical" className="text-accent tracking-[0.4em]">
              {pretitle}
            </Text>
          )}

          <Heading as="h2" variant="h2" balance className="leading-tight">
            {title}
          </Heading>

          {subtitle && (
            <Text as="p" variant="subtitle" className="text-ink/70 max-w-prose">
              {subtitle}
            </Text>
          )}
        </header>

        {renderedChildren.length > 0 && <div className="w-full space-y-8">{renderedChildren}</div>}
      </div>
    </section>
  )
}

function sanitizeString(value?: string | null) {
  if (!value) return undefined
  const cleaned = stegaClean(value)
  return typeof cleaned === 'string' ? cleaned.trim() : value.trim()
}

function isLucideIcon(icon: unknown): icon is LucideIcon {
  return typeof icon === 'function' && 'displayName' in icon
}

async function loadIcon(name: string): Promise<LucideIcon> {
  const key = normalizeIconName(name)

  const cached = ICON_CACHE.get(key)
  if (cached) return cached

  const importIcon = (dynamicIconImports as Record<string, () => Promise<{ default: LucideIcon }>>)[
    key
  ]

  if (!importIcon) {
    const fallback = Promise.resolve(FALLBACK_ICON)
    ICON_CACHE.set(key, fallback)
    return fallback
  }

  const loader = importIcon()
    .then((module) => {
      const Icon = module.default
      return isLucideIcon(Icon) ? Icon : FALLBACK_ICON
    })
    .catch(() => FALLBACK_ICON)

  ICON_CACHE.set(key, loader)
  return loader
}

function normalizeIconName(value: string) {
  return value
    .replaceAll(/\s+/g, '-')
    .replaceAll(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replaceAll(/([A-Z])([A-Z][a-z])/g, '$1-$2')
    .toLowerCase()
}

function isSanityModule(value: unknown): value is Sanity.Module {
  if (!value || typeof value !== 'object') return false
  return '_type' in value
}

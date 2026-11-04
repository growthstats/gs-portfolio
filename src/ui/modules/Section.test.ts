import { describe, expect, it, vi } from 'vitest'

vi.hoisted(() => {
  process.env.NEXT_PUBLIC_BASE_URL = 'https://example.com'
})

import { LUCIDE_ICON_OPTIONS } from '@/sanity/schemaTypes/utils/lucideIconOptions'
import { loadIcon, resolveIconImporter } from './Section'

// Icon names stored in `production` section and service-list modules (queried 2026-11-04).
const STORED_ICONS = ['Settings2', 'User2', 'Package', 'Pencil', 'Search']

describe('Lucide icon names', () => {
  it('resolves every icon stored in content', () => {
    for (const name of STORED_ICONS) {
      expect(resolveIconImporter(name), name).toBeDefined()
    }
  })

  it('resolves every option the Studio offers', () => {
    const unresolved = LUCIDE_ICON_OPTIONS.filter(({ value }) => !resolveIconImporter(value))
    expect(unresolved).toEqual([])
  })

  it('loads a real component for a stored icon', async () => {
    const Icon = await loadIcon('Settings2')
    expect(Icon.displayName).toMatch(/settings/i)
  })
})

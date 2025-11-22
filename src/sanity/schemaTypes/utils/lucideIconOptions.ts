import { iconNames } from 'lucide-react/dynamic'

type IconOption = {
  title: string
  value: string
}

const toTitleCase = (value: string) =>
  value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

const toPascalCase = (value: string) =>
  value
    .split(/[-_]/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')

export const LUCIDE_ICON_OPTIONS: IconOption[] = iconNames.map((slug) => ({
  title: toTitleCase(slug),
  value: toPascalCase(slug),
}))

export const OPTIONAL_LUCIDE_ICON_OPTIONS: IconOption[] = [
  { title: 'No icon', value: '' },
  ...LUCIDE_ICON_OPTIONS,
]

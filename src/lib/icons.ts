import { ArrowRight, Check, Circle, Info, Star, Search, Plus, Minus } from 'lucide-react'

export const ICONS = {
  arrowRight: ArrowRight,
  check: Check,
  circle: Circle,
  info: Info,
  star: Star,
  search: Search,
  plus: Plus,
  minus: Minus,
} as const

export type IconName = keyof typeof ICONS

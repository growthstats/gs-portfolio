import { clsx, type ClassValue } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'

const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        {
          text: [
            'display-hero',
            'display-xl',
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',
            'body-lg',
            'body',
            'body-sm',
            'body-xs',
          ],
        },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs))
}

export function count(arr: Array<unknown> | number, singular: string = 'item', plural?: string) {
  const num = typeof arr === 'number' ? arr : arr?.length || 0
  return `${num || 0} ${num === 1 ? singular : plural || singular + 's'}`
}

export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  delay: number = 1000,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return function (this: unknown, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export const { format: formatCurrency } = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function slug(str: string) {
  return str
    .toLowerCase()
    .replaceAll(/[\s\W]+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

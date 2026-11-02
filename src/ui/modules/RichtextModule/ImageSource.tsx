'use client'

import { useDictionary } from '@/i18n/DictionaryProvider'

/** The caption's source link; a client component because Portable Text components get no `lang`. */
export default function ImageSource({ href }: { href: string }) {
  const { richtext } = useDictionary()

  return (
    <a href={href} className="image-source link">
      {richtext.imageSource}
    </a>
  )
}

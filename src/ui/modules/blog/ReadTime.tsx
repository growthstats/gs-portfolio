import { getDictionary } from '@/i18n'
import { plural } from '@/i18n/format'
import type { Lang } from '@/lib/i18n'

export default function ReadTime({
  lang,
  value,
  ...props
}: { lang: Lang; value: number } & React.ComponentProps<'span'>) {
  const { blog } = getDictionary(lang)

  return <span {...props}>{plural(lang, Math.ceil(value), blog.readTime)}</span>
}

import CTA, { type CTAValue } from './CTA'
import { cn } from '@/lib/utils'

export default function CTAList({
  ctas,
  className,
}: {
  ctas?: CTAValue[] | null
} & React.ComponentProps<'div'>) {
  if (!ctas?.length) return null

  return (
    <div className={cn('flex flex-wrap items-center gap-[.5em]', className)}>
      {ctas?.map((cta) => (
        <CTA
          className="max-sm:w-full"
          link={cta?.link}
          style={cta?.style ?? 'default'}
          key={cta?._key}
        />
      ))}
    </div>
  )
}

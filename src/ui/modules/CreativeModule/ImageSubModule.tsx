import { Img } from '@/ui/Img'
import { stegaClean } from 'next-sanity'
import type { CreativeSubModule } from '.'

export default function ImageSubModule({
  module,
  ...props
}: {
  module: CreativeSubModule<'image'>
} & Omit<React.ComponentProps<typeof Img>, 'image'>) {
  return (
    <figure>
      <Img
        className="w-full object-cover"
        style={{ aspectRatio: stegaClean(module.aspectRatio) }}
        image={module}
        {...props}
      />
    </figure>
  )
}

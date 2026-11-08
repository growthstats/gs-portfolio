import CTAList from '@/ui/CTAList'
import type { CreativeSubModule } from '.'

export default function CTAsSubModule({
  module,
  ...props
}: {
  module: CreativeSubModule<'ctas'>
} & React.ComponentProps<typeof CTAList>) {
  return <CTAList ctas={module.ctas} {...props} />
}

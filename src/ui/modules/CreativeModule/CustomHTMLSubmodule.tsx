import CustomHTML from '@/ui/modules/CustomHTML'

import type { CreativeSubModule } from '.'

export default function CustomHTMLSubmodule({
  module,
}: {
  module: CreativeSubModule<'custom-html'>
}) {
  return <CustomHTML {...module} />
}

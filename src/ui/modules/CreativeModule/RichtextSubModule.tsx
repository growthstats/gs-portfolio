import Pretitle from '@/ui/Pretitle'
import PortableText from '@/ui/PortableText'
import type { CreativeSubModule } from '.'

export default function RichtextSubModule({
  module,
}: Readonly<{
  module: CreativeSubModule<'richtext'>
}>) {
  return (
    <div className="richtext">
      <Pretitle>{module.pretitle}</Pretitle>
      {module.content && <PortableText value={module.content ?? []} />}
    </div>
  )
}

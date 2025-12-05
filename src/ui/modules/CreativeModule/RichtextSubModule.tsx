import Pretitle from '@/ui/Pretitle'
import { PortableText } from 'next-sanity'

export type RichtextSubModuleType = Sanity.Module<'richtext'> &
  Partial<{
    pretitle: string
    content: Sanity.PortableText
  }>

export default function RichtextSubModule({
  module,
}: Readonly<{
  module: RichtextSubModuleType
}>) {
  return (
    <div className="richtext">
      <Pretitle>{module.pretitle}</Pretitle>
      {module.content && <PortableText value={module.content ?? []} />}
    </div>
  )
}

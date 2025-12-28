import { stegaClean } from 'next-sanity'
import { dev } from './env'

export default function moduleProps({ _type, options, _key, ...props }: Partial<Sanity.Module>) {
  const hidden = stegaClean(options?.hidden)

  return {
    id: stegaClean(options?.uid) || 'module-' + _key,
    'data-module': _type,
    hidden: !dev && hidden,
    ...props,
  }
}

import { stegaClean } from 'next-sanity'
import { dev } from './env'

/** The module fields that become attributes on the module's root element. */
type ModuleAttributeSource = {
  _type?: string
  _key?: string
  options?: { hidden?: boolean; uid?: string } | null
  lang?: string
}

export default function moduleProps<P extends ModuleAttributeSource>({
  _type,
  options,
  _key,
  ...props
}: P) {
  const hidden = stegaClean(options?.hidden)

  return {
    id: stegaClean(options?.uid) || 'module-' + _key,
    'data-module': _type,
    hidden: !dev && Boolean(hidden),
    ...props,
    // `Modules` hands every module `lang`; the root element inherits it from `<html>`.
    lang: undefined,
  } as Omit<P, keyof ModuleAttributeSource> & {
    id: string
    'data-module'?: string
    hidden: boolean
    lang: undefined
  }
}

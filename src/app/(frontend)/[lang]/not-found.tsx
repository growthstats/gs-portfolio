import { NotFoundContent } from '@/ui/NotFoundContent'
import { get404 } from '@/ui/NotFoundModules'
import { DEFAULT_LANG } from '@/lib/i18n'

// The content comes from the layout, which knows the language (see `NotFoundProvider`).
export default function NotFound() {
  return <NotFoundContent />
}

// Metadata has no way to learn the language, so the 404 title stays English.
export async function generateMetadata() {
  return (await get404(DEFAULT_LANG))?.metadata
}

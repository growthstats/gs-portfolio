import moduleProps from '@/lib/moduleProps'
import Heading from '@/ui/Heading'
import ContactForm from './contactPlaceholderForm'
import { getDictionary } from '@/i18n'
import type { ModuleProps } from '@/sanity/queries/page.groq'

export default function LetsTalkPlaceholder({
  lang,
  ...props
}: ModuleProps<'lets-talk-placeholder'>) {
  const { letsTalk } = getDictionary(lang)

  return (
    <div
      className="section grid gap-10 rounded-3xl p-8 lg:grid-cols-[1.2fr_1fr]"
      {...moduleProps(props)}
    >
      <div className="flex flex-col justify-center space-y-5 text-center">
        <Heading as="h2" variant="display-xxl" className="text-balance">
          {letsTalk.heading}
        </Heading>
      </div>

      <div className="rounded-3xl p-6 shadow-(--shadow-card) md:p-8">
        <ContactForm />
      </div>
    </div>
  )
}

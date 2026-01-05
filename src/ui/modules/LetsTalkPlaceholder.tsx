import moduleProps from '@/lib/moduleProps'
import Heading from '@/ui/Heading'
import ContactForm from './contactPlaceholderForm'

export default function LetsTalkPlaceholder(props: Readonly<Sanity.Module>) {
  return (
    <div
      className="section grid gap-10 rounded-3xl p-8 lg:grid-cols-[1.2fr_1fr]"
      {...moduleProps(props)}
    >
      <div className="flex flex-col justify-center space-y-5 text-center">
        <Heading as="h2" variant="display-xxl" className="text-balance">
          Let&apos;s Talk
        </Heading>
      </div>

      <div className="rounded-3xl p-6 shadow-(--shadow-card) md:p-8">
        <ContactForm />
      </div>
    </div>
  )
}

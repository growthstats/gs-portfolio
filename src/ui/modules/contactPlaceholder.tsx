import { Mail, Phone } from 'lucide-react'
import Social from '@/ui/Social'
import Heading from '@/ui/Heading'
import Text from '@/ui/Text'
import ContactForm from './contactPlaceholderForm'

export default function ContactPlaceholder() {
  return (
    <div className="section w-full space-y-20 py-20">
      {/* =====================================================
          SECTION 1: CONTACT INFO + MAP
      ===================================================== */}
      <div className="mx-auto max-w-6xl md:px-4">
        <Heading as="h2" variant="h2" className="mb-8 text-center">
          Contact Us
        </Heading>

        <div className="rounded-3xl shadow-(--shadow-card)">
          {/* Map */}
          <div className="overflow-hidden rounded-t-2xl px-2 pt-2 md:px-8 md:pt-8">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps?q=Ganesh%20Nagar%20Ghorpadi%20Pune&output=embed"
              className="h-[220px] w-full rounded-2xl"
              loading="lazy"
            />
          </div>

          {/* Content */}
          <div className="grid gap-8 px-8 py-8 md:grid-cols-3">
            {/* Location */}
            <div>
              <Heading as="h3" variant="h5" className="mb-2">
                Location
              </Heading>
              {/* TODO: Check SEO Implications of breaking sentence */}
              <Text as="p" variant="body">
                B.T Kawade Road, Sai Sulochana,
                <br />
                opposite to shirke company,
                <br />
                Ganesh Nagar, Ghorpadi, Pune.
                <br />
                Maharashtra 411036
              </Text>
            </div>

            {/* General Inquiries */}
            <div>
              <Heading as="h3" variant="h5" className="mb-2">
                General Inquiries
              </Heading>

              <div className="text-ink/70 flex items-center gap-3">
                <Mail className="size-4" />
                <a href="mailto:info@growthstats.io" className="text-body hover:underline">
                  info@growthstats.io
                </a>
              </div>

              <div className="text-ink/70 mt-2 flex items-center gap-3">
                <Phone className="size-4" />
                <a href="tel:+919156409994 text-body" className="hover:underline">
                  +91 91564 09994
                </a>
              </div>
            </div>

            {/* Social */}
            <div>
              <Heading as="h3" variant="h5" className="mb-2">
                Social
              </Heading>

              <Social className="mb-auto -ml-2" />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          SECTION 2: GET IN TOUCH FORM
      ===================================================== */}
      <div className="mx-auto max-w-5xl md:px-4">
        <Heading as="h2" variant="h2" className="mb-8 text-center">
          Get in Touch
        </Heading>

        <div className="md:px-8 md:pb-8">
          <ContactForm />
        </div>
      </div>
    </div>
  )
}

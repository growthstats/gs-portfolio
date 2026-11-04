import { z } from 'zod'
import type { Dictionary } from '@/i18n'
import { format } from '@/i18n/format'

type ContactFormErrors = Dictionary['contactForm']['errors']

/** Builds the contact form schema with validation messages in one language. */
export function createContactFormSchema(errors: ContactFormErrors) {
  const tooLong = (max: number) => format(errors.tooLong, { max })

  return z.object({
    name: z.string().trim().min(1, errors.nameRequired).max(200, tooLong(200)),
    phone: z.string().trim().min(6, errors.phoneRequired).max(40, tooLong(40)),
    // z.email() checks before any later .trim(), so trim first and pipe into it.
    email: z.string().trim().max(320, tooLong(320)).pipe(z.email(errors.emailInvalid)),
    // Optional; accepts bare domains like "example.com" as well as full URLs.
    website: z
      .string()
      .trim()
      .max(300, tooLong(300))
      .regex(/^$|^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i, errors.websiteInvalid),
    message: z.string().trim().min(1, errors.messageRequired).max(5000, tooLong(5000)),
  })
}

export type ContactFormValues = z.infer<ReturnType<typeof createContactFormSchema>>

/**
 * Hidden field real visitors never fill; bots that do are dropped silently.
 * Must not collide with a real field name, or genuine leads get discarded.
 */
export const HONEYPOT_FIELD = 'fax'

import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  phone: z.string().trim().min(6, 'Phone number is required').max(40),
  email: z.string().trim().email('Enter a valid email').max(320),
  message: z.string().trim().min(1, 'Message is required').max(5000),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

/** Hidden field real visitors never fill; bots that do are dropped silently. */
export const HONEYPOT_FIELD = 'website'

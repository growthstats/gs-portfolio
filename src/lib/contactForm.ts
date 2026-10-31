import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200),
  phone: z.string().trim().min(6, 'Phone number is required').max(40),
  email: z.string().trim().email('Enter a valid email').max(320),
  // Optional; accepts bare domains like "example.com" as well as full URLs.
  website: z
    .string()
    .trim()
    .max(300)
    .regex(/^$|^(https?:\/\/)?[^\s/.]+(\.[^\s/.]+)+(\/\S*)?$/i, 'Enter a valid website'),
  message: z.string().trim().min(1, 'Message is required').max(5000),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

/**
 * Hidden field real visitors never fill; bots that do are dropped silently.
 * Must not collide with a real field name, or genuine leads get discarded.
 */
export const HONEYPOT_FIELD = 'fax'

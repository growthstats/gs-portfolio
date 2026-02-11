import { z } from 'zod'

export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(6, 'Phone number is required'),
  email: z.string().email('Enter a valid email'),
  message: z.string().min(1, 'Message is required'),
})

export type ContactFormValues = z.infer<typeof contactFormSchema>

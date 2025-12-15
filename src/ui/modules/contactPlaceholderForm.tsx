'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: z.string().min(6, 'Phone number is required'),
  email: z.string().email('Enter a valid email'),
  message: z.string().min(1, 'Message is required'),
})

type FormValues = z.infer<typeof formSchema>

export default function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = (values: FormValues) => {
    console.log('Contact form submitted', values)
    reset()
  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="contact-name">
            Name
          </label>
          <input
            id="contact-name"
            type="text"
            placeholder="Enter Your name"
            className="input w-full rounded-md px-4 py-2 text-sm shadow-(--shadow-card) focus:border-neutral-400"
            aria-invalid={!!errors.name}
            {...register('name')}
          />
          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium" htmlFor="contact-phone">
            Phone Number
          </label>
          <input
            id="contact-phone"
            type="tel"
            placeholder="+91 XXXX XXXXX"
            className="input w-full rounded-md px-4 py-2 text-sm shadow-(--shadow-card) focus:border-neutral-400"
            aria-invalid={!!errors.phone}
            {...register('phone')}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="contact-email">
          Email
        </label>
        <input
          id="contact-email"
          type="email"
          placeholder="example@gmail.com"
          className="input w-full rounded-md px-4 py-2 text-sm shadow-(--shadow-card) focus:border-neutral-400"
          aria-invalid={!!errors.email}
          {...register('email')}
        />
        {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium" htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          rows={4}
          className="input w-full resize-none rounded-md px-4 py-2 text-sm shadow-(--shadow-card) focus:border-neutral-400"
          aria-invalid={!!errors.message}
          {...register('message')}
        />
        {errors.message && <p className="mt-1 text-xs text-red-600">{errors.message.message}</p>}
      </div>

      <div className="pt-4 text-center">
        <Button
          type="submit"
          className="inline-flex w-full max-w-xs items-center justify-center rounded-md px-6 py-2.5 text-sm font-medium"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting…' : 'Submit'}
        </Button>
      </div>
    </form>
  )
}

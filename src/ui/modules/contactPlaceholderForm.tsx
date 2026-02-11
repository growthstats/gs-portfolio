'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { contactFormSchema, type ContactFormValues } from '@/lib/contactForm'

export default function ContactForm() {
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error'
    message: string
  } | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      message: '',
    },
  })

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitStatus(null)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Form submission failed with status ${response.status}`)
      }

      setSubmitStatus({
        type: 'success',
        message: 'Form submitted successfully!',
      })
      reset()
    } catch (error) {
      console.error('Form submission error:', error)
      setSubmitStatus({
        type: 'error',
        message: 'Error submitting the form. Please try again.',
      })
    }
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

        {submitStatus && (
          <p
            className={`mt-3 text-sm ${submitStatus.type === 'success' ? 'text-green-700' : 'text-red-600'}`}
            role="status"
          >
            {submitStatus.message}
          </p>
        )}
      </div>
    </form>
  )
}

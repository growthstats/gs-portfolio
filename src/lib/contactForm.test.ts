import { describe, expect, it } from 'vitest'
import { z } from 'zod'
import { getDictionary } from '@/i18n'
import { createContactFormSchema } from './contactForm'

const lead = {
  name: 'Ada',
  phone: '+49 30 123456',
  email: 'ada@example.com',
  website: 'example.com',
  message: 'Hello',
}

function errorsFor(lang: 'en' | 'de', values: Record<string, string>) {
  const result = createContactFormSchema(getDictionary(lang).contactForm.errors).safeParse(values)
  return result.success ? {} : z.flattenError(result.error).fieldErrors
}

describe('createContactFormSchema', () => {
  it('accepts a valid lead', () => {
    expect(errorsFor('en', lead)).toEqual({})
  })

  it('reports errors in English', () => {
    expect(errorsFor('en', { ...lead, name: ' ', email: 'nope' })).toEqual({
      name: ['Name is required'],
      email: ['Enter a valid email'],
    })
  })

  it('reports errors in German', () => {
    expect(errorsFor('de', { ...lead, website: 'not a site' })).toEqual({
      website: ['Bitte geben Sie eine gültige Website ein'],
    })
  })

  it('trims the email before checking it', () => {
    const schema = createContactFormSchema(getDictionary('en').contactForm.errors)
    expect(schema.parse({ ...lead, email: '  ada@example.com ' }).email).toBe('ada@example.com')
  })

  it('reports an overlong email by its length', () => {
    expect(errorsFor('en', { ...lead, email: `${'a'.repeat(320)}@example.com` })).toEqual({
      email: ['Must be at most 320 characters'],
    })
  })

  it('fills the length limit into the message', () => {
    expect(errorsFor('en', { ...lead, phone: '1'.repeat(41) })).toEqual({
      phone: ['Must be at most 40 characters'],
    })
  })
})

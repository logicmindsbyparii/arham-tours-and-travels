import { z } from 'zod'
import { email, httpUrl, optionalImageRef, required, text } from './common.js'

export const loginSchema = z.object({
  email,
  // Length cap keeps bcrypt (which reads at most 72 bytes) from being fed huge input.
  password: z.string().min(1, 'Password is required').max(200),
})

// At least 10 characters with a letter and a number.
export const newPassword = z
  .string()
  .min(10, 'Use at least 10 characters')
  .max(72, 'Use at most 72 characters')
  .refine((value) => /[A-Za-z]/.test(value) && /\d/.test(value), 'Include at least one letter and one number')

export const profileSchema = z.object({
  name: required(80, 'Name'),
  email,
})

export const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, 'Enter your current password').max(200),
    newPassword,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    path: ['newPassword'],
    message: 'Choose a password different from the current one',
  })

const phoneNumber = z
  .string()
  .trim()
  .transform((value) => value.replace(/[\s()+-]/g, ''))
  .refine((value) => /^\d{8,15}$/.test(value), 'Use digits with the country code, e.g. 919824100369')

export const settingsSchema = z.object({
  businessName: required(80, 'Business name'),
  legalName: text(120).default(''),
  contactPerson: text(80).default(''),
  city: text(60).default(''),
  hours: text(120).default(''),
  whatsappNumber: phoneNumber,
  whatsappMessage: text(300).default(''),
  phones: z
    .array(z.object({ label: required(40, 'Phone label'), number: phoneNumber }))
    .max(5, 'Use at most 5 phone numbers')
    .default([]),
  email: z.union([z.literal(''), email]).default(''),
  addressLines: z
    .array(text(120))
    .max(5)
    .transform((lines) => lines.filter(Boolean))
    .default([]),
  socialLinks: z
    .array(z.object({ label: required(40, 'Link label'), url: httpUrl }))
    .max(10)
    .default([]),
  logo: optionalImageRef('Logo'),
  seoTitle: text(70).default(''),
  seoDescription: text(170).default(''),
})

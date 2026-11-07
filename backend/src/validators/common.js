import mongoose from 'mongoose'
import { z } from 'zod'
import { SLUG_PATTERN } from '../utils/helpers.js'
import { STATUSES } from '../models/plugins.js'

// Text: trimmed, with a maximum length. required() also rejects blank text.
export const text = (max) => z.string({ error: 'Must be text' }).trim().max(max, `Use at most ${max} characters`)
export const required = (max, label = 'This field') => text(max).min(1, `${label} is required`)

export const status = z.enum(STATUSES, { error: 'Choose draft or published' })
export const sortOrder = z
  .number({ error: 'Enter a number' })
  .int('Use a whole number')
  .min(-10000)
  .max(10000)
  .default(0)

export const slug = z
  .string()
  .trim()
  .toLowerCase()
  .max(80, 'Use at most 80 characters')
  .refine((value) => value === '' || SLUG_PATTERN.test(value), 'Use lowercase letters, numbers and single dashes only')

export const objectId = z.string().refine((value) => mongoose.isValidObjectId(value), 'Invalid id')
export const optionalObjectId = z
  .union([objectId, z.literal(''), z.null()])
  .transform((value) => value || null)
  .default(null)

const ASSET_REF = /^asset:[a-z0-9-]{1,60}$/
const UPLOAD_REF = /^\/uploads\/[A-Za-z0-9._-]{1,120}$/

function isHttpsUrl(value) {
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

// An image is one of: a built-in website image ("asset:goa-beach"), a file
// uploaded through the admin ("/uploads/…"), or a full http(s) URL.
export const imageRef = (label = 'Image') =>
  z
    .string()
    .trim()
    .max(500)
    .refine(
      (value) => ASSET_REF.test(value) || UPLOAD_REF.test(value) || isHttpsUrl(value),
      `${label} must be an uploaded image, a website image or an http(s) URL`,
    )
export const optionalImageRef = (label) => z.union([z.literal(''), imageRef(label)]).default('')

// Links inside the website ("/packages", "#contact") or full http(s) URLs.
// Rejects javascript:, data: and protocol-relative ("//evil.com") links.
export const siteLink = z
  .string()
  .trim()
  .max(300)
  .refine(
    (value) => value === '' || /^#[A-Za-z0-9_-]*$/.test(value) || /^\/(?!\/)[^\s]*$/.test(value) || isHttpsUrl(value),
    'Use a page path like /packages, a section like #contact, or a full https:// URL',
  )

export const httpUrl = z.string().trim().max(300).refine(isHttpsUrl, 'Enter a full URL starting with https://')

export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the date format YYYY-MM-DD').refine((value) => {
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().startsWith(value)
}, 'Enter a real date')

// A list of short text items; blank lines are dropped.
export const textList = (maxItems, maxLength) =>
  z
    .array(text(maxLength))
    .max(maxItems, `Use at most ${maxItems} items`)
    .transform((items) => items.filter(Boolean))
    .default([])

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
export const email = z.string().trim().toLowerCase().max(254).regex(EMAIL_PATTERN, 'Enter a valid email address')

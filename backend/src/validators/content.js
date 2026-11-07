import { z } from 'zod'
import { CURRENCIES, PACKAGE_CATEGORIES } from '../models/Package.js'
import { ACCENTS } from '../models/Destination.js'
import { SERVICE_ICONS } from '../models/Service.js'
import { FAQ_PAGES } from '../models/Faq.js'
import { CONTENT_SECTIONS } from '../models/SiteContent.js'
import { INQUIRY_STATUSES } from '../models/Inquiry.js'
import {
  imageRef,
  isoDate,
  optionalImageRef,
  optionalObjectId,
  required,
  siteLink,
  slug,
  sortOrder,
  status,
  text,
  textList,
} from './common.js'

// Only the fields listed in each schema are ever written to the database
// (unknown fields are stripped), so a request cannot set ids, timestamps or
// other internal fields.

export const packageSchema = z
  .object({
    title: required(140, 'Package name'),
    slug: slug.default(''),
    region: required(80, 'Destination'),
    category: z.enum(PACKAGE_CATEGORIES, { error: 'Choose domestic or international' }),
    featured: z.boolean().default(false),
    nights: z.number({ error: 'Enter the number of nights' }).int().min(0).max(60),
    days: z.number({ error: 'Enter the number of days' }).int().min(1).max(61),
    price: z.number({ error: 'Enter a price' }).min(0, 'Price cannot be negative').max(100000000),
    currency: z.enum(CURRENCIES).default('INR'),
    priceBasis: text(80).default('per person'),
    badge: text(80).default(''),
    places: textList(30, 80),
    description: required(600, 'Short description'),
    fullDescription: text(6000).default(''),
    highlights: textList(30, 200),
    inclusions: textList(40, 200),
    exclusions: textList(40, 200),
    hotels: textList(20, 200),
    itinerary: z
      .array(
        z.object({
          day: z.number().int().min(1).max(60),
          title: required(120, 'Day title'),
          description: text(2000).default(''),
        }),
      )
      .max(60)
      .default([]),
    departures: z.array(isoDate).max(40).default([]),
    validUntil: z.union([isoDate, z.literal('')]).default(''),
    image: imageRef('Main image'),
    imageAlt: text(200).default(''),
    gallery: z
      .array(z.object({ src: imageRef('Gallery image'), alt: text(200).default('') }))
      .max(20, 'Use at most 20 gallery images')
      .default([]),
    flyer: optionalImageRef('Flyer'),
    seoTitle: text(70).default(''),
    seoDescription: text(170).default(''),
    status: status.default('draft'),
    sortOrder,
  })
  .refine((data) => data.days >= data.nights, { path: ['days'], message: 'Days cannot be fewer than nights' })

export const destinationSchema = z.object({
  name: required(80, 'Name'),
  slug: slug.default(''),
  tagline: required(300, 'Short description'),
  description: text(3000).default(''),
  image: imageRef(),
  imageAlt: text(200).default(''),
  package: optionalObjectId,
  accent: z.enum(ACCENTS).default('azure'),
  featured: z.boolean().default(false),
  status: status.default('draft'),
  sortOrder,
})

export const bannerSchema = z.object({
  name: required(80, 'Name'),
  titleLine1: required(24, 'Title line 1'),
  titleLine2: text(24).default(''),
  subtitle: required(220, 'Subtitle'),
  image: imageRef(),
  imageAlt: text(200).default(''),
  ctaLabel: text(40).default('Explore trips'),
  ctaLink: siteLink.default('#packages'),
  package: optionalObjectId,
  accent: z.enum(ACCENTS).default('azure'),
  active: z.boolean().default(true),
  sortOrder,
})

export const serviceSchema = z.object({
  title: required(80, 'Title'),
  slug: slug.default(''),
  summary: required(600, 'Description'),
  features: textList(12, 100),
  icon: z.enum(SERVICE_ICONS).default('Plane'),
  image: optionalImageRef(),
  imageAlt: text(200).default(''),
  inquiryLabel: text(60).default(''),
  status: status.default('draft'),
  sortOrder,
})

export const testimonialSchema = z.object({
  name: required(80, 'Customer name'),
  trip: text(120).default(''),
  quote: required(1500, 'Review text'),
  source: text(80).default(''),
  image: optionalImageRef(),
  rating: z.union([z.number().int().min(1).max(5), z.null()]).default(null),
  status: status.default('draft'),
  sortOrder,
})

export const faqSchema = z.object({
  question: required(250, 'Question'),
  answer: required(2000, 'Answer'),
  page: z.enum(FAQ_PAGES, { error: 'Choose the page this question appears on' }),
  status: status.default('draft'),
  sortOrder,
})

export const siteContentSchema = z.object({
  key: z.enum(Object.keys(CONTENT_SECTIONS), { error: 'Choose a website section' }),
  eyebrow: text(60).default(''),
  title: text(120).default(''),
  accent: text(120).default(''),
  intro: text(600).default(''),
  body: text(4000).default(''),
  image: optionalImageRef(),
  imageAlt: text(200).default(''),
  status: status.default('draft'),
})

export const visaCountrySchema = z.object({
  name: required(80, 'Country name'),
  slug: slug.default(''),
  flag: text(20).default(''),
  image: optionalImageRef('Photo'),
  tagline: text(300).default(''),
  processingTime: text(120).default(''),
  stayDuration: text(120).default(''),
  validity: text(120).default(''),
  entryType: text(120).default(''),
  documentGroups: z
    .array(
      z.object({
        title: required(120, 'Group title'),
        items: textList(40, 300),
      }),
    )
    .max(12, 'Use at most 12 document groups')
    .default([]),
  charges: z
    .array(
      z.object({
        visaType: required(120, 'Visa type'),
        currency: z.enum(CURRENCIES).default('INR'),
        embassyFee: z
          .number({ error: 'Enter an embassy fee, use 0 if there is none' })
          .min(0, 'Embassy fee cannot be negative'),
        serviceFee: z
          .number({ error: 'Enter a service fee, use 0 if there is none' })
          .min(0, 'Service fee cannot be negative'),
        processingTime: text(120).default(''),
        note: text(300).default(''),
      }),
    )
    .max(15, 'Use at most 15 fee rows')
    .default([]),
  chargesNote: text(500).default(''),
  notes: text(1500).default(''),
  status: status.default('draft'),
  sortOrder,
})

export const statusChangeSchema = z.object({ status })
export const activeChangeSchema = z.object({ active: z.boolean() })

export const publicInquirySchema = z.object({
  name: required(100, 'Your name'),
  phone: required(30, 'Phone / WhatsApp number'),
  email: z.string().trim().email('Enter a valid email').max(100).or(z.literal('')).default(''),
  service: required(100, 'Service required'),
  destination: text(120).default(''),
  travelDate: text(50).default(''),
  travellers: z.union([z.string(), z.number()]).transform(String).default('1'),
  message: text(2000).default(''),
  source: text(50).default('website'),
})

export const inquirySchema = z.object({
  name: required(100, 'Customer name'),
  phone: required(30, 'Phone / WhatsApp number'),
  email: z.string().trim().email('Enter a valid email').max(100).or(z.literal('')).default(''),
  service: required(100, 'Service required'),
  destination: text(120).default(''),
  travelDate: text(50).default(''),
  travellers: z.union([z.string(), z.number()]).transform(String).default('1'),
  message: text(2000).default(''),
  status: z.enum(INQUIRY_STATUSES).default('new'),
  notes: text(2000).default(''),
  source: text(50).default('website'),
})

export const inquiryStatusSchema = z.object({
  status: z.enum(INQUIRY_STATUSES),
  notes: text(2000).optional(),
})

import mongoose from 'mongoose'
import { STATUSES, cleanJson } from './plugins.js'

export const PACKAGE_CATEGORIES = ['domestic', 'international']
export const CURRENCIES = ['INR', 'USD', 'EUR', 'AED']

const itineraryDaySchema = new mongoose.Schema(
  {
    day: { type: Number, min: 1, max: 60 },
    title: { type: String, trim: true, maxlength: 120 },
    description: { type: String, trim: true, maxlength: 2000 },
  },
  { _id: false },
)

const galleryImageSchema = new mongoose.Schema(
  {
    src: { type: String, trim: true, maxlength: 500 },
    alt: { type: String, trim: true, maxlength: 200 },
  },
  { _id: false },
)

// Field names follow the website's existing package data (src/data/packages.js)
// so the public components render database records unchanged.
const packageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 80 },
    region: { type: String, required: true, trim: true, maxlength: 80 },
    category: { type: String, enum: PACKAGE_CATEGORIES, required: true },
    featured: { type: Boolean, default: false },
    nights: { type: Number, required: true, min: 0, max: 60 },
    days: { type: Number, required: true, min: 1, max: 61 },
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, enum: CURRENCIES, default: 'INR' },
    priceBasis: { type: String, trim: true, maxlength: 80, default: 'per person' },
    badge: { type: String, trim: true, maxlength: 80, default: '' },
    places: [{ type: String, trim: true, maxlength: 80 }],
    description: { type: String, required: true, trim: true, maxlength: 600 },
    fullDescription: { type: String, trim: true, maxlength: 6000, default: '' },
    highlights: [{ type: String, trim: true, maxlength: 200 }],
    inclusions: [{ type: String, trim: true, maxlength: 200 }],
    exclusions: [{ type: String, trim: true, maxlength: 200 }],
    hotels: [{ type: String, trim: true, maxlength: 200 }],
    itinerary: [itineraryDaySchema],
    departures: [{ type: String, match: /^\d{4}-\d{2}-\d{2}$/ }],
    validUntil: { type: String, match: /^\d{4}-\d{2}-\d{2}$/ },
    image: { type: String, required: true, trim: true, maxlength: 500 },
    imageAlt: { type: String, trim: true, maxlength: 200, default: '' },
    gallery: [galleryImageSchema],
    flyer: { type: String, trim: true, maxlength: 500, default: '' },
    seoTitle: { type: String, trim: true, maxlength: 70, default: '' },
    seoDescription: { type: String, trim: true, maxlength: 170, default: '' },
    status: { type: String, enum: STATUSES, default: 'draft', index: true },
    sortOrder: { type: Number, default: 0 },
    publishedAt: Date,
  },
  { timestamps: true },
)

packageSchema.index({ status: 1, sortOrder: 1 })
cleanJson(packageSchema)

export const Package = mongoose.model('Package', packageSchema)

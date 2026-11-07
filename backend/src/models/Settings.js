import mongoose from 'mongoose'
import { cleanJson } from './plugins.js'

const socialLinkSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, maxlength: 40 },
    url: { type: String, trim: true, maxlength: 300 },
  },
  { _id: false },
)

const phoneSchema = new mongoose.Schema(
  {
    label: { type: String, trim: true, maxlength: 40 },
    // Digits with country code, no "+" or spaces, e.g. 919824100369.
    number: { type: String, trim: true, match: /^\d{8,15}$/ },
  },
  { _id: false },
)

// Business details used across the website (one document, key "business").
const settingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'business', unique: true, immutable: true },
    businessName: { type: String, trim: true, maxlength: 80, required: true },
    legalName: { type: String, trim: true, maxlength: 120, default: '' },
    contactPerson: { type: String, trim: true, maxlength: 80, default: '' },
    city: { type: String, trim: true, maxlength: 60, default: '' },
    hours: { type: String, trim: true, maxlength: 120, default: '' },
    whatsappNumber: { type: String, trim: true, match: /^\d{8,15}$/, required: true },
    whatsappMessage: { type: String, trim: true, maxlength: 300, default: '' },
    phones: { type: [phoneSchema], default: [] },
    email: { type: String, trim: true, lowercase: true, maxlength: 254, default: '' },
    addressLines: [{ type: String, trim: true, maxlength: 120 }],
    socialLinks: { type: [socialLinkSchema], default: [] },
    logo: { type: String, trim: true, maxlength: 500, default: '' },
    seoTitle: { type: String, trim: true, maxlength: 70, default: '' },
    seoDescription: { type: String, trim: true, maxlength: 170, default: '' },
  },
  { timestamps: true },
)

cleanJson(settingsSchema)

export const Settings = mongoose.model('Settings', settingsSchema)

import mongoose from 'mongoose'
import { STATUSES, cleanJson } from './plugins.js'

export const CURRENCIES = ['INR', 'USD', 'EUR', 'AED']

const documentGroupSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true, maxlength: 120, default: '' },
    items: [{ type: String, trim: true, maxlength: 300 }],
  },
  { _id: false },
)

const chargeRowSchema = new mongoose.Schema(
  {
    visaType: { type: String, required: true, trim: true, maxlength: 120 },
    currency: { type: String, enum: CURRENCIES, default: 'INR' },
    embassyFee: { type: Number, required: true, min: 0, default: 0 },
    serviceFee: { type: Number, required: true, min: 0, default: 0 },
    processingTime: { type: String, trim: true, maxlength: 120, default: '' },
    note: { type: String, trim: true, maxlength: 300, default: '' },
  },
  { _id: false },
)

const visaCountrySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 80 },
    flag: { type: String, trim: true, maxlength: 20, default: '' },
    image: { type: String, trim: true, maxlength: 500, default: '' },
    tagline: { type: String, trim: true, maxlength: 300, default: '' },
    processingTime: { type: String, trim: true, maxlength: 120, default: '' },
    stayDuration: { type: String, trim: true, maxlength: 120, default: '' },
    validity: { type: String, trim: true, maxlength: 120, default: '' },
    entryType: { type: String, trim: true, maxlength: 120, default: '' },
    documentGroups: [documentGroupSchema],
    charges: [chargeRowSchema],
    chargesNote: { type: String, trim: true, maxlength: 500, default: '' },
    notes: { type: String, trim: true, maxlength: 1500, default: '' },
    status: { type: String, enum: STATUSES, default: 'draft', index: true },
    sortOrder: { type: Number, default: 0 },
    publishedAt: Date,
  },
  { timestamps: true },
)

cleanJson(visaCountrySchema)

export const VisaCountry = mongoose.model('VisaCountry', visaCountrySchema)

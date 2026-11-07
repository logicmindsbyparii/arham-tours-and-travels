import mongoose from 'mongoose'
import { STATUSES, cleanJson } from './plugins.js'

// The page whose FAQ section shows the question.
export const FAQ_PAGES = ['destinations', 'services', 'carRental', 'contact', 'visa']

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true, maxlength: 250 },
    answer: { type: String, required: true, trim: true, maxlength: 2000 },
    page: { type: String, enum: FAQ_PAGES, required: true, index: true },
    status: { type: String, enum: STATUSES, default: 'draft', index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
)

cleanJson(faqSchema)

export const Faq = mongoose.model('Faq', faqSchema)

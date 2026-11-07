import mongoose from 'mongoose'
import { STATUSES, cleanJson } from './plugins.js'

// Real customer reviews only, published with the customer's permission.
const testimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    trip: { type: String, trim: true, maxlength: 120, default: '' },
    quote: { type: String, required: true, trim: true, maxlength: 1500 },
    source: { type: String, trim: true, maxlength: 80, default: '' },
    image: { type: String, trim: true, maxlength: 500, default: '' },
    rating: { type: Number, min: 1, max: 5, default: null },
    status: { type: String, enum: STATUSES, default: 'draft', index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
)

cleanJson(testimonialSchema)

export const Testimonial = mongoose.model('Testimonial', testimonialSchema)

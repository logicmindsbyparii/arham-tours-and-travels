import { Schema, model } from 'mongoose'
import { cleanJson } from './plugins.js'

export const INQUIRY_STATUSES = ['new', 'contacted', 'in_progress', 'converted', 'closed']

const inquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    email: { type: String, trim: true, lowercase: true, maxlength: 100, default: '' },
    service: { type: String, required: true, trim: true, maxlength: 100 },
    destination: { type: String, trim: true, maxlength: 120, default: '' },
    travelDate: { type: String, trim: true, maxlength: 50, default: '' },
    travellers: { type: String, trim: true, maxlength: 50, default: '1' },
    message: { type: String, trim: true, maxlength: 2000, default: '' },
    status: { type: String, enum: INQUIRY_STATUSES, default: 'new', index: true },
    notes: { type: String, trim: true, maxlength: 2000, default: '' },
    source: { type: String, trim: true, maxlength: 50, default: 'website' },
  },
  { timestamps: true },
)

inquirySchema.plugin(cleanJson)

export const Inquiry = model('Inquiry', inquirySchema)


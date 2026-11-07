import mongoose from 'mongoose'
import { STATUSES, cleanJson } from './plugins.js'

// Icon names the website knows how to draw (frontend/src/data/icons.js).
export const SERVICE_ICONS = ['Plane', 'Stamp', 'Hotel', 'Ship', 'CarFront', 'Luggage', 'Train', 'Bus', 'Globe', 'ShieldCheck', 'Map', 'Camera']

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 80 },
    summary: { type: String, required: true, trim: true, maxlength: 600 },
    features: [{ type: String, trim: true, maxlength: 100 }],
    icon: { type: String, enum: SERVICE_ICONS, default: 'Plane' },
    image: { type: String, trim: true, maxlength: 500, default: '' },
    imageAlt: { type: String, trim: true, maxlength: 200, default: '' },
    inquiryLabel: { type: String, trim: true, maxlength: 60, default: '' },
    status: { type: String, enum: STATUSES, default: 'draft', index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
)

cleanJson(serviceSchema)

export const Service = mongoose.model('Service', serviceSchema)

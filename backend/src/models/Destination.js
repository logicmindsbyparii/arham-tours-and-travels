import mongoose from 'mongoose'
import { STATUSES, cleanJson } from './plugins.js'

export const ACCENTS = ['ember', 'azure', 'jade']

// A place on the itineraries, shown as a postcard and in the destination
// guide. `package` links it to the trip that visits it.
const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 80 },
    tagline: { type: String, required: true, trim: true, maxlength: 300 },
    description: { type: String, trim: true, maxlength: 3000, default: '' },
    image: { type: String, required: true, trim: true, maxlength: 500 },
    imageAlt: { type: String, trim: true, maxlength: 200, default: '' },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', default: null },
    accent: { type: String, enum: ACCENTS, default: 'azure' },
    featured: { type: Boolean, default: false },
    status: { type: String, enum: STATUSES, default: 'draft', index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
)

cleanJson(destinationSchema)

export const Destination = mongoose.model('Destination', destinationSchema)

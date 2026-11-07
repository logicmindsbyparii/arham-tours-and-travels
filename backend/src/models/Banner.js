import mongoose from 'mongoose'
import { cleanJson } from './plugins.js'
import { ACCENTS } from './Destination.js'

// One slide of the home page hero. The two title lines are the large poster
// words; `package` supplies the duration and price shown under the subtitle
// and the trip that "Plan this trip" enquires about.
const bannerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    titleLine1: { type: String, required: true, trim: true, maxlength: 24 },
    titleLine2: { type: String, trim: true, maxlength: 24, default: '' },
    subtitle: { type: String, required: true, trim: true, maxlength: 220 },
    image: { type: String, required: true, trim: true, maxlength: 500 },
    imageAlt: { type: String, trim: true, maxlength: 200, default: '' },
    ctaLabel: { type: String, trim: true, maxlength: 40, default: 'Explore trips' },
    ctaLink: { type: String, trim: true, maxlength: 300, default: '#packages' },
    package: { type: mongoose.Schema.Types.ObjectId, ref: 'Package', default: null },
    accent: { type: String, enum: ACCENTS, default: 'azure' },
    active: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
)

cleanJson(bannerSchema)

export const Banner = mongoose.model('Banner', bannerSchema)

import mongoose from 'mongoose'
import { STATUSES, cleanJson } from './plugins.js'

// Editable text and images for the website's existing sections. Each key
// matches one section component on the frontend; a section uses the fields it
// has room for and falls back to its built-in text for the rest.
export const CONTENT_SECTIONS = {
  'home.about': 'Home: About us',
  'home.packages': 'Home: Tour packages heading',
  'home.destinations': 'Home & Destinations: postcard gallery heading',
  'home.services': 'Home: Travel services heading',
  'home.visa': 'Home: Visa assistance heading',
  'home.contact': 'All pages: Contact / plan your trip heading',
  'packages.banner': 'Packages page: banner',
  'destinations.banner': 'Destinations page: banner',
  'services.banner': 'Services page: banner',
  'visa.banner': 'Visa page: banner',
  'about.banner': 'About page: banner',
}

const siteContentSchema = new mongoose.Schema(
  {
    key: { type: String, enum: Object.keys(CONTENT_SECTIONS), required: true, unique: true },
    eyebrow: { type: String, trim: true, maxlength: 60, default: '' },
    title: { type: String, trim: true, maxlength: 120, default: '' },
    accent: { type: String, trim: true, maxlength: 120, default: '' },
    intro: { type: String, trim: true, maxlength: 600, default: '' },
    body: { type: String, trim: true, maxlength: 4000, default: '' },
    image: { type: String, trim: true, maxlength: 500, default: '' },
    imageAlt: { type: String, trim: true, maxlength: 200, default: '' },
    status: { type: String, enum: STATUSES, default: 'draft', index: true },
  },
  { timestamps: true },
)

cleanJson(siteContentSchema)

export const SiteContent = mongoose.model('SiteContent', siteContentSchema)

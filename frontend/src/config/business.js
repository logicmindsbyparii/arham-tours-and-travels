// Business details shown across the site. This is the only file to edit when
// contact details change.
//
// SOURCE: https://arhamtours.in/ (Contact and About pages) and the package
// flyers published on its Tour Package page, checked October 2026.
// The registered business on that site is "Arham Holiday Designer LLP";
// "Arham Tours & Travels" is the brand name used for this website.

export const BUSINESS = {
  name: 'Arham Tours & Travels',
  legalName: 'Arham Holiday Designer LLP',
  city: 'Surat',
  contactPerson: 'Ashish Shah',
  hours: '10:00 AM – 7:00 PM, Monday to Saturday (closed Sunday)',
}

// WhatsApp number in international format, digits only (no "+", spaces or dashes).
// NOT VERIFIED AS A WHATSAPP NUMBER: arhamtours.in lists 98241 00369 as its phone
// number but publishes no WhatsApp link. Confirm with the business before launch
// and change it here if WhatsApp uses a different number.
export const WHATSAPP_NUMBER = '919824100369'

// The one contact number shown across the site (as asked by the business).
export const PHONE_NUMBERS = [{ label: '+91 98241 00369', href: 'tel:+919824100369' }]
export const EMAILS = ['info@arhamtours.in']

export const ADDRESS = {
  lines: ['Aagam Emporio 9, 2nd floor', 'U M Road, Surat'],
}

export const MAP_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${BUSINESS.legalName}, ${ADDRESS.lines.join(', ')}`,
)}`

// Google Maps embed for the Contact page (needs no API key).
export const MAP_EMBED_URL = `https://maps.google.com/maps?q=${encodeURIComponent(
  `${BUSINESS.legalName}, ${ADDRESS.lines.join(', ')}`,
)}&output=embed`

// The address this website is published at, with no trailing slash. Used for
// canonical links, the sitemap and search-engine structured data.
// CHANGE THIS if the site goes live on a different domain.
export const SITE_URL = 'https://arhamtours.in'

// The live site only links to its website builder's placeholder social pages,
// so no real profiles are known. Add full profile URLs here and the footer shows them.
// Example: { label: 'Instagram', href: 'https://www.instagram.com/your-handle/' }
export const SOCIAL_LINKS = []

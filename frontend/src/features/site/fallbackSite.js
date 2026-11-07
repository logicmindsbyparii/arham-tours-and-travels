// The website's built-in content, in the same shape as GET /public/site.
// Shown until the API answers, and kept when it cannot be reached, so the
// site never renders empty. Once the API responds, the database content
// (managed in the admin panel) replaces it.
import { ADDRESS, BUSINESS, EMAILS, PHONE_NUMBERS, SOCIAL_LINKS, WHATSAPP_NUMBER } from '../../config/business.js'
import { packages } from '../../data/packages.js'
import { destinations } from '../../data/destinations.js'
import { services } from '../../data/services.js'
import { testimonials } from '../../data/testimonials.js'
import { FAQS } from '../../data/faqs.js'
import { visaCountries } from '../../data/visaCountries.js'
import {
  CAR_COLUMNS,
  OUTSTATION_FIXED_FARES,
  SURAT_LOCAL_DUTY,
  EXTRA_CHARGES,
  TERMS_AND_CONDITIONS,
  TEMPO_BUS_VEHICLES,
  TEMPO_BUS_FIXED_ROUTES,
} from '../../data/carRates.js'

export const fallbackCarRates = {
  carColumns: CAR_COLUMNS,
  outstationFixedFares: OUTSTATION_FIXED_FARES,
  localDuty: SURAT_LOCAL_DUTY,
  extraCharges: EXTRA_CHARGES,
  termsAndConditions: TERMS_AND_CONDITIONS,
  tempoBusVehicles: TEMPO_BUS_VEHICLES,
  tempoBusFixedRoutes: TEMPO_BUS_FIXED_ROUTES,
  note: 'GST 5% extra on total bill amount. Toll tax, parking & border tax extra as applicable.',
}

export const fallbackSettings = {
  businessName: BUSINESS.name,
  legalName: BUSINESS.legalName,
  contactPerson: BUSINESS.contactPerson,
  city: BUSINESS.city,
  hours: BUSINESS.hours,
  whatsappNumber: WHATSAPP_NUMBER,
  whatsappMessage: '',
  phones: PHONE_NUMBERS.map((phone) => ({ label: phone.label, number: phone.href.replace(/\D/g, '') })),
  email: EMAILS[0] ?? '',
  addressLines: ADDRESS.lines,
  socialLinks: SOCIAL_LINKS.map((link) => ({ label: link.label, url: link.href })),
  logo: '',
  seoTitle: '',
  seoDescription: '',
}

const packageMap = Object.fromEntries(packages.map((pkg) => [pkg.id, pkg]))

export const countryBanners = [
  {
    id: 'banner-uae',
    name: 'United Arab Emirates',
    poster: ['Dubai', 'Emirates'],
    tagline: 'Futuristic skylines, desert dunes, and Arabian luxury.',
    image: 'asset:dubai-hero',
    imageAlt: 'Dubai skyline and Burj Khalifa towering above clouds',
    accent: 'azure',
    ctaLabel: 'Explore trips',
    ctaLink: '#packages',
    package: packageMap['dubai-uae-5n'] || null,
  },
  {
    id: 'banner-thailand',
    name: 'Thailand',
    poster: ['Thailand', 'Islands'],
    tagline: 'Golden Buddhist temples, turquoise island lagoons, and vibrant night markets.',
    image: 'asset:thailand-hero',
    imageAlt: 'Traditional long-tail boat on crystal turquoise waters in Thailand',
    accent: 'jade',
    ctaLabel: 'Explore trips',
    ctaLink: '#packages',
    package: packageMap['thailand-bangkok-phuket-6n'] || null,
  },
  {
    id: 'banner-singapore',
    name: 'Singapore',
    poster: ['Singapore', 'Cityscape'],
    tagline: 'Futuristic supertrees, Sentosa Island thrills, and world-class architecture.',
    image: 'asset:singapore-hero',
    imageAlt: 'Marina Bay Sands and Gardens by the Bay in Singapore',
    accent: 'azure',
    ctaLabel: 'Explore trips',
    ctaLink: '#packages',
    package: packageMap['singapore-sentosa-5n'] || null,
  },
  {
    id: 'banner-indonesia',
    name: 'Indonesia',
    poster: ['Bali', 'Indonesia'],
    tagline: 'Emerald rice terraces, ocean cliff temples, and serene tropical beaches.',
    image: 'asset:bali-hero',
    imageAlt: 'Lush tropical sea cliff and emerald waters in Bali Indonesia',
    accent: 'ember',
    ctaLabel: 'Explore trips',
    ctaLink: '#packages',
    package: packageMap['bali-indonesia-6n'] || null,
  },
  {
    id: 'banner-switzerland',
    name: 'Switzerland',
    poster: ['Swiss', 'Alps'],
    tagline: 'Snow-capped alpine peaks, scenic glacier trains, and crystal mountain lakes.',
    image: 'asset:switzerland-hero',
    imageAlt: 'Majestic snow-capped Swiss Alps and alpine lake',
    accent: 'azure',
    ctaLabel: 'Explore trips',
    ctaLink: '#packages',
    package: packageMap['switzerland-alps-6n'] || null,
  },
]

export const fallbackSite = {
  settings: fallbackSettings,
  packages,
  destinations: destinations.map(({ packageId, poster, ...place }) => {
    void packageId
    void poster
    return place
  }),
  // Hero slides feature top countries with their respective packages
  banners: countryBanners,
  services,
  visaCountries,
  testimonials,
  faqs: FAQS,
  carRental: fallbackCarRates,
  content: {},
}

import { Package } from '../models/Package.js'
import { Destination } from '../models/Destination.js'
import { Banner } from '../models/Banner.js'
import { Service } from '../models/Service.js'
import { Testimonial } from '../models/Testimonial.js'
import { Faq, FAQ_PAGES } from '../models/Faq.js'
import { SiteContent } from '../models/SiteContent.js'
import { Settings } from '../models/Settings.js'
import { VisaCountry } from '../models/VisaCountry.js'
import { CarRentalRate } from '../models/CarRentalRate.js'
import { defaultCarRates } from './carRentalDefaults.js'

// Public data only: published or active records, shaped like the website's
// original data files (a package's `id` is its slug, and so on), with no
// status flags, internal ids or timestamps.

const PUBLISHED = { status: 'published' }
const ORDER = { sortOrder: 1, createdAt: 1 }

export function toPublicPackage(doc) {
  if (!doc) return null
  return {
    id: doc.slug,
    title: doc.title,
    region: doc.region,
    category: doc.category,
    featured: Boolean(doc.featured),
    nights: doc.nights,
    days: doc.days,
    price: doc.price,
    currency: doc.currency,
    priceBasis: doc.priceBasis ?? '',
    badge: doc.badge ?? '',
    places: doc.places ?? [],
    description: doc.description,
    fullDescription: doc.fullDescription ?? '',
    highlights: doc.highlights ?? [],
    inclusions: doc.inclusions ?? [],
    exclusions: doc.exclusions ?? [],
    hotels: doc.hotels ?? [],
    itinerary: (doc.itinerary ?? []).map(({ day, title, description }) => ({ day, title, description })),
    departures: doc.departures ?? [],
    validUntil: doc.validUntil || undefined,
    image: doc.image,
    imageAlt: doc.imageAlt ?? '',
    gallery: (doc.gallery ?? []).map(({ src, alt }) => ({ src, alt })),
    flyer: doc.flyer ?? '',
    seoTitle: doc.seoTitle ?? '',
    seoDescription: doc.seoDescription ?? '',
  }
}

// A linked package is only shown while it is published itself.
const publishedPackage = (pkg) => (pkg && pkg.status === 'published' ? toPublicPackage(pkg) : null)

function toPublicDestination(doc) {
  return {
    id: doc.slug,
    name: doc.name,
    tagline: doc.tagline,
    description: doc.description ?? '',
    image: doc.image,
    imageAlt: doc.imageAlt ?? '',
    accent: doc.accent,
    featured: Boolean(doc.featured),
    package: publishedPackage(doc.package),
  }
}

function toPublicBanner(doc) {
  return {
    id: String(doc._id),
    name: doc.name,
    poster: [doc.titleLine1, doc.titleLine2 ?? ''],
    tagline: doc.subtitle,
    image: doc.image,
    imageAlt: doc.imageAlt ?? '',
    accent: doc.accent,
    ctaLabel: doc.ctaLabel ?? '',
    ctaLink: doc.ctaLink ?? '',
    package: publishedPackage(doc.package),
  }
}

const toPublicService = (doc) => ({
  id: doc.slug,
  title: doc.title,
  summary: doc.summary,
  features: doc.features ?? [],
  icon: doc.icon,
  image: doc.image ?? '',
  imageAlt: doc.imageAlt ?? '',
  inquiryLabel: doc.inquiryLabel || doc.title,
})

const toPublicTestimonial = (doc) => ({
  id: String(doc._id),
  name: doc.name,
  trip: doc.trip || null,
  quote: doc.quote,
  source: doc.source ?? '',
  image: doc.image ?? '',
  rating: doc.rating ?? null,
})

export function toPublicSettings(doc) {
  if (!doc) return null
  return {
    businessName: doc.businessName,
    legalName: doc.legalName ?? '',
    contactPerson: doc.contactPerson ?? '',
    city: doc.city ?? '',
    hours: doc.hours ?? '',
    whatsappNumber: doc.whatsappNumber,
    whatsappMessage: doc.whatsappMessage ?? '',
    phones: (doc.phones ?? []).map(({ label, number }) => ({ label, number })),
    email: doc.email ?? '',
    addressLines: doc.addressLines ?? [],
    socialLinks: (doc.socialLinks ?? []).map(({ label, url }) => ({ label, url })),
    logo: doc.logo ?? '',
    seoTitle: doc.seoTitle ?? '',
    seoDescription: doc.seoDescription ?? '',
  }
}

export async function listPublicPackages() {
  const docs = await Package.find(PUBLISHED).sort(ORDER).lean()
  return docs.map(toPublicPackage)
}

export async function getPublicPackage(slug) {
  return toPublicPackage(await Package.findOne({ ...PUBLISHED, slug }).lean())
}

export async function listPublicDestinations() {
  const docs = await Destination.find(PUBLISHED).sort(ORDER).populate('package').lean()
  return docs.map(toPublicDestination)
}

export async function listPublicBanners() {
  const docs = await Banner.find({ active: true }).sort(ORDER).populate('package').lean()
  return docs.map(toPublicBanner)
}

export async function listPublicServices() {
  return (await Service.find(PUBLISHED).sort(ORDER).lean()).map(toPublicService)
}

export async function listPublicTestimonials() {
  return (await Testimonial.find(PUBLISHED).sort(ORDER).lean()).map(toPublicTestimonial)
}

// { destinations: [{ question, answer }], services: [...], ... }
export async function listPublicFaqs() {
  const docs = await Faq.find(PUBLISHED).sort(ORDER).lean()
  const grouped = Object.fromEntries(FAQ_PAGES.map((page) => [page, []]))
  for (const doc of docs) grouped[doc.page].push({ question: doc.question, answer: doc.answer })
  return grouped
}

// { "home.about": { eyebrow, title, ... }, ... }
export async function listPublicContent() {
  const docs = await SiteContent.find(PUBLISHED).lean()
  return Object.fromEntries(
    docs.map((doc) => [
      doc.key,
      {
        eyebrow: doc.eyebrow,
        title: doc.title,
        accent: doc.accent,
        intro: doc.intro,
        body: doc.body,
        image: doc.image,
        imageAlt: doc.imageAlt,
      },
    ]),
  )
}

export async function getPublicSettings() {
  return toPublicSettings(await Settings.findOne({ key: 'business' }).lean())
}

export function toPublicVisaCountry(doc) {
  if (!doc) return null
  return {
    id: doc.slug,
    slug: doc.slug,
    name: doc.name,
    flag: doc.flag ?? '',
    image: doc.image ?? '',
    tagline: doc.tagline ?? '',
    processingTime: doc.processingTime ?? '',
    stayDuration: doc.stayDuration ?? '',
    validity: doc.validity ?? '',
    entryType: doc.entryType ?? '',
    documentGroups: (doc.documentGroups ?? []).map((group) => ({
      title: group.title ?? '',
      items: group.items ?? [],
    })),
    charges: (doc.charges ?? []).map((c) => ({
      visaType: c.visaType ?? '',
      currency: c.currency ?? 'INR',
      embassyFee: Number(c.embassyFee ?? 0),
      serviceFee: Number(c.serviceFee ?? 0),
      total: Number(c.embassyFee ?? 0) + Number(c.serviceFee ?? 0),
      processingTime: c.processingTime ?? '',
      note: c.note ?? '',
    })),
    chargesNote: doc.chargesNote ?? '',
    notes: doc.notes ?? '',
  }
}

export async function listPublicVisaCountries() {
  const docs = await VisaCountry.find(PUBLISHED).sort(ORDER).lean()
  return docs.map(toPublicVisaCountry)
}

export async function getPublicVisaCountry(slug) {
  return toPublicVisaCountry(await VisaCountry.findOne({ ...PUBLISHED, slug }).lean())
}

export async function getPublicCarRental() {
  const doc = await CarRentalRate.findOne({ key: 'rates' }).lean()
  if (!doc) return defaultCarRates
  return {
    note: doc.note || defaultCarRates.note,
    outstationFixedFares: doc.outstationFixedFares?.length ? doc.outstationFixedFares : defaultCarRates.outstationFixedFares,
    localDuty: doc.localDuty?.length ? doc.localDuty : defaultCarRates.localDuty,
    extraCharges: doc.extraCharges?.length ? doc.extraCharges : defaultCarRates.extraCharges,
    termsAndConditions: doc.termsAndConditions?.length ? doc.termsAndConditions : defaultCarRates.termsAndConditions,
    tempoBusVehicles: doc.tempoBusVehicles?.length ? doc.tempoBusVehicles : defaultCarRates.tempoBusVehicles,
    tempoBusFixedRoutes: doc.tempoBusFixedRoutes?.length ? doc.tempoBusFixedRoutes : defaultCarRates.tempoBusFixedRoutes,
  }
}

// Everything the website shows, in one request.
export async function getSiteBundle() {
  const [settings, packages, destinations, banners, services, testimonials, faqs, content, visaCountries, carRental] =
    await Promise.all([
      getPublicSettings(),
      listPublicPackages(),
      listPublicDestinations(),
      listPublicBanners(),
      listPublicServices(),
      listPublicTestimonials(),
      listPublicFaqs(),
      listPublicContent(),
      listPublicVisaCountries(),
      getPublicCarRental(),
    ])
  return { settings, packages, destinations, banners, services, testimonials, faqs, content, visaCountries, carRental }
}

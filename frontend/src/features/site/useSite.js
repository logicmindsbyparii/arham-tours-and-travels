import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createSelector } from '@reduxjs/toolkit'
import { resolveImage } from '../../data/imageAssets.js'
import { serviceIcon } from '../../data/icons.js'
import { buildInquiryServiceOptions } from '../../data/services.js'
import { FAQS } from '../../data/faqs.js'
import { fallbackSite } from './fallbackSite.js'


// Package from the API (or the built-in data) ready for the website's
// components: image references resolved to URLs, list fields always arrays.
export function normalizePackage(item) {
  if (!item) return null
  return {
    ...item,
    image: resolveImage(item.image),
    flyer: resolveImage(item.flyer),
    gallery: (item.gallery ?? []).map((photo) => ({ ...photo, src: resolveImage(photo.src) })).filter((photo) => photo.src),
    places: item.places ?? [],
    highlights: item.highlights ?? [],
    inclusions: item.inclusions ?? [],
    exclusions: item.exclusions ?? [],
    hotels: item.hotels ?? [],
    itinerary: item.itinerary ?? [],
    departures: item.departures ?? [],
    badge: item.badge ?? '',
    priceBasis: item.priceBasis ?? '',
    fullDescription: item.fullDescription ?? '',
    validUntil: item.validUntil || undefined,
  }
}

export function normalizeVisaCountry(item) {
  if (!item) return null
  return {
    ...item,
    image: resolveImage(item.image),
    flag: item.flag ?? '',
    tagline: item.tagline ?? '',
    visaTypes: item.visaTypes ?? [],
    processingTime: item.processingTime ?? '',
    stayDuration: item.stayDuration ?? '',
    validity: item.validity ?? '',
    entryType: item.entryType ?? '',
    documentGroups: (item.documentGroups ?? []).map((group) => ({
      title: group.title ?? '',
      items: group.items ?? [],
    })),
    charges: (item.charges ?? []).map((c) => ({
      visaType: c.visaType ?? '',
      currency: c.currency || 'INR',
      embassyFee: Number(c.embassyFee) || 0,
      serviceFee: Number(c.serviceFee) || 0,
      total: typeof c.total === 'number' ? c.total : (Number(c.embassyFee) || 0) + (Number(c.serviceFee) || 0),
      processingTime: c.processingTime ?? '',
      note: c.note ?? '',
    })),
    chargesNote: item.chargesNote ?? '',
    notes: item.notes ?? '',
  }
}

export function resolveFaqs(apiFaqs = {}) {
  return {
    destinations: apiFaqs?.destinations?.length ? apiFaqs.destinations : (FAQS.destinations ?? []),
    services: apiFaqs?.services?.length ? apiFaqs.services : (FAQS.services ?? []),
    carRental: apiFaqs?.carRental?.length ? apiFaqs.carRental : (FAQS.carRental ?? []),
    contact: apiFaqs?.contact?.length ? apiFaqs.contact : (FAQS.contact ?? []),
    visa: apiFaqs?.visa?.length ? apiFaqs.visa : (FAQS.visa ?? []),
  }
}

// Business details in the shape the components use.
export function normalizeBusiness(settings) {
  const address = (settings.addressLines ?? []).filter(Boolean)
  const mapQuery = encodeURIComponent([settings.legalName || settings.businessName, ...address].join(', '))
  return {
    name: settings.businessName,
    legalName: settings.legalName || settings.businessName,
    contactPerson: settings.contactPerson,
    city: settings.city,
    hours: settings.hours,
    whatsappNumber: settings.whatsappNumber,
    whatsappMessage: settings.whatsappMessage,
    phones: (settings.phones ?? []).map((phone) => ({ label: phone.label, href: `tel:+${phone.number}` })),
    emails: settings.email ? [settings.email] : [],
    addressLines: address,
    mapUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
    mapEmbedUrl: `https://maps.google.com/maps?q=${mapQuery}&output=embed`,
    socialLinks: (settings.socialLinks ?? []).map((link) => ({ label: link.label, href: link.url })),
    logo: resolveImage(settings.logo),
    seoTitle: settings.seoTitle,
    seoDescription: settings.seoDescription,
  }
}

const withImage = (item) => ({ ...item, image: resolveImage(item.image) })

// Only the content and its source matter here: the loading status changes on
// every refresh and must not rebuild (and re-render) the whole site.
const selectSite = createSelector(
  [(state) => state.site.data, (state) => state.site.source],
  (data, source) => {
    const packages = data.packages.map(normalizePackage)
    const destinations = data.destinations.map((place) => ({ ...withImage(place), package: normalizePackage(place.package) }))
    const toSlide = (slide) => ({ ...withImage(slide), package: normalizePackage(slide.package) })

    // Hero slides: exactly the active banners from the admin panel. With none
    // active, the hero is hidden (see HeroSection).
    const banners = data.banners.map(toSlide)

    const services = data.services.map((service) => ({ ...withImage(service), icon: serviceIcon(service.icon) }))
    const visaCountries = (data.visaCountries ?? []).map(normalizeVisaCountry)

    return {
      source,
      business: normalizeBusiness(data.settings),
      packages,
      destinations,
      banners,
      services,
      serviceOptions: buildInquiryServiceOptions(services),
      visaCountries,
      carRental: data.carRental ?? fallbackSite.carRental,
      testimonials: data.testimonials.map(withImage),
      faqs: resolveFaqs(data.faqs),
      content: data.content ?? {},
    }
  },
)

export function useSite() {
  return useSelector(selectSite)
}

export function useBusiness() {
  return useSite().business
}

// Text for one website section, from Website content in the admin panel.
// Returns null when the section is unpublished or deleted there: the
// component then hides it. Empty fields of a published section keep the
// section's built-in text. The built-in text is used on its own only for the
// built-in copy of the site (before the API has ever answered).
export function useSectionContent(key, defaults) {
  const { content: all } = useSite()
  const content = all[key]
  return useMemo(() => {
    if (!content) return defaults || null
    const merged = { ...defaults }
    for (const [field, value] of Object.entries(content)) {
      if (value) merged[field] = field === 'image' ? resolveImage(value) : value
    }
    return merged
  }, [content, defaults])
}

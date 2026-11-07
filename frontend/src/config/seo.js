// Search-engine details for every page: the <title>, meta description and the
// name used in breadcrumbs. The app sets them while browsing (components/seo/Seo.jsx)
// and scripts/prerender.js writes them into each page's HTML file at build
// time, so search engines and link previews see them without running JavaScript.
//
// Plain JavaScript with no asset imports, so Node can import it at build time.
import { ADDRESS, BUSINESS, EMAILS, PHONE_NUMBERS, SITE_URL, SOCIAL_LINKS } from './business.js'

export const PAGES = {
  '/': {
    label: 'Home',
    title: `Tours and Travels in Surat | ${BUSINESS.name}`,
    description: `${BUSINESS.name}, Surat: Vietnam group tours, Goa holiday packages, flight tickets, visa assistance, hotel and cruise booking, and car rental. Call ${PHONE_NUMBERS[0].label}.`,
  },
  '/packages': {
    label: 'Tour packages',
    title: `Tour Packages from Surat | ${BUSINESS.name}`,
    description: `All-inclusive tour packages from ${BUSINESS.name}, Surat: Vietnam group departures with a Gujarati tour manager, and Goa holidays. Compare prices and enquire.`,
  },
  '/destinations': {
    label: 'Destinations',
    title: `Vietnam & Goa Tour Destinations | ${BUSINESS.name}`,
    description: `Ha Long Bay, Ba Na Hills, Hanoi, Ninh Binh and Goa: the destinations on our tour packages from Surat, with durations, prices and what you will see.`,
  },
  '/services': {
    label: 'Services',
    title: `Flight, Visa, Hotel & Cruise Booking in Surat | ${BUSINESS.name}`,
    description: `Flight ticket booking, visa assistance, hotel booking and cruise holidays from ${BUSINESS.name}, Surat. Booked with your tour package or on their own.`,
  },
  '/visa': {
    label: 'Visa assistance',
    title: `Visa Assistance & Document Requirements | ${BUSINESS.name}`,
    description: `Destination-wise visa document checklists, tourist visa assistance, and filing support for Indian travelers from ${BUSINESS.name}, Surat.`,
  },
  '/car-rental': {
    label: 'Car rental',
    title: `Car Rental with Driver in Surat | ${BUSINESS.name}`,
    description: `Car rental with driver in Surat for airport transfers, local sightseeing, outstation trips and group travel. Share your route and dates for a quote from ${BUSINESS.name}.`,
  },
  '/about': {
    label: 'About us',
    title: `About Us: Travel Agency in Surat | ${BUSINESS.name}`,
    description: `${BUSINESS.name} is the travel brand of ${BUSINESS.legalName}, a travel agency in Surat planning group tours, holidays, flights, visas and hotels as one plan.`,
  },
  '/contact': {
    label: 'Contact',
    title: `Contact Us, Surat Office | ${BUSINESS.name}`,
    description: `Call ${PHONE_NUMBERS[0].label}, email ${EMAILS[0]} or visit ${BUSINESS.name} at ${ADDRESS.lines.join(', ')}. Send an enquiry for a tour package or travel booking.`,
  },
}

export const pageUrl = (path) => `${SITE_URL}${path === '/' ? '/' : path}`

// The business itself, as schema.org TravelAgency structured data. Shown on every page.
export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'TravelAgency',
    '@id': `${SITE_URL}/#agency`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/apple-touch-icon.png`,
    image: `${SITE_URL}/apple-touch-icon.png`,
    description: PAGES['/'].description,
    telephone: PHONE_NUMBERS.map((phone) => phone.href.replace('tel:', '')),
    email: EMAILS[0],
    address: {
      '@type': 'PostalAddress',
      streetAddress: ADDRESS.lines.join(', '),
      addressLocality: BUSINESS.city,
      addressRegion: 'Gujarat',
      addressCountry: 'IN',
    },
    areaServed: ['Surat', 'Gujarat', 'India'],
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
      opens: '10:00',
      closes: '19:00',
    },
    ...(SOCIAL_LINKS.length > 0 && { sameAs: SOCIAL_LINKS.map((link) => link.href) }),
  }
}

// Home > page, as schema.org BreadcrumbList structured data.
export function breadcrumbJsonLd(path) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: PAGES['/'].label, item: pageUrl('/') },
      { '@type': 'ListItem', position: 2, name: PAGES[path].label, item: pageUrl(path) },
    ],
  }
}

export function faqJsonLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  }
}

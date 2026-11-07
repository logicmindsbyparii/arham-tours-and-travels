// Tour packages from the official flyers on https://arhamtours.in/tour-package/
// (checked October 2026). Packages are now managed in the admin panel; this
// list is the built-in copy shown when the API cannot be reached, and the
// helpers below format packages from either source. Every price, duration, hotel and inclusion below is
// copied from those flyers. The flyers themselves are in src/assets/flyers and
// are linked from each package card.
//
// Departure dates are stored as ISO dates. The site only shows dates that are
// still in the future; once they pass, cards invite visitors to ask for new dates.

import haLongBayHero from '../assets/images/ha-long-bay-hero.webp'
import goldenBridge from '../assets/images/golden-bridge.webp'
import goaBeach from '../assets/images/goa-beach.webp'
import dubaiHero from '../assets/images/dubai-hero.webp'
import thailandHero from '../assets/images/thailand-hero.webp'
import singaporeHero from '../assets/images/singapore-hero.webp'
import baliHero from '../assets/images/bali-hero.webp'
import switzerlandHero from '../assets/images/switzerland-hero.webp'
import vietnam7Flyer from '../assets/flyers/vietnam-7n8d.webp'
import vietnam9Flyer from '../assets/flyers/vietnam-9n10d.webp'
import goaFlyer from '../assets/flyers/goa-4n5d.webp'

export const PACKAGE_CATEGORIES = [
  { id: 'featured', label: 'Featured' },
  { id: 'domestic', label: 'Domestic' },
  { id: 'international', label: 'International' },
]

export const packages = [
  {
    id: 'vietnam-phu-quoc-7n',
    title: 'Vietnam Group Departure with Phu Quoc',
    region: 'Vietnam',
    category: 'international',
    featured: true,
    nights: 7,
    days: 8,
    price: 135999,
    currency: 'INR',
    priceBasis: 'per person',
    badge: '4-star package · All inclusive',
    places: ['Da Nang', 'Hoi An', 'Ba Na Hills', 'Phu Quoc', 'Hanoi', 'Ha Long Bay'],
    description:
      'All inclusive holiday with everything arranged and a Gujarati tour manager: return flights, internal flights, Vietnam tourist visa and a night on a Ha Long Bay cruise.',
    inclusions: [
      'Return economy airfare',
      'All internal Vietnam flights',
      '7 nights in listed hotels or similar',
      '7 continental breakfasts and 6 dinners at an Indian restaurant',
      'Ba Na Hills & Golden Bridge with two-way cable car',
      'Grand World, VinWonders and Vinsafari tickets',
      '4 island trip and cable car with tickets',
      'Hanoi city tour and Train Street',
      '1 night on a 4-star Ha Long Bay cruise',
      'Vietnam tourist visa, guide and driver tips',
    ],
    hotels: [
      'Da Nang (2N): Eden Ocean Hotel',
      'Phu Quoc (3N): Wyndham Garden',
      'Hanoi (1N): A25 Luxury',
      'Ha Long Bay (1N): 4-star cruise',
    ],
    departures: ['2026-08-15', '2026-09-26'],
    image: haLongBayHero,
    imageAlt: 'Limestone islands rising from the calm water of Ha Long Bay',
    flyer: vietnam7Flyer,
  },
  {
    id: 'vietnam-series-9n',
    title: 'Vietnam Group Departure Series',
    region: 'Vietnam',
    category: 'international',
    featured: true,
    nights: 9,
    days: 10,
    price: 135999,
    currency: 'INR',
    priceBasis: 'per person, all inclusive with GST',
    badge: 'Fixed group departure · All inclusive',
    places: ['Phu Quoc (4N)', 'Da Nang (3N)', 'Hanoi (2N)', 'Ninh Binh'],
    description:
      'An extended Phu Quoc stay with island experiences, then Da Nang, Hoi An and Hanoi. All meals and 4-star stays included; minimum group of 20.',
    inclusions: [
      'All meals (breakfast, lunch and dinner)',
      '4-star accommodation',
      'VinWonders theme park, Vin Safari and Grand World',
      '4 island speed-boat tour, snorkelling and cable car',
      'Kiss of the Sea show and Sunset Town',
      'Da Nang city tour and Dragon Bridge',
      'Ba Na Hills, Golden Bridge and Fantasy Park',
      'Hoi An Ancient Town and lantern boat ride',
      'Hanoi city tour, Old Quarter and Ninh Binh (Tam Coc)',
    ],
    hotels: [],
    departures: ['2026-06-20', '2026-06-25', '2026-07-20', '2026-07-25', '2026-08-08'],
    image: goldenBridge,
    imageAlt: 'The Golden Bridge held up by giant stone hands in the Ba Na Hills',
    flyer: vietnam9Flyer,
  },
  {
    id: 'goa-4n',
    title: 'Exclusive Goa',
    region: 'Goa',
    category: 'domestic',
    featured: true,
    nights: 4,
    days: 5,
    price: 21500,
    currency: 'INR',
    priceBasis: 'per couple',
    badge: 'Extra discount on 2–3 rooms',
    places: ['Goa sightseeing', 'Dinner cruise', 'Choice of 4 hotels'],
    description:
      'Choose from four hotels, with breakfast and dinner, pick-up and drop, two days of sightseeing and an evening dinner cruise.',
    inclusions: [
      'Breakfast and dinner',
      'Pick-up and drop',
      '2 days of sightseeing (shared, SIC)',
      'Dinner cruise with pick-up and drop (SIC)',
      'All transfers on a shared (SIC) basis',
    ],
    hotels: [
      'Divan Clarks Inn, Executive Deluxe: ₹21,500 per couple',
      'Antara Resort, Club Cottage: ₹22,000 per couple',
      'Silver Sand Serenity, Superior: ₹25,000 per couple',
      'Kyriad Calangute, Superior: ₹27,000 per couple',
    ],
    // The flyer gives "valid till 10 August" rather than departure dates.
    departures: [],
    validUntil: '2026-08-10',
    image: goaBeach,
    imageAlt: 'Palm trees and colourful beach huts on a sandy Goan beach',
    flyer: goaFlyer,
  },
  {
    id: 'dubai-uae-5n',
    title: 'Dubai & Abu Dhabi Highlights',
    region: 'United Arab Emirates',
    category: 'international',
    featured: true,
    nights: 5,
    days: 6,
    price: 68500,
    currency: 'INR',
    priceBasis: 'per person',
    badge: 'Luxury experience · Group departure',
    places: ['Dubai (3N)', 'Abu Dhabi (2N)', 'Desert Safari', 'Burj Khalifa'],
    description:
      'Experience the glitz and glamour of Dubai and the cultural heritage of Abu Dhabi. Includes Burj Khalifa 124th floor, Desert Safari with BBQ dinner, Marina Dhow Cruise, and Sheikh Zayed Grand Mosque tour.',
    inclusions: [
      '5 nights luxury 4-star accommodation',
      'Daily international buffet breakfast',
      'Burj Khalifa 124th floor observation deck ticket',
      'Desert Safari with dune bashing, BBQ dinner and belly dance show',
      'Dubai Marina luxury Dhow dinner cruise',
      'Abu Dhabi city tour with Sheikh Zayed Grand Mosque visit',
      'Dubai city tour covering Gold Souk, Spice Souk and Dubai Frame',
      'All airport and sightseeing transfers on private/SIC basis',
      'UAE tourist visa assistance',
    ],
    hotels: [
      'Dubai (3N): Grand Excelsior Hotel / Hyatt Place',
      'Abu Dhabi (2N): Radisson Blu / Le Meridien',
    ],
    departures: ['2026-11-15', '2026-12-10', '2026-12-24', '2027-01-15'],
    image: dubaiHero,
    imageAlt: 'Dubai futuristic skyline and Burj Khalifa towering above clouds',
  },
  {
    id: 'thailand-bangkok-phuket-6n',
    title: 'Thailand Island & City Discovery',
    region: 'Thailand',
    category: 'international',
    featured: true,
    nights: 6,
    days: 7,
    price: 49500,
    currency: 'INR',
    priceBasis: 'per person',
    badge: 'Best seller · Group departure',
    places: ['Phuket (3N)', 'Bangkok (3N)', 'Phi Phi Island', 'Wat Arun'],
    description:
      'Soak up the sun on tropical Phi Phi Island beaches and explore the gilded temples and vibrant street markets of Bangkok with Indian dining options.',
    inclusions: [
      '3 nights stay in Phuket + 3 nights stay in Bangkok',
      'Daily breakfast at hotels and Indian lunches/dinners as per plan',
      'Full-day Phi Phi Island tour by big boat/speed boat with local lunch',
      'Phuket half-day city tour with Big Buddha & Promthep Cape',
      'Bangkok city and temple tour: Golden Buddha & Marble Temple',
      'Chao Phraya River evening dinner cruise in Bangkok',
      'Internal flight Phuket to Bangkok',
      'All airport and tour transfers',
      'Thailand visa assistance',
    ],
    hotels: [
      'Phuket (3N): Ashlee Plaza Patong / Best Western Phuket',
      'Bangkok (3N): Berkeley Hotel Pratunam / Holiday Inn Express',
    ],
    departures: ['2026-11-20', '2026-12-05', '2026-12-22', '2027-01-10'],
    image: thailandHero,
    imageAlt: 'Traditional long-tail boat on crystal turquoise waters in Thailand',
  },
  {
    id: 'singapore-sentosa-5n',
    title: 'Singapore Highlights with Sentosa',
    region: 'Singapore',
    category: 'international',
    featured: true,
    nights: 5,
    days: 6,
    price: 78500,
    currency: 'INR',
    priceBasis: 'per person',
    badge: 'Family favourite · All transfers included',
    places: ['Marina Bay (2N)', 'Sentosa Island (2N)', 'Gardens by the Bay', 'Universal Studios'],
    description:
      'Discover futuristic Singapore: Marina Bay Sands SkyPark, Gardens by the Bay Flower Dome & Cloud Forest, full-day Universal Studios Singapore pass, and Sentosa cable car ride.',
    inclusions: [
      '5 nights accommodation in central Singapore',
      'Daily buffet breakfast',
      'Half-day Singapore panoramic city tour with Merlion Park',
      'Gardens by the Bay (Flower Dome & Cloud Forest) entry',
      'Marina Bay Sands SkyPark Observation Deck ticket',
      'Full-day Sentosa Island tour with cable car ride & Wings of Time show',
      'Universal Studios Singapore full-day unlimited rides pass',
      'Night Safari tour with tram ride',
      'All airport, attraction and hotel transfers',
      'Singapore tourist visa assistance',
    ],
    hotels: [
      'Singapore (5N): Furama City Centre / York Hotel Orchard',
    ],
    departures: ['2026-11-10', '2026-12-12', '2026-12-25', '2027-01-18'],
    image: singaporeHero,
    imageAlt: 'Marina Bay Sands and Gardens by the Bay in Singapore',
  },
  {
    id: 'bali-indonesia-6n',
    title: 'Bali Tropical Paradise & Temples',
    region: 'Indonesia',
    category: 'international',
    featured: true,
    nights: 6,
    days: 7,
    price: 58500,
    currency: 'INR',
    priceBasis: 'per person',
    badge: 'Romantic getaway · Private pool villa available',
    places: ['Kuta (3N)', 'Ubud (3N)', 'Kintamani Volcano', 'Tanah Lot', 'Nusa Penida'],
    description:
      'Immerse yourself in Bali’s enchanting beauty: sacred sea temples at Tanah Lot & Uluwatu, lush Tegalalang rice terraces, thrilling Nusa Penida island speedboat tour, and authentic Balinese hospitality.',
    inclusions: [
      '3 nights stay in Kuta beach resort + 3 nights in Ubud nature resort',
      'Daily breakfast at resort',
      'Full-day Kintamani volcano tour with Tegalalang rice terrace & coffee plantation',
      'Full-day Nusa Penida West island tour by speedboat with lunch (Kelingking Beach & Broken Beach)',
      'Tanah Lot sea temple sunset tour',
      'Uluwatu sunset temple tour with Kecak fire dance performance',
      'Authentic 60-minute Balinese spa massage session',
      'All airport and private tour transfers with English-speaking guide',
      'Indonesia tourist visa / VoA guidance',
    ],
    hotels: [
      'Kuta (3N): Sol by Melia Kuta Bali',
      'Ubud (3N): Element by Westin Ubud / The Payogan Villa',
    ],
    departures: ['2026-11-18', '2026-12-15', '2026-12-28', '2027-01-20'],
    image: baliHero,
    imageAlt: 'Lush tropical sea cliff and emerald waters in Bali Indonesia',
  },
  {
    id: 'switzerland-alps-6n',
    title: 'Switzerland Alpine Wonderland',
    region: 'Switzerland',
    category: 'international',
    featured: true,
    nights: 6,
    days: 7,
    price: 165000,
    currency: 'INR',
    priceBasis: 'per person',
    badge: 'Swiss Travel Pass included · Premium tour',
    places: ['Zurich (2N)', 'Interlaken (2N)', 'Lucerne (2N)', 'Jungfraujoch', 'Mt. Titlis'],
    description:
      'Journey through postcard Switzerland: Jungfraujoch – Top of Europe, Mount Titlis rotating cable car with glacier cave, Lake Lucerne cruise, and scenic Swiss rail journeys.',
    inclusions: [
      '6 nights accommodation in standard 4-star Swiss hotels with daily breakfast',
      '8-day Consecutive Swiss Travel Pass (2nd class) for unlimited trains, buses and boats',
      'Excursion to Jungfraujoch – Top of Europe with Eiger Express cable car',
      'Excursion to Mount Titlis with Rotair revolving cable car and Cliff Walk',
      'Scenic cruise on Lake Lucerne',
      'Orientation walking tours of Zurich, Interlaken and Lucerne',
      'Schengen visa document checklist and filing support',
    ],
    hotels: [
      'Zurich (2N): Swissotel / Dorint Airport Zurich',
      'Interlaken (2N): Hotel Metropole / Krebs Interlaken',
      'Lucerne (2N): Hotel Astoria / Radisson Blu Lucerne',
    ],
    departures: ['2026-12-01', '2026-12-20', '2027-04-15', '2027-05-10'],
    image: switzerlandHero,
    imageAlt: 'Majestic snow-capped Swiss Alps and alpine lake',
  },
]

export function filterByCategory(list, categoryId) {
  if (categoryId === 'featured') return list.filter((item) => item.featured)
  return list.filter((item) => item.category === categoryId)
}

export function getPackageById(id) {
  return packages.find((item) => item.id === id)
}

export function formatPrice(price, currency) {
  return new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(price)
}

const todayIso = () => new Date().toLocaleDateString('en-CA')

// Departure dates that have not passed yet, formatted for display.
export function getUpcomingDepartures(item) {
  return item.departures
    .filter((date) => date >= todayIso())
    .map((date) =>
      new Date(`${date}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    )
}

// True when the published offer or every published departure is in the past.
export function isOfferExpired(item) {
  if (item.validUntil) return item.validUntil < todayIso()
  return item.departures.length > 0 && getUpcomingDepartures(item).length === 0
}

// Price per traveller, for sorting packages priced on different bases
// (Goa is priced per couple, the Vietnam trips per person).
export function getPricePerPerson(item) {
  return item.priceBasis?.includes('couple') ? item.price / 2 : item.price
}

// Formats an ISO date like "10 Aug 2026".
export function formatDate(isoDate) {
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

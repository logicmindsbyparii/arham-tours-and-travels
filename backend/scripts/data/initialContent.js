// The website's content as it was before the admin panel existed, copied from
// frontend/src/data/*.js and frontend/src/config/business.js. Images use
// "asset:<name>" references to the photos bundled with the website
// (frontend/src/data/imageAssets.js). `npm run seed:content` imports it once.
//
// Testimonials are intentionally empty: the website never had real reviews,
// and none are invented here.

const phones = '+91 98241 00369'

export const settings = {
  businessName: 'Arham Tours & Travels',
  legalName: 'Arham Holiday Designer LLP',
  contactPerson: 'Ashish Shah',
  city: 'Surat',
  hours: '10:00 AM – 7:00 PM, Monday to Saturday (closed Sunday)',
  whatsappNumber: '919824100369',
  whatsappMessage: 'Hi, I would like to enquire about a holiday or travel booking.',
  phones: [{ label: '+91 98241 00369', number: '919824100369' }],
  email: 'info@arhamtours.in',
  addressLines: ['Aagam Emporio 9, 2nd floor', 'U M Road, Surat'],
  socialLinks: [],
  logo: '',
  seoTitle: '',
  seoDescription: '',
}

export const packages = [
  {
    slug: 'vietnam-phu-quoc-7n',
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
    image: 'asset:ha-long-bay-hero',
    imageAlt: 'Limestone islands rising from the calm water of Ha Long Bay',
    flyer: 'asset:flyer-vietnam-7n8d',
    status: 'published',
    sortOrder: 1,
  },
  {
    slug: 'vietnam-series-9n',
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
    image: 'asset:golden-bridge',
    imageAlt: 'The Golden Bridge held up by giant stone hands in the Ba Na Hills',
    flyer: 'asset:flyer-vietnam-9n10d',
    status: 'published',
    sortOrder: 2,
  },
  {
    slug: 'goa-4n',
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
    departures: [],
    validUntil: '2026-08-10',
    image: 'asset:goa-beach',
    imageAlt: 'Palm trees and colourful beach huts on a sandy Goan beach',
    flyer: 'asset:flyer-goa-4n5d',
    status: 'published',
    sortOrder: 3,
  },
]

// packageSlug is resolved to the package's id when seeding.
export const destinations = [
  {
    slug: 'ha-long-bay',
    name: 'Ha Long Bay',
    image: 'asset:ha-long-bay',
    imageAlt: 'Boats among the limestone islands of Ha Long Bay',
    packageSlug: 'vietnam-phu-quoc-7n',
    accent: 'azure',
    poster: ['Ha Long', 'Bay'],
    tagline: 'Limestone islands rising out of green water, seen from the deck of a cruise.',
  },
  {
    slug: 'golden-bridge',
    name: 'Ba Na Hills',
    image: 'asset:golden-bridge-walkway',
    imageAlt: 'The curving Golden Bridge supported by two giant stone hands',
    packageSlug: 'vietnam-series-9n',
    accent: 'jade',
    poster: ['Ba Na', 'Hills'],
    tagline: 'The Golden Bridge, held up by two giant stone hands above the forest.',
  },
  {
    slug: 'hanoi-train-street',
    name: 'Hanoi',
    image: 'asset:hanoi-train-street',
    imageAlt: 'Railway tracks running between houses and cafés on Hanoi Train Street',
    packageSlug: 'vietnam-phu-quoc-7n',
    accent: 'ember',
    poster: ['Hanoi', 'Streets'],
    tagline: 'Cafés pressed right up against the railway on Hanoi’s Train Street.',
  },
  {
    slug: 'ninh-binh',
    name: 'Ninh Binh',
    image: 'asset:ninh-binh-pagoda',
    imageAlt: 'A small pagoda on a lake between steep limestone cliffs',
    packageSlug: 'vietnam-series-9n',
    accent: 'jade',
    poster: ['Ninh', 'Binh'],
    tagline: 'Pagodas and quiet water between steep limestone cliffs.',
  },
  {
    slug: 'hanoi-pagoda',
    name: 'Tran Quoc Pagoda',
    image: 'asset:hanoi-tran-quoc-pagoda',
    imageAlt: 'The red tiered tower of Tran Quoc Pagoda among palm trees',
    packageSlug: 'vietnam-series-9n',
    accent: 'ember',
    poster: ['Tran Quoc', 'Pagoda'],
    tagline: 'The oldest pagoda in Hanoi, on a small island in West Lake.',
  },
  {
    slug: 'goa',
    name: 'Goa',
    image: 'asset:goa-beach',
    imageAlt: 'Palm-lined beaches, beach shacks and long sunsets over the Arabian Sea',
    packageSlug: 'goa-4n',
    accent: 'azure',
    poster: ['Goa', 'Beaches'],
    tagline: 'Palm-lined beaches, beach shacks and long sunsets over the Arabian Sea.',
  },
]

export const services = [
  {
    slug: 'flights',
    title: 'Flight Ticket Booking',
    inquiryLabel: 'Flight tickets',
    icon: 'Plane',
    summary:
      'Air tickets for your holiday or a stand-alone trip. Our Vietnam group departures already include return airfare.',
    features: ['Domestic flights', 'International flights', 'Group bookings'],
    image: 'asset:flight-wing',
    imageAlt: 'An aircraft wing above the clouds at sunrise',
  },
  {
    slug: 'visa',
    title: 'Visa Assistance',
    inquiryLabel: 'Visa assistance',
    icon: 'Stamp',
    summary:
      'Guidance on the documents your destination needs and help with the application. The Vietnam tourist visa is included in our group package.',
    features: ['Document checklist', 'Application support', 'Tourist visas'],
    image: 'asset:flight-takeoff',
    imageAlt: 'A passenger jet climbing into a pastel sky',
  },
  {
    slug: 'hotels',
    title: 'Hotel Booking',
    inquiryLabel: 'Hotel booking',
    icon: 'Hotel',
    summary:
      'Stays chosen to suit your budget, from the hotels on our packages to stand-alone bookings for your own itinerary.',
    features: ['Package hotels', 'Stand-alone stays', 'Rooms for families and groups'],
    image: 'asset:hotel-pool',
    imageAlt: 'A resort pool and sun loungers beside a timber lodge',
  },
  {
    slug: 'cruise',
    title: 'Cruise Experiences',
    inquiryLabel: 'Cruise booking',
    icon: 'Ship',
    summary:
      'From an overnight Ha Long Bay cruise to a dinner cruise in Goa, cruises can be part of your package or booked on their own.',
    features: ['Overnight cruises', 'Dinner cruises', 'Cruise holidays on request'],
    image: 'asset:cruise-ship',
    imageAlt: 'A large cruise ship docked beside a white-sand beach',
  },
]

export const faqs = {
  destinations: [
    {
      question: 'Which destinations do your tour packages cover?',
      answer:
        'Our current packages cover Vietnam (Da Nang, Hoi An, Ba Na Hills, Phu Quoc, Hanoi, Ninh Binh and Ha Long Bay) and Goa. We also plan trips to other destinations on request.',
    },
    {
      question: 'What is included in the Vietnam group departure?',
      answer:
        'Our Vietnam group departures include return international flights, internal flights, 4-star stays, meals, the Vietnam tourist visa and an experienced Gujarati tour manager throughout the trip.',
    },
    {
      question: 'Is a Ha Long Bay cruise included?',
      answer: 'Yes, on the 7 night Vietnam Group Departure with Phu Quoc, which includes a night on a 4-star Ha Long Bay cruise.',
    },
    {
      question: 'Can you plan a trip to a place that is not listed?',
      answer: `Yes. Share your destination, dates and budget through the enquiry form, on WhatsApp or by calling ${phones}, and we will send you options and a quote.`,
    },
  ],
  services: [
    {
      question: 'Can I book flights, hotels or a visa without a tour package?',
      answer:
        'Yes. Flight tickets, visa assistance, hotel booking and cruises can be part of your package or booked on their own.',
    },
    {
      question: 'Do you help with visa applications?',
      answer:
        'Yes. We guide you on the documents your destination needs and help with the application. The Vietnam tourist visa is already included in our 7 night Vietnam with Phu Quoc package.',
    },
    {
      question: 'Do you book group flight tickets?',
      answer: 'Yes. We book domestic and international flights, including group bookings.',
    },
    {
      question: 'How do I get a quote?',
      answer: `Send an enquiry from this page, message us on WhatsApp or call ${phones}. We come back with options and a quote.`,
    },
  ],
  carRental: [
    {
      question: 'Do you offer car rental with a driver in Surat?',
      answer:
        'Yes. Arham Tours & Travels arranges a car and driver for airport transfers, local sightseeing, outstation trips and group travel.',
    },
    {
      question: 'How much does car rental cost?',
      answer:
        'The price depends on the vehicle, the route and the number of days. Tell us your trip type, route and dates and we will suggest a suitable vehicle and send a quote.',
    },
    {
      question: 'Can you arrange an early-morning airport drop?',
      answer: 'Yes. Airport transfers are one of the trip types we arrange. Share your flight time and pickup point when you enquire.',
    },
  ],
  contact: [
    {
      question: 'Where is your office?',
      answer: 'Our office is at Aagam Emporio 9, 2nd floor, U M Road, Surat (Arham Holiday Designer LLP).',
    },
    {
      question: 'What are your office hours?',
      answer: 'We are open 10:00 AM – 7:00 PM, Monday to Saturday (closed Sunday).',
    },
    {
      question: 'How can I contact you?',
      answer: `Call Ashish Shah on ${phones}, email info@arhamtours.in, send a WhatsApp message or use the enquiry form on this page.`,
    },
  ],
  visa: [
    {
      question: 'Can you guarantee that my visa will be approved?',
      answer:
        'No. Visa approval is at the sole discretion of the respective embassy or consulate. Our role is to ensure your application form is accurate, your documentation is complete according to official rules, and your submission is processed smoothly.',
    },
    {
      question: 'What is the difference between embassy fee and service fee?',
      answer:
        'The embassy fee is the mandatory government fee charged by the consulate or visa processing centre. Our service fee covers document verification, form filling, appointment booking, and submission assistance.',
    },
    {
      question: 'How long before my travel date should I apply for a visa?',
      answer:
        'We recommend applying at least 3 to 4 weeks before your intended departure date, or earlier for destinations with longer consular processing times or high seasonal demand.',
    },
    {
      question: 'Can I send documents online, or do I need to visit your office?',
      answer:
        'You can share scanned copies or clear photos of your documents via WhatsApp or email for an initial pre-check. If physical passport submission or biometrics is required, our Surat team will guide you on the next steps.',
    },
    {
      question: 'What happens if my visa application is delayed by the embassy?',
      answer:
        'Processing times provided are estimates based on standard consulate timelines. Embassies may take additional time for verification during peak seasons. We track your application and keep you updated throughout.',
    },
    {
      question: 'Are visa fees refundable if my plans change or if the visa is refused?',
      answer:
        'Consulate and embassy fees are non-refundable once an application is submitted to the embassy. Our service fee is charged for the work performed in reviewing, compiling, and filing the application.',
    },
  ],
}

// Section text exactly as the website shows it today.
export const siteContent = [
  {
    key: 'home.about',
    eyebrow: 'About us',
    title: 'Your journey,',
    accent: 'planned from start to finish.',
    body:
      'Arham Tours & Travels is the travel brand of Arham Holiday Designer LLP, based in Surat. We put together holidays where the flights, hotels, sightseeing and paperwork are arranged as one plan.\n\nOur group departures feature all-inclusive travel with a Gujarati tour manager travelling with the group. For trips closer to home, our Goa holidays let you choose the hotel that suits your budget.',
  },
  {
    key: 'home.packages',
    eyebrow: 'Tour packages',
    title: 'Journeys ready to',
    accent: 'book.',
    intro:
      'Group departures and holidays closer to home, with flights, stays and sightseeing arranged together. Prices are confirmed when you enquire.',
  },
  {
    key: 'home.destinations',
    eyebrow: 'Destinations',
    title: 'Places worth the',
    accent: 'long way round.',
    intro: 'Postcards from the places on our current itineraries. Hover or tap one to turn it over for the trip it belongs to.',
  },
  {
    key: 'home.services',
    eyebrow: 'Travel services',
    title: 'Everything around the trip,',
    accent: 'handled.',
    intro: 'The pieces that make a trip work, booked with your package or on their own: tickets, visas, stays and cruises.',
  },
  {
    key: 'home.contact',
    eyebrow: 'Plan your trip',
    title: 'Where would you',
    accent: 'like to go?',
    intro: 'Send an enquiry, call or visit our Surat office. We will come back with options, dates and a quote.',
  },
  {
    key: 'packages.banner',
    title: 'Tour packages from Surat,',
    accent: 'ready to book.',
    intro:
      'Group departures and holidays closer to home, with flights, stays and sightseeing arranged together. Prices are confirmed when you enquire.',
    image: 'asset:ha-long-bay-hero',
  },
  {
    key: 'destinations.banner',
    title: 'Vietnam and Goa,',
    accent: 'seen up close.',
    intro:
      'Limestone bays, mountain bridges, old quarters and palm-lined beaches: the places our tour packages from Surat take you.',
    image: 'asset:golden-bridge-walkway',
  },
  {
    key: 'services.banner',
    title: 'Flights, visas, hotels',
    accent: 'and cruises, handled.',
    intro: 'Everything around the trip, booked with your tour package or on its own by our travel team in Surat.',
    image: 'asset:flight-wing',
  },
  {
    key: 'about.banner',
    title: 'A travel agency in Surat,',
    accent: 'planning every detail.',
    intro:
      'Arham Tours & Travels is the travel brand of Arham Holiday Designer LLP. We plan group tours, holidays, flights, visas and hotels as one plan, from our office on U M Road.',
    image: 'asset:mountain-valley',
  },
  {
    key: 'home.visa',
    eyebrow: 'Visa assistance',
    title: 'Visa document checklists',
    accent: 'for Indian travelers.',
    intro: 'Clear document requirements, fast verification and step-by-step guidance for popular international destinations.',
  },
  {
    key: 'visa.banner',
    title: 'Visa assistance & document requirements,',
    accent: 'simplified.',
    intro: 'Find the exact checklist for your destination, prepare your paperwork, and get expert assistance from our team in Surat.',
    image: 'asset:flight-takeoff',
  },
]

export const visaCountries = []

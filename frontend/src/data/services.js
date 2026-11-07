// Travel services offered alongside packages.
//
// NOTE FOR THE OWNER: arhamtours.in does not have separate pages for these
// services. They are included because the published packages bundle them
// (airfare, visas, hotels, a Ha Long Bay cruise and a Goa dinner cruise,
// transfers). The descriptions are deliberately general; confirm them and add
// specifics (airlines, visa countries, cruise lines) before launch.
//
// Since the admin panel was added, services are managed in the database; this
// file is the built-in copy the website shows when the API cannot be reached.
// icon names are listed in data/icons.js.
import flightWing from '../assets/images/flight-wing.webp'
import flightTakeoff from '../assets/images/flight-takeoff.webp'
import hotelPool from '../assets/images/hotel-pool.webp'
import cruiseShip from '../assets/images/cruise-ship.webp'

export const services = [
  {
    id: 'flights',
    title: 'Flight Ticket Booking',
    inquiryLabel: 'Flight tickets',
    icon: 'Plane',
    summary:
      'Air tickets for your holiday or a stand-alone trip. Our Vietnam group departures already include return airfare.',
    features: ['Domestic flights', 'International flights', 'Group bookings'],
    image: flightWing,
    imageAlt: 'An aircraft wing above the clouds at sunrise',
  },
  {
    id: 'visa',
    title: 'Visa Assistance',
    inquiryLabel: 'Visa assistance',
    icon: 'Stamp',
    summary:
      'Guidance on the documents your destination needs and help with the application. The Vietnam tourist visa is included in our group package.',
    features: ['Document checklist', 'Application support', 'Tourist visas'],
    image: flightTakeoff,
    imageAlt: 'A passenger jet climbing into a pastel sky',
  },
  {
    id: 'hotels',
    title: 'Hotel Booking',
    inquiryLabel: 'Hotel booking',
    icon: 'Hotel',
    summary:
      'Stays chosen to suit your budget, from the hotels on our packages to stand-alone bookings for your own itinerary.',
    features: ['Package hotels', 'Stand-alone stays', 'Rooms for families and groups'],
    image: hotelPool,
    imageAlt: 'A resort pool and sun loungers beside a timber lodge',
  },
  {
    id: 'cruise',
    title: 'Cruise Experiences',
    inquiryLabel: 'Cruise booking',
    icon: 'Ship',
    summary:
      'From an overnight Ha Long Bay cruise to a dinner cruise in Goa, cruises can be part of your package or booked on their own.',
    features: ['Overnight cruises', 'Dinner cruises', 'Cruise holidays on request'],
    image: cruiseShip,
    imageAlt: 'A large cruise ship docked beside a white-sand beach',
  },
]

// Options for the "What do you need?" select in the enquiry form.
export function buildInquiryServiceOptions(serviceList) {
  return [
    ...new Set([
      'Domestic tour package',
      'International tour package',
      'Visa assistance',
      ...serviceList.map((service) => service.inquiryLabel),
      'Car rental',
      'Something else',
    ]),
  ]
}

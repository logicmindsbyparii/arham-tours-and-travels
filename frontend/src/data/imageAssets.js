// Photos bundled with the website, by name. Database records refer to them as
// "asset:<name>" (e.g. "asset:goa-beach"), so they keep Vite's hashed,
// cache-friendly URLs. Uploaded images are "/uploads/<file>" on the API server.
import { API_ORIGIN } from '../lib/api.js'
import carDrive from '../assets/images/car-drive.webp'
import carRentalHero from '../assets/images/car-rental-hero.webp'
import cruiseShip from '../assets/images/cruise-ship.webp'
import flightTakeoff from '../assets/images/flight-takeoff.webp'
import flightWing from '../assets/images/flight-wing.webp'
import goaBeach from '../assets/images/goa-beach.webp'
import goldenBridgeWalkway from '../assets/images/golden-bridge-walkway.webp'
import goldenBridge from '../assets/images/golden-bridge.webp'
import haLongBayHero from '../assets/images/ha-long-bay-hero.webp'
import haLongBay from '../assets/images/ha-long-bay.webp'
import hanoiTrainStreet from '../assets/images/hanoi-train-street.webp'
import hanoiPagoda from '../assets/images/hanoi-tran-quoc-pagoda.webp'
import heroPeaks from '../assets/images/hero-peaks.webp'
import hotelPool from '../assets/images/hotel-pool.webp'
import mountainValley from '../assets/images/mountain-valley.webp'
import ninhBinhPagoda from '../assets/images/ninh-binh-pagoda.webp'
import dubaiHero from '../assets/images/dubai-hero.webp'
import thailandHero from '../assets/images/thailand-hero.webp'
import singaporeHero from '../assets/images/singapore-hero.webp'
import baliHero from '../assets/images/bali-hero.webp'
import switzerlandHero from '../assets/images/switzerland-hero.webp'
import goaFlyer from '../assets/flyers/goa-4n5d.webp'
import vietnam7Flyer from '../assets/flyers/vietnam-7n8d.webp'
import vietnam9Flyer from '../assets/flyers/vietnam-9n10d.webp'

export const IMAGE_ASSETS = {
  'car-drive': carDrive,
  'car-rental-hero': carRentalHero,
  'cruise-ship': cruiseShip,
  'flight-takeoff': flightTakeoff,
  'flight-wing': flightWing,
  'goa-beach': goaBeach,
  'golden-bridge-walkway': goldenBridgeWalkway,
  'golden-bridge': goldenBridge,
  'ha-long-bay-hero': haLongBayHero,
  'ha-long-bay': haLongBay,
  'hanoi-train-street': hanoiTrainStreet,
  'hanoi-tran-quoc-pagoda': hanoiPagoda,
  'hero-peaks': heroPeaks,
  'hotel-pool': hotelPool,
  'mountain-valley': mountainValley,
  'ninh-binh-pagoda': ninhBinhPagoda,
  'dubai-hero': dubaiHero,
  'thailand-hero': thailandHero,
  'singapore-hero': singaporeHero,
  'bali-hero': baliHero,
  'switzerland-hero': switzerlandHero,
  'flyer-goa-4n5d': goaFlyer,
  'flyer-vietnam-7n8d': vietnam7Flyer,
  'flyer-vietnam-9n10d': vietnam9Flyer,
}

// Turns a stored image reference into a URL the browser can load.
export function resolveImage(ref) {
  if (!ref) return ''
  if (ref.startsWith('asset:')) return IMAGE_ASSETS[ref.slice(6)] ?? ''
  if (ref.startsWith('/uploads/')) return `${API_ORIGIN}${ref}`
  return ref
}

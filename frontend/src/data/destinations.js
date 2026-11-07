// Destinations reuse the package data, so names, durations and prices only
// live in one place (data/packages.js). Each gallery place appears in the
// itinerary of the package it links to.
import haLongBay from '../assets/images/ha-long-bay.webp'
import goldenBridgeWalkway from '../assets/images/golden-bridge-walkway.webp'
import hanoiTrainStreet from '../assets/images/hanoi-train-street.webp'
import hanoiPagoda from '../assets/images/hanoi-tran-quoc-pagoda.webp'
import ninhBinhPagoda from '../assets/images/ninh-binh-pagoda.webp'
import goaBeach from '../assets/images/goa-beach.webp'
import { getPackageById } from './packages.js'

// Places visited on the current packages. The hero banner cycles through
// them and the Destinations section shows them as postcards. accent picks the
// colour each one takes on (azure, jade or ember, see accents.js); poster is
// the two-line banner title.
export const destinations = [
  {
    id: 'ha-long-bay',
    name: 'Ha Long Bay',
    image: haLongBay,
    imageAlt: 'Boats among the limestone islands of Ha Long Bay',
    packageId: 'vietnam-phu-quoc-7n',
    accent: 'azure',
    poster: ['Ha Long', 'Bay'],
    tagline: 'Limestone islands rising out of green water, seen from the deck of a cruise.',
  },
  {
    id: 'golden-bridge',
    name: 'Ba Na Hills',
    image: goldenBridgeWalkway,
    imageAlt: 'The curving Golden Bridge supported by two giant stone hands',
    packageId: 'vietnam-series-9n',
    accent: 'jade',
    poster: ['Ba Na', 'Hills'],
    tagline: 'The Golden Bridge, held up by two giant stone hands above the forest.',
  },
  {
    id: 'hanoi-train-street',
    name: 'Hanoi',
    image: hanoiTrainStreet,
    imageAlt: 'Railway tracks running between houses and cafés on Hanoi Train Street',
    packageId: 'vietnam-phu-quoc-7n',
    accent: 'ember',
    poster: ['Hanoi', 'Streets'],
    tagline: 'Cafés pressed right up against the railway on Hanoi’s Train Street.',
  },
  {
    id: 'ninh-binh',
    name: 'Ninh Binh',
    image: ninhBinhPagoda,
    imageAlt: 'A small pagoda on a lake between steep limestone cliffs',
    packageId: 'vietnam-series-9n',
    accent: 'jade',
    poster: ['Ninh', 'Binh'],
    tagline: 'Pagodas and quiet water between steep limestone cliffs.',
  },
  {
    id: 'hanoi-pagoda',
    name: 'Tran Quoc Pagoda',
    image: hanoiPagoda,
    imageAlt: 'The red tiered tower of Tran Quoc Pagoda among palm trees',
    packageId: 'vietnam-series-9n',
    accent: 'ember',
    poster: ['Tran Quoc', 'Pagoda'],
    tagline: 'The oldest pagoda in Hanoi, on a small island in West Lake.',
  },
  {
    id: 'goa',
    name: 'Goa',
    image: goaBeach,
    imageAlt: 'Palm trees and beach huts along a Goan beach',
    packageId: 'goa-4n',
    accent: 'azure',
    poster: ['Goa', 'Beaches'],
    tagline: 'Palm-lined beaches, beach shacks and long sunsets over the Arabian Sea.',
  },
].map((place) => ({ ...place, package: getPackageById(place.packageId) }))

import { useMemo } from 'react'
import { useSite } from '../features/site/useSite.js'

// '#id' links point at a section of the home page, '/path' links at another
// page (see SiteLink). Every main section has its own page, so search engines
// can list each one. The Reviews link only appears once published reviews
// exist (managed under Testimonials in the admin panel).
//
// Packages and Destinations open a sub-menu (a drop-down on computers, an
// accordion on phones). Its links carry ?type=, which preselects that filter
// on the page, and #results / #guide, which scrolls straight to the list.
// The counts come from the published content.
const countBy = (items, category) => items.filter((item) => item.category === category).length
const destinationCount = (destinations, category) =>
  destinations.filter((place) => place.package?.category === category).length

export function buildNavLinks({ packages, destinations, hasReviews }) {
  return [
    { label: 'Home', href: '#top' },
    {
      label: 'Packages',
      href: '/packages',
      children: [
        { label: 'All packages', href: '/packages#results', kind: 'all', note: 'Every trip we run', count: packages.length },
        { label: 'Domestic packages', href: '/packages?type=domestic#results', kind: 'domestic', note: 'Holidays within India', count: countBy(packages, 'domestic') },
        { label: 'International packages', href: '/packages?type=international#results', kind: 'international', note: 'Group departures abroad', count: countBy(packages, 'international') },
      ],
    },
    {
      label: 'Destinations',
      href: '/destinations',
      children: [
        { label: 'All destinations', href: '/destinations#guide', kind: 'all', note: 'Every place on our trips', count: destinations.length },
        { label: 'Domestic destinations', href: '/destinations?type=domestic#guide', kind: 'domestic', note: 'Beaches and hills of India', count: destinationCount(destinations, 'domestic') },
        { label: 'International destinations', href: '/destinations?type=international#guide', kind: 'international', note: 'Vietnam and beyond', count: destinationCount(destinations, 'international') },
      ],
    },
    { label: 'Services', href: '/services' },
    { label: 'Visa', href: '/visa' },
    { label: 'Car Rental', href: '/car-rental' },
    { label: 'About', href: '/about' },
    ...(hasReviews ? [{ label: 'Reviews', href: '#reviews' }] : []),
    { label: 'Contact', href: '/contact' },
  ]
}

export function buildFooterLinks({ hasReviews }) {
  return {
    Travel: [
      { label: 'Tour packages', href: '/packages' },
      { label: 'Destinations', href: '/destinations' },
      { label: 'Car rental in Surat', href: '/car-rental' },
    ],
    Services: [
      { label: 'Visa assistance', href: '/visa' },
      { label: 'Flight tickets', href: '/services' },
      { label: 'Hotels & cruises', href: '/services' },
    ],
    Company: [
      { label: 'About us', href: '/about' },
      ...(hasReviews ? [{ label: 'Reviews', href: '#reviews' }] : []),
      { label: 'Contact', href: '/contact' },
    ],
  }
}

export function useNavigation() {
  const { packages, destinations, testimonials } = useSite()
  const hasReviews = testimonials.length > 0
  return useMemo(
    () => ({
      navLinks: buildNavLinks({ packages, destinations, hasReviews }),
      footerLinks: buildFooterLinks({ hasReviews }),
    }),
    [packages, destinations, hasReviews],
  )
}

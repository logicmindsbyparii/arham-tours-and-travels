// Kinds of car rental trips we arrange. arhamtours.in does not publish a
// vehicle list or rental prices, so visitors pick a trip type and ask for a quote.
// short is the tab label in the car rental banner.
import { MapPinned, PlaneLanding, Route, UsersRound } from 'lucide-react'

export const TRIP_TYPES = [
  {
    label: 'Airport transfer',
    short: 'Airport',
    icon: PlaneLanding,
    text: 'Airport pick-up and drop timed to your flight, early mornings included.',
  },
  {
    label: 'Local sightseeing',
    short: 'Local',
    icon: MapPinned,
    text: 'A car and driver for the day to see the sights, without the driving or the parking.',
  },
  {
    label: 'Outstation trip',
    short: 'Outstation',
    icon: Route,
    text: 'Trips from Surat to other cities, for a weekend away, a family visit or business.',
  },
  {
    label: 'Group travel',
    short: 'Group',
    icon: UsersRound,
    text: 'Tell us how many are travelling and we will suggest a vehicle that fits the group.',
  },
]

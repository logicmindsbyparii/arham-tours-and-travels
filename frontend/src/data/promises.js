// "Why travel with us" points, shown on the Packages and About pages.
// Every fact here comes from the About section and the package flyers.
import { BadgeCheck, PlaneTakeoff, Users } from 'lucide-react'

export const PROMISES = [
  {
    icon: Users,
    title: 'A Gujarati tour manager',
    text: 'Our group departures travel with a tour manager from start to finish.',
    tone: 'bg-ember',
  },
  {
    icon: BadgeCheck,
    title: 'One all-in price',
    text: 'Flights, stays, visas and sightseeing are arranged and priced as one plan.',
    tone: 'bg-sky',
  },
  {
    icon: PlaneTakeoff,
    title: 'Round-trip departures',
    text: 'Group trips have complete round-trip arrangements, so there is nothing to arrange.',
    tone: 'bg-leaf',
  },
]

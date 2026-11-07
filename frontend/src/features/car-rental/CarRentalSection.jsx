import { useState } from 'react'
import { CarFront, MessageCircle } from 'lucide-react'
import Container from '../../components/ui/Container.jsx'
import SectionHeading from '../../components/ui/SectionHeading.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import SmartImage from '../../components/ui/SmartImage.jsx'
import Tilt from '../../components/ui/Tilt.jsx'
import Button from '../../components/ui/Button.jsx'
import { useEnquire } from '../inquiry/useEnquire.js'
import { useWhatsApp } from '../inquiry/whatsapp.js'
import { TRIP_TYPES } from '../../data/carRental.js'
import carDrive from '../../assets/images/car-drive.webp'

// arhamtours.in does not publish a vehicle list or rental prices, so instead of
// a fleet this section collects the trip details needed for a quote.
const tripTypes = TRIP_TYPES.map((type) => type.label)

function CarRentalSection() {
  const enquire = useEnquire()
  const whatsApp = useWhatsApp()
  const [tripType, setTripType] = useState(tripTypes[0])
  const [route, setRoute] = useState('')

  const summary = route.trim() ? `${tripType}: ${route.trim()}` : tripType

  return (
    <section id="car-rental" aria-labelledby="car-rental-title" className="theme-light bg-ink py-24 sm:py-32">
      <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
        <div>
          <SectionHeading
            id="car-rental-title"
            eyebrow="Car rental"
            accentTone="blue"
            title="A car and driver,"
            accent="where you need it."
            intro="Tell us the kind of trip and your route, and we will suggest a suitable vehicle and send a quote."
          />

          <Reveal delay={0.1} className="mt-10 rounded-[24px] bg-white p-6 ring-1 ring-paper/10 shadow-[0_20px_40px_-30px_rgb(15_23_42/0.25)] sm:p-8">
            <fieldset>
              <legend className="text-sm font-semibold text-paper">Type of trip</legend>
              <div className="mt-3 flex flex-wrap gap-2">
                {tripTypes.map((type) => (
                  <label
                    key={type}
                    className={`cursor-pointer rounded-full px-4 py-2.5 text-sm font-medium ring-1 transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-ember-soft ${
                      tripType === type ? 'bg-paper text-ink ring-paper' : 'text-paper/80 ring-paper/20 hover:ring-paper/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="car-trip-type"
                      value={type}
                      checked={tripType === type}
                      onChange={() => setTripType(type)}
                      className="sr-only"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </fieldset>

            <label htmlFor="car-route" className="mt-6 block text-sm font-semibold text-paper">
              Route and dates <span className="font-normal text-mist">(optional)</span>
            </label>
            <input
              id="car-route"
              value={route}
              onChange={(event) => setRoute(event.target.value)}
              placeholder="e.g. Surat to Mumbai airport, 12 Dec"
              maxLength={150}
              className="mt-2 w-full rounded-xl border border-paper/15 bg-ink px-4 py-3.5 text-base text-paper placeholder:text-mist/60 focus:border-ember-soft focus:outline-none"
            />

            <div className="mt-6 flex flex-wrap gap-3">
              <Button onClick={() => enquire({ service: 'Car rental', destination: summary })}>
                <CarFront size={17} aria-hidden="true" />
                Add to my enquiry
              </Button>
              <Button
                href={whatsApp.build(`Hi, I would like a car rental quote. ${summary}.`)}
                variant="outline"
                external
              >
                <MessageCircle size={17} aria-hidden="true" />
                Ask on WhatsApp
              </Button>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.15} className="relative">
          <Tilt max={8} className="overflow-hidden rounded-[26px] shadow-[0_50px_90px_-45px_rgb(15_23_42/0.45)]">
            <SmartImage
              src={carDrive}
              alt="A driver's hands on the steering wheel with city lights ahead"
              className="aspect-[4/5] w-full"
            />
          </Tilt>
          <p
            aria-hidden="true"
            className="mt-5 rotate-[-4deg] text-right font-hand text-xl text-sky-soft sm:absolute sm:-bottom-12 sm:right-8 sm:mt-0 sm:text-2xl"
          >
            airport runs at 4 am? we've got you.
          </p>
        </Reveal>
      </Container>
    </section>
  )
}

export default CarRentalSection

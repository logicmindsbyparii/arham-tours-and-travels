import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import Button from '../components/ui/Button.jsx'
import Seo from '../components/seo/Seo.jsx'
import FaqSection from '../components/seo/FaqSection.jsx'
import CarRentalHero from '../features/car-rental/CarRentalHero.jsx'
import CarRatesSection from '../features/car-rental/CarRatesSection.jsx'
import ContactSection from '../sections/ContactSection.jsx'
import { useEnquire } from '../features/inquiry/useEnquire.js'
import { TRIP_TYPES } from '../data/carRental.js'
import { useSite } from '../features/site/useSite.js'

const TONES = ['bg-ember', 'bg-sky', 'bg-leaf', 'bg-ink']

function CarRentalPage() {
  const enquire = useEnquire()
  const { faqs } = useSite()

  return (
    <>
      <Seo path="/car-rental" />
      <CarRentalHero />

      <section aria-labelledby="trip-types-title" className="bg-paper pb-20 pt-8 text-ink sm:pb-28 sm:pt-12">
        <Container>
          <SectionHeading
            id="trip-types-title"
            tone="dark"
            eyebrow="What we arrange"
            accentTone="blue"
            title="A car for"
            accent="every kind of trip."
          />
          <ul className="mt-12 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
            {TRIP_TYPES.map(({ label, icon: Icon, text }, index) => (
              <Reveal
                as="li"
                key={label}
                delay={index * 0.08}
                className="flex flex-col rounded-[24px] bg-paper-2 p-6 sm:p-7"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white ${TONES[index % TONES.length]}`}>
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-ink">{label}</h3>
                <p className="mt-2 flex-1 text-sm leading-6 text-slate">{text}</p>
                <button
                  type="button"
                  onClick={() => enquire({ service: 'Car rental', destination: label })}
                  className="mt-5 self-start text-sm font-semibold text-sky-deep underline-offset-4 hover:underline"
                >
                  Get a quote
                </button>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <CarRatesSection />

      <section aria-labelledby="car-tour-title" className="bg-paper py-20 text-ink sm:py-24">
        <Container className="flex flex-col items-start justify-between gap-6 rounded-[28px] bg-paper-2 p-7 sm:p-10 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 id="car-tour-title" className="text-2xl font-semibold text-ink sm:text-3xl">
              Going on one of our tours?
            </h2>
            <p className="mt-3 text-base leading-7 text-slate">
              Ask us about a car to the airport or the departure point when you book your trip.
            </p>
          </div>
          <Button to="/packages" variant="leaf" className="shrink-0">
            See tour packages
          </Button>
        </Container>
      </section>

      <FaqSection faqs={faqs.carRental ?? []} />
      <ContactSection />
    </>
  )
}

export default CarRentalPage

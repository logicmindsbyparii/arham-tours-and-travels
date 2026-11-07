import { useState, useRef } from 'react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { ArrowUpDown, ChevronRight, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../../components/ui/Container.jsx'
import Button from '../../components/ui/Button.jsx'
import CarQuoteForm from './CarQuoteForm.jsx'
import { useBusiness } from '../site/useSite.js'
import { TRIP_TYPES } from '../../data/carRental.js'
import { getSmoothScroll } from '../../hooks/useSmoothScroll.js'
import { useWhatsApp } from '../inquiry/whatsapp.js'
import flightTakeoff from '../../assets/images/flight-takeoff.webp'
import mountainValley from '../../assets/images/mountain-valley.webp'
import heroPeaks from '../../assets/images/hero-peaks.webp'
import familySuv from '../../assets/images/car-rental-hero.webp'
import cityDrive from '../../assets/images/car-drive.webp'
import goaBeach from '../../assets/images/goa-beach.webp'

const EASE = [0.16, 1, 0.3, 1]

// Photo cards of the collage, in two columns. Each belongs to a trip type:
// choosing that type (tab or card) lights its card up.
const COLUMNS = [
  [
    { image: flightTakeoff, label: 'Airport pick-up', trip: 'Airport transfer' },
    { image: heroPeaks, label: 'Weekend outstation', trip: 'Outstation trip' },
    { image: cityDrive, label: 'City by night', trip: 'Local sightseeing' },
  ],
  [
    { image: mountainValley, label: 'Hill road trip', trip: 'Outstation trip' },
    { image: familySuv, label: 'Family SUV', trip: 'Group travel' },
    { image: goaBeach, label: 'Beach weekend', trip: 'Outstation trip' },
  ],
]

// Glides to the quote panel.
function goToQuote() {
  const panel = document.getElementById('car-quote')
  const lenis = getSmoothScroll()
  if (lenis) lenis.scrollTo(panel, { offset: -110 })
  else panel?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

// One headline line, flipping up into place in 3D.
function HeadLine({ children, delay, className = '' }) {
  return (
    <span className="block overflow-hidden pb-[0.06em]">
      <motion.span
        initial={{ y: '105%', rotateX: -70 }}
        animate={{ y: 0, rotateX: 0 }}
        transition={{ duration: 1.1, delay, ease: EASE }}
        className={`block origin-bottom ${className}`}
      >
        {children}
      </motion.span>
    </span>
  )
}

function CollageCard({ card, active, onPick, index }) {
  return (
    <motion.button
      type="button"
      onClick={() => onPick(card.trip)}
      aria-pressed={active}
      aria-label={`${card.label}: ${card.trip}`}
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0, scale: active ? 1.03 : 1 }}
      transition={{ duration: 0.9, delay: 0.3 + index * 0.1, ease: EASE }}
      className={`group relative block aspect-[4/5] w-full overflow-hidden rounded-[22px] bg-paper-2 text-left shadow-[0_30px_50px_-30px_rgb(15_23_42/0.55)] ring-offset-4 ring-offset-paper-2 transition-shadow duration-500 ${
        active ? 'ring-4 ring-sky' : 'ring-0'
      }`}
    >
      <img
        src={card.image}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-110"
      />
      <span className="absolute inset-0 bg-[linear-gradient(0deg,rgb(15_23_42/0.75)_0%,rgb(15_23_42/0.05)_45%,transparent_60%)]" />
      <span className="absolute bottom-4 left-4 right-4 text-base font-bold leading-tight text-white sm:text-lg">
        {card.label}
      </span>
    </motion.button>
  )
}

// Car rental page banner on a light background: the headline, trip tabs and
// a pick-up / drop route on the left, a tilted 3D collage of trip photos on the
// right, and the quote panel below. The trip type and route are shared, so
// whatever is typed or picked up here is already filled in the quote panel.
function CarRentalHero() {
  const reduceMotion = useReducedMotion()
  const business = useBusiness()
  const whatsApp = useWhatsApp()
  const [tripType, setTripType] = useState(TRIP_TYPES[0].label)
  const [route, setRoute] = useState({ pickup: '', drop: '' })
  const activeType = TRIP_TYPES.find((type) => type.label === tripType)

  // The collage leans towards the pointer.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const x = useSpring(pointerX, { stiffness: 60, damping: 20 })
  const y = useSpring(pointerY, { stiffness: 60, damping: 20 })
  const rotateY = useTransform(x, (value) => -12 + value * 10)
  const rotateX = useTransform(y, (value) => 14 - value * 8)

  const boxRef = useRef(null)

  const handlePointerEnter = (event) => {
    if (event.pointerType === 'mouse') {
      boxRef.current = event.currentTarget.getBoundingClientRect()
    }
  }

  const handlePointerMove = (event) => {
    if (reduceMotion || event.pointerType !== 'mouse') return
    if (!boxRef.current) {
      boxRef.current = event.currentTarget.getBoundingClientRect()
    }
    const box = boxRef.current
    if (!box || box.width === 0 || box.height === 0) return
    pointerX.set((event.clientX - box.left) / box.width - 0.5)
    pointerY.set((event.clientY - box.top) / box.height - 0.5)
  }

  const handlePointerLeave = () => {
    boxRef.current = null
    pointerX.set(0)
    pointerY.set(0)
  }

  const updateRoute = (event) => setRoute((current) => ({ ...current, [event.target.name]: event.target.value }))
  const swapRoute = () => setRoute((current) => ({ pickup: current.drop, drop: current.pickup }))

  const whatsAppUrl = whatsApp.build(
    [
      'Hi, I would like a car rental quote.',
      `Trip: ${tripType}`,
      route.pickup.trim() && `Pick-up: ${route.pickup.trim()}`,
      route.drop.trim() && `Drop: ${route.drop.trim()}`,
    ]
      .filter(Boolean)
      .join('\n'),
  )

  return (
    <section
      id="top"
      aria-labelledby="page-title"
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#eaf1fd_0%,#f5f7fa_55%,#ffffff_100%)] pb-20 pt-28 text-ink sm:pt-32 lg:pb-28"
    >
      {/* Soft colour and a faint dot grid */}
      <div aria-hidden="true" className="absolute -right-40 -top-40 -z-10 h-[34rem] w-[34rem] rounded-full bg-sky/15 blur-3xl" />
      <div aria-hidden="true" className="absolute -left-40 top-1/2 -z-10 h-[28rem] w-[28rem] rounded-full bg-leaf/10 blur-3xl" />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(rgb(15_23_42/0.08)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(180deg,black,transparent_70%)]"
      />

      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          {/* Copy, tabs and route */}
          <div className="min-w-0">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate">
                <li>
                  <Link to="/" className="transition-colors hover:text-ink">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={14} />
                </li>
                <li aria-current="page" className="font-medium text-ink">
                  Car rental
                </li>
              </ol>
            </nav>

            <h1
              id="page-title"
              className="mt-6 font-sans text-[clamp(2.8rem,8.4vw,5.6rem)] font-bold leading-[0.98] tracking-[-0.035em] text-ink perspective-[900px]"
            >
              <HeadLine delay={0.15}>Car rental</HeadLine>
              <HeadLine delay={0.27}>with driver</HeadLine>
              <HeadLine
                delay={0.39}
                className="w-fit bg-[linear-gradient(90deg,#1d4ed8_0%,#15803d_100%)] bg-clip-text pr-[0.05em] text-transparent"
              >
                in {business.city}.
              </HeadLine>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
              className="mt-6 max-w-lg text-base leading-7 text-slate sm:text-lg sm:leading-8"
            >
              Airport runs, local sightseeing, outstation trips and group travel. Tell us the route and the date, and
              we send the car with a driver.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
              className="mt-8 max-w-xl"
            >
              {/* Trip type tabs; the highlight slides between them */}
              <div
                role="group"
                aria-label="Type of trip"
                className="grid grid-cols-2 gap-1 rounded-2xl bg-white p-1.5 shadow-[0_14px_30px_-22px_rgb(15_23_42/0.5)] ring-1 ring-ink/10 sm:grid-cols-4 sm:rounded-full"
              >
                {TRIP_TYPES.map((type) => {
                  const Icon = type.icon
                  const active = type.label === tripType
                  return (
                    <button
                      key={type.label}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setTripType(type.label)}
                      className={`relative flex min-h-11 items-center justify-center gap-2 rounded-xl px-3 text-sm font-semibold transition-colors sm:rounded-full ${
                        active ? 'text-white' : 'text-slate hover:text-ink'
                      }`}
                    >
                      {active && (
                        <motion.span
                          layoutId="car-trip-highlight"
                          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                          className="absolute inset-0 -z-0 rounded-xl bg-sky shadow-[0_10px_20px_-10px_rgb(37_99_235/0.9)] sm:rounded-full"
                        />
                      )}
                      <Icon size={16} aria-hidden="true" className="relative" />
                      <span className="relative">{type.short}</span>
                    </button>
                  )
                })}
              </div>

              {/* Route: pick-up and drop joined by a dashed line */}
              <div className="relative mt-4 space-y-3">
                <span aria-hidden="true" className="absolute bottom-7 left-[1.45rem] top-7 border-l-2 border-dashed border-slate/35" />
                <label className="relative block">
                  <span className="sr-only">Pick-up location</span>
                  <span aria-hidden="true" className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-full border-[3.5px] border-ink bg-white" />
                  <input
                    name="pickup"
                    value={route.pickup}
                    onChange={updateRoute}
                    placeholder="Pick-up location, e.g. Adajan, Surat"
                    maxLength={80}
                    autoComplete="street-address"
                    className="h-14 w-full rounded-2xl bg-white pl-12 pr-14 text-base text-ink shadow-[0_14px_30px_-24px_rgb(15_23_42/0.5)] ring-1 ring-ink/10 transition placeholder:text-slate/70 focus:outline-none focus:ring-2 focus:ring-sky"
                  />
                </label>
                <label className="relative block">
                  <span className="sr-only">Drop location</span>
                  <span aria-hidden="true" className="absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-[3px] bg-sky" />
                  <input
                    name="drop"
                    value={route.drop}
                    onChange={updateRoute}
                    placeholder="Drop location, e.g. Surat airport"
                    maxLength={80}
                    className="h-14 w-full rounded-2xl bg-white pl-12 pr-14 text-base text-ink shadow-[0_14px_30px_-24px_rgb(15_23_42/0.5)] ring-1 ring-ink/10 transition placeholder:text-slate/70 focus:outline-none focus:ring-2 focus:ring-sky"
                  />
                </label>
                <button
                  type="button"
                  onClick={swapRoute}
                  aria-label="Swap pick-up and drop"
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-ink shadow-md ring-1 ring-ink/10 transition duration-500 hover:rotate-180 hover:bg-ink hover:text-white"
                >
                  <ArrowUpDown size={17} aria-hidden="true" />
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                <Button onClick={goToQuote} className="min-h-14 px-8 text-base">
                  Get a quote
                </Button>
                <a
                  href="#car-rates"
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-ink/15 bg-white px-6 text-sm font-semibold text-ink shadow-sm transition hover:border-ink/30 hover:bg-paper-2 active:scale-[0.98]"
                >
                  View rate card
                </a>
                <a
                  href={whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-base font-semibold text-ink"
                >
                  <MessageCircle size={19} aria-hidden="true" className="text-leaf" />
                  <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_1.5px] bg-bottom bg-no-repeat pb-0.5 transition-[background-size] duration-500 group-hover:bg-[length:0%_1.5px]">
                    WhatsApp us
                  </span>
                </a>
              </div>
            </motion.div>
          </div>

          {/* 3D photo collage */}
          <div className="relative mx-auto w-full max-w-[560px] lg:max-w-none">
            {/* Wider than the column so the fade mask never cuts the tilted cards side-on. */}
            <div className="relative -mx-6 h-[400px] px-6 perspective-[1400px] [mask-image:linear-gradient(180deg,transparent,black_12%,black_85%,transparent)] sm:-mx-10 sm:h-[520px] sm:px-10 lg:h-[640px]">
              <motion.div
                style={{ rotateX, rotateY, rotateZ: -6 }}
                className="absolute inset-x-[8%] -inset-y-[10%] grid grid-cols-2 gap-4 transform-3d sm:gap-5"
              >
                {COLUMNS.map((column, columnIndex) => (
                  <motion.div
                    key={columnIndex}
                    animate={reduceMotion ? undefined : { y: columnIndex === 0 ? [0, -24, 0] : [-40, -16, -40] }}
                    transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex flex-col gap-4 sm:gap-5"
                  >
                    {column.map((card, cardIndex) => (
                      <CollageCard
                        key={card.label}
                        card={card}
                        index={columnIndex + cardIndex * 2}
                        active={card.trip === tripType}
                        onPick={setTripType}
                      />
                    ))}
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Floating summary of the chosen trip */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.9, ease: EASE }}
              className="absolute -bottom-2 left-1/2 z-10 flex w-[calc(100%-1rem)] max-w-md -translate-x-1/2 items-center justify-between gap-2 rounded-full bg-white/90 py-2 pl-4 pr-2 sm:gap-4 sm:pl-6 shadow-[0_24px_50px_-24px_rgb(15_23_42/0.55)] ring-1 ring-ink/10 backdrop-blur-md lg:bottom-6 lg:left-0 lg:translate-x-0"
            >
              <div className="min-w-0">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={tripType}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                    className="truncate text-base font-bold text-ink"
                  >
                    {activeType.label}
                  </motion.p>
                </AnimatePresence>
                <p className="truncate text-xs text-slate sm:text-sm">Car with driver from {business.city}</p>
              </div>
              <button
                type="button"
                onClick={goToQuote}
                className="shrink-0 whitespace-nowrap rounded-full bg-sky px-4 py-3 text-[0.8rem] font-semibold sm:px-6 sm:text-sm text-white shadow-[0_12px_24px_-12px_rgb(37_99_235/0.9)] transition hover:bg-sky-deep active:scale-[0.97]"
              >
                Get a quote
              </button>
            </motion.div>
          </div>
        </div>

        {/* Quote panel */}
        <div className="mt-16 sm:mt-20">
          <CarQuoteForm tripType={tripType} onTripTypeChange={setTripType} route={route} onRouteChange={setRoute} />
        </div>
      </Container>
    </section>
  )
}

export default CarRentalHero

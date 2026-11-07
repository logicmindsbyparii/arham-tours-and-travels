import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Plane, RotateCcw } from 'lucide-react'
import Container from '../../components/ui/Container.jsx'
import SectionHeading from '../../components/ui/SectionHeading.jsx'
import { formatPrice } from '../../data/packages.js'
import { ACCENTS } from '../../data/accents.js'
import { useEnquire } from '../inquiry/useEnquire.js'
import { useSectionContent, useSite } from '../site/useSite.js'

// Built-in heading; the admin can change it under Website content (home.destinations).
const HEADING = {
  eyebrow: 'Destinations',
  title: 'Places worth the',
  accent: 'long way round.',
  intro: 'Postcards from the places on our current itineraries. Hover or tap one to turn it over for the trip it belongs to.',
}

const EASE = [0.16, 1, 0.3, 1]
// Each postcard lies at its own slight angle, as if pinned up by hand.
const TILTS = [-2.6, 1.8, -1.4, 2.2, -2, 1.5]

// sizeClass sets the stamp's size (the back of the card scales it with the card).
function Stamp({ color, number, sizeClass = 'h-16 w-13' }) {
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: color }}
      className={`flex shrink-0 rotate-6 flex-col items-center justify-center gap-0.5 rounded-[3px] text-white outline-2 outline-offset-[-5px] outline-paper/90 outline-dashed shadow-[0_6px_14px_-6px_rgb(15_23_42/0.35)] ${sizeClass}`}
    >
      <Plane size={16} />
      <span className="font-poster text-sm leading-none tracking-wider">{number}</span>
    </span>
  )
}

// Round postal cancellation mark with wavy lines, drawn in a single stroke colour.
function Postmark({ id, className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 150 80" className={className} fill="none" stroke="currentColor">
      <circle cx="40" cy="40" r="30" strokeWidth="1.6" />
      <circle cx="40" cy="40" r="22" strokeWidth="1" />
      <path id={id} d="M 14 40 A 26 26 0 0 1 66 40" stroke="none" />
      <text fontSize="8" letterSpacing="2" fill="currentColor" stroke="none" fontFamily="Poppins, sans-serif">
        <textPath href={`#${id}`} startOffset="50%" textAnchor="middle">
          ARHAM · SURAT
        </textPath>
      </text>
      <path d="M72 28c10-6 18 6 28 0s18 6 28 0 14 4 20 0" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M72 40c10-6 18 6 28 0s18 6 28 0 14 4 20 0" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M72 52c10-6 18 6 28 0s18 6 28 0 14 4 20 0" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

// A postcard that turns over in 3D: the photo on the front, a handwritten
// note and the trip details on the back. Mouse hover turns it; on touch and
// keyboard the front is a button.
function Postcard({ destination, index }) {
  const enquire = useEnquire()
  const reduceMotion = useReducedMotion()
  const [flipped, setFlipped] = useState(false)
  const frontRef = useRef(null)
  const backRef = useRef(null)

  const item = destination.package
  const accent = ACCENTS[destination.accent] ?? ACCENTS.azure
  const number = String(index + 1).padStart(2, '0')
  const serviceLabel = !item
    ? 'Something else'
    : item.category === 'domestic'
      ? 'Domestic tour package'
      : 'International tour package'

  const turn = (toBack) => {
    setFlipped(toBack)
    // Keyboard and touch: keep focus on the side that is now showing.
    window.requestAnimationFrame(() => (toBack ? backRef : frontRef).current?.focus())
  }

  const onMouse = (value) => (event) => {
    if (event.pointerType === 'mouse') setFlipped(value)
  }

  return (
    <li className={`theme-base ${index % 3 === 1 ? 'xl:mt-16' : index % 3 === 2 ? 'xl:mt-6' : ''}`}>
      <motion.div
        onPointerEnter={onMouse(true)}
        onPointerLeave={onMouse(false)}
        initial={{ opacity: 0, y: 60, rotate: TILTS[index % TILTS.length] * 3 }}
        whileInView={{ opacity: 1, y: 0, rotate: TILTS[index % TILTS.length] }}
        whileHover={{ rotate: 0, y: -12 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.9, delay: (index % 3) * 0.1, ease: EASE }}
        className="relative aspect-[4/3] perspective-[1600px]"
      >
        <motion.div
          initial={false}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease: EASE }}
          className="relative h-full w-full transform-3d"
        >
          {/* Front */}
          <div
            inert={flipped}
            className="group absolute inset-0 rounded-md bg-paper p-2.5 shadow-[0_30px_60px_-28px_rgb(15_23_42/0.4)] backface-hidden"
          >
            <div className="relative h-full overflow-hidden rounded-[3px] bg-ink">
              <img
                src={destination.image}
                alt={destination.imageAlt}
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out-expo group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-[linear-gradient(0deg,rgb(8_20_42/0.85)_0%,rgb(8_20_42/0.1)_45%,transparent_60%)]" />
              <div className="absolute inset-x-5 bottom-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.28em]" style={{ color: accent.soft }}>
                  Greetings from
                </p>
                <h3 className="font-hand text-[2.4rem] leading-none text-paper sm:text-5xl">{destination.name}</h3>
              </div>
              <Postmark id={`postmark-${destination.id}`} className="absolute right-20 top-3 w-28 text-paper/75" />
            </div>
            <span className="absolute right-5 top-5">
              <Stamp color={accent.solid} number={number} />
            </span>
            <button
              ref={frontRef}
              type="button"
              onClick={() => turn(true)}
              aria-label={`Turn over the ${destination.name} postcard for trip details`}
              className="absolute inset-0 rounded-md"
            />
          </div>

          {/* Back. The card keeps its postcard shape (4:3) at every width, so
              everything on it is sized from the card's own width (cqw units of
              the @container) and long texts are capped at a few lines: the
              note, details and buttons always fit inside the card. */}
          <div
            inert={!flipped}
            className="@container absolute inset-0 rotate-y-180 rounded-md bg-paper text-ink shadow-[0_30px_60px_-28px_rgb(15_23_42/0.4)] backface-hidden"
          >
            <div className="grid h-full grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-x-[4cqw] p-[5cqw]">
            <div className="flex min-h-0 flex-col">
              <p className="line-clamp-6 font-hand text-[clamp(0.8rem,5cqw,1.4rem)] leading-[1.2] text-ink/85">
                {destination.tagline}
              </p>
              <p className="mt-auto pt-[2cqw] font-hand text-[clamp(0.8rem,4.6cqw,1.25rem)] leading-tight" style={{ color: accent.deep }}>
                — the Arham team
              </p>
            </div>
            <div className="flex min-h-0 flex-col border-l border-ink/15 pl-[4cqw]">
              <div className="flex items-start justify-between gap-2">
                <span className="text-[clamp(0.5rem,2.4cqw,0.6rem)] font-bold uppercase tracking-[0.2em] text-slate">Post card</span>
                <Stamp color={accent.solid} number={number} sizeClass="h-[min(15cqw,4rem)] w-[min(12.5cqw,3.25rem)]" />
              </div>
              {item && (
              <dl className="mt-[2cqw] space-y-[1.2cqw] text-[clamp(0.65rem,3.4cqw,0.75rem)]">
                <div className="border-b border-dotted border-ink/30 pb-[0.8cqw]">
                  <dt className="sr-only">Package</dt>
                  <dd className="line-clamp-2 font-semibold leading-snug">{item.title}</dd>
                </div>
                <div className="flex flex-wrap justify-between gap-x-2 border-b border-dotted border-ink/30 pb-[0.8cqw]">
                  <dt className="text-slate">Duration</dt>
                  <dd className="font-semibold">
                    {item.nights}N / {item.days}D
                  </dd>
                </div>
                <div className="flex flex-wrap justify-between gap-x-2 border-b border-dotted border-ink/30 pb-[0.8cqw]">
                  <dt className="text-slate">From</dt>
                  <dd className="font-semibold">{formatPrice(item.price, item.currency)}</dd>
                </div>
              </dl>
              )}
              {/* No published package linked in the admin: no duration or price to show. */}
              {!item && (
                <p className="mt-[2cqw] line-clamp-3 border-b border-dotted border-ink/30 pb-[0.8cqw] text-[clamp(0.65rem,3.4cqw,0.75rem)] leading-snug text-slate">
                  Dates, duration and price on request.
                </p>
              )}
              <div className="mt-auto flex items-center gap-[2cqw] pt-[2cqw]">
                <button
                  ref={backRef}
                  type="button"
                  onClick={() => enquire({ service: serviceLabel, destination: item?.title ?? destination.name })}
                  style={{ backgroundColor: accent.solid }}
                  className="h-[clamp(2.25rem,11cqw,2.5rem)] min-w-0 flex-1 whitespace-nowrap rounded-md px-1 text-[clamp(0.65rem,3.4cqw,0.75rem)] font-semibold text-white transition hover:brightness-110 active:scale-[0.97]"
                >
                  {/* The full label only where the card is wide enough for it. */}
                  <span className="@[23rem]:hidden">Plan trip</span>
                  <span className="hidden @[23rem]:inline">Plan this trip</span>
                </button>
                <button
                  type="button"
                  onClick={() => turn(false)}
                  aria-label={`Turn the ${destination.name} postcard back over`}
                  className="flex h-[clamp(2.25rem,11cqw,2.5rem)] w-[clamp(2.25rem,11cqw,2.5rem)] shrink-0 items-center justify-center rounded-md ring-1 ring-ink/20 transition hover:bg-ink hover:text-paper"
                >
                  <RotateCcw size={15} aria-hidden="true" />
                </button>
              </div>
            </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </li>
  )
}

function DestinationsSection() {
  const { destinations } = useSite()
  const heading = useSectionContent('home.destinations', HEADING)

  if (destinations.length === 0) return null

  return (
    <section id="destinations" aria-labelledby={heading ? 'destinations-title' : undefined} aria-label={heading ? undefined : 'Destinations'} className="theme-light overflow-hidden bg-ink-2 py-24 sm:py-32">
      <Container>
        {heading && (
          <SectionHeading
            id="destinations-title"
            eyebrow={heading.eyebrow}
            title={heading.title}
            accent={heading.accent}
            accentTone="blue"
            intro={heading.intro}
          />
        )}

        <ul className="mt-16 grid gap-x-10 gap-y-14 sm:mt-20 md:grid-cols-2 xl:grid-cols-3">
          {destinations.map((destination, index) => (
            <Postcard key={destination.id} destination={destination} index={index} />
          ))}
        </ul>
      </Container>
    </section>
  )
}

export default DestinationsSection

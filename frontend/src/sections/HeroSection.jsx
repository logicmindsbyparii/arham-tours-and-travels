import { memo, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion'
import { ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, MapPin, Wallet } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Button from '../components/ui/Button.jsx'
import HeaderSpacer from '../components/layout/HeaderSpacer.jsx'
import { formatPrice } from '../data/packages.js'
import { useSite } from '../features/site/useSite.js'
import { ACCENTS } from '../data/accents.js'
import { goToSlide, nextSlide, previousSlide, selectActiveSlide } from '../features/slider/sliderSlice.js'
import { useEnquire } from '../features/inquiry/useEnquire.js'

const EASE = [0.16, 1, 0.3, 1]
const AUTOPLAY_MS = 4500
const PANEL_COUNT = 4

const pad = (value) => String(value).padStart(2, '0')

// One line of the poster title: solid white capitals with a soft dark shadow,
// so they stay readable on any photo, flipping up into place in 3D.
function PosterLine({ text, index, className = '' }) {
  return (
    <span className={`block overflow-hidden pb-[0.06em] ${className}`}>
      <motion.span
        data-poster-word
        initial={{ transform: 'translateY(105%) rotateX(-80deg)' }}
        animate={{ transform: 'translateY(0%) rotateX(0deg)' }}
        exit={{
          transform: 'translateY(-70%) rotateX(55deg)',
          opacity: 0,
          transition: { duration: 0.45, ease: 'easeIn' },
        }}
        transition={{ duration: 1, delay: 0.1 + index * 0.12, ease: EASE }}
        className="inline-block origin-bottom text-paper [text-shadow:0_2px_3px_rgb(15_23_42/0.5)] sm:[text-shadow:0_2px_3px_rgb(15_23_42/0.45),0_6px_16px_rgb(15_23_42/0.35)]"
      >
        {text}
      </motion.span>
    </span>
  )
}

// The two-line poster title at the banner's full size. Only when a long name
// would run past its space (behind the photo panels, or off a phone screen)
// does that title shrink just enough to fit. Measured before paint, and again
// when the window resizes or the font finishes loading.
function PosterTitle({ lines }) {
  const ref = useRef(null)
  const scaleRef = useRef(1)
  const [scale, setScale] = useState(1)

  useLayoutEffect(() => {
    const box = ref.current
    const fit = () => {
      let ratio = 1
      box.querySelectorAll('[data-poster-word]').forEach((word) => {
        const line = word.parentElement
        const style = getComputedStyle(line)
        const room = line.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight)
        // offsetWidth ignores the flip transform; divide out the current scale for the full-size width.
        const fullWidth = word.offsetWidth / scaleRef.current
        if (fullWidth > 0) ratio = Math.min(ratio, room / fullWidth)
      })
      const next = Math.min(1, Math.floor(ratio * 100) / 100)
      if (next !== scaleRef.current) {
        scaleRef.current = next
        setScale(next)
      }
    }

    fit()
    let alive = true
    document.fonts?.ready.then(() => alive && fit())
    const observer = new ResizeObserver(fit)
    observer.observe(box)
    return () => {
      alive = false
      observer.disconnect()
    }
  }, [])

  return (
    <span ref={ref} className="col-start-1 row-start-1 block min-w-0" style={{ fontSize: `${scale}em` }}>
      <PosterLine text={lines[0]} index={0} className="px-4 sm:px-10 lg:pl-[24%] lg:pr-14" />
      {/* On large screens the second line sits level with the photo panels,
          so its room ends at the middle of the banner. */}
      <PosterLine text={lines[1]} index={1} className="px-4 sm:px-10 lg:pl-14 lg:pr-[50%]" />
    </span>
  )
}

// A photo of an upcoming place, folded back in 3D. Choosing it opens it.
// The four panels stay in place from slide to slide; only their photos change,
// sliding in and fading over the old ones, one panel after another. (Moving the
// panels themselves meant measuring and re-laying them out on every slide.)
const Panel = memo(function Panel({ destination, index, order, onSelect }) {
  return (
    <motion.button
      type="button"
      onClick={() => onSelect(index)}
      aria-label={`Show ${destination.name}`}
      initial={{ opacity: 0, rotateY: -85, x: 70 }}
      animate={{ opacity: 1, rotateY: -32, x: 0, z: 0 }}
      whileHover={{ rotateY: -4, z: 80 }}
      whileFocus={{ rotateY: -4, z: 80 }}
      transition={{ duration: 0.85, delay: order * 0.07, ease: EASE }}
      className="group relative h-full min-w-0 flex-1 origin-left overflow-hidden border border-paper/70 bg-ink shadow-[14px_0_28px_-10px_rgb(0_0_0/0.65)] sm:shadow-[22px_0_40px_-14px_rgb(0_0_0/0.65)] transform-3d"
    >
      <span className="absolute inset-0 transition-transform duration-700 ease-out-expo group-hover:scale-110">
        <AnimatePresence initial={false}>
          <motion.img
            key={destination.id}
            src={destination.image}
            alt=""
            decoding="async"
            initial={{ opacity: 0, transform: 'translateX(35%) scale(1.1)' }}
            animate={{ opacity: 1, transform: 'translateX(0%) scale(1)' }}
            exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.2 + order * 0.08 } }}
            transition={{ duration: 0.75, delay: order * 0.08, ease: EASE }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
      </span>
      <span className="absolute inset-0 bg-[linear-gradient(0deg,rgb(8_20_42/0.8),transparent_55%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
      <span className="absolute inset-x-2 bottom-2 translate-y-3 text-left font-hand text-lg leading-tight text-paper opacity-0 transition duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
        {destination.name}
      </span>
    </motion.button>
  )
})

// The call to action of a slide: a page of the site, a section of this page
// or an external link.
function SlideAction({ slide }) {
  const link = slide.ctaLink || '#packages'
  const label = slide.ctaLabel || 'Explore trips'
  const className = 'min-h-14 rounded-xl! px-8 text-base'
  if (link.startsWith('/')) {
    return (
      <Button to={link} variant="leaf" className={className}>
        {label}
      </Button>
    )
  }
  return (
    <Button href={link} variant="leaf" external={/^https?:/.test(link)} className={className}>
      {label}
    </Button>
  )
}

// Slides are the active hero banners from the admin panel (see useSite).
function HeroCarousel() {
  const dispatch = useDispatch()
  const enquire = useEnquire()
  const reduceMotion = useReducedMotion()
  const { banners: slides, business } = useSite()
  const SLIDE_COUNT = slides.length
  const activeIndex = useSelector(selectActiveSlide) % SLIDE_COUNT
  const { scrollY } = useScroll()
  const backdropY = useTransform(scrollY, [0, 900], [0, reduceMotion ? 0 : 160])

  // The photo drifts against the pointer, so the glass frame seems to float in front.
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const driftX = useSpring(pointerX, { stiffness: 50, damping: 20 })
  const driftY = useSpring(pointerY, { stiffness: 50, damping: 20 })

  // Autoplay always runs (the banner fills the screen, so pausing on hover
  // left it stopped most of the time). The timer restarts after every slide
  // change, so a slide chosen by hand still gets its full time on screen.
  // Fetch and decode every banner photo once the first is showing, so a slide
  // change never waits for (or stutters on) a photo being decoded.
  useEffect(() => {
    const idle = window.requestIdleCallback ?? ((callback) => window.setTimeout(callback, 600))
    idle(() => {
      slides.forEach(({ image }) => {
        if (!image) return
        const photo = new Image()
        photo.src = image
        photo.decode?.().catch(() => {})
      })
    })
  }, [slides])

  useEffect(() => {
    const timer = window.setTimeout(() => dispatch(nextSlide(SLIDE_COUNT)), AUTOPLAY_MS)
    return () => window.clearTimeout(timer)
  }, [activeIndex, dispatch, SLIDE_COUNT])

  const active = slides[activeIndex]
  // The package behind the slide, if it has one (and it is published).
  const item = active.package
  const accent = ACCENTS[active.accent] ?? ACCENTS.azure
  const serviceLabel = !item
    ? 'Something else'
    : item.category === 'domestic'
      ? 'Domestic tour package'
      : 'International tour package'
  const upcoming = useMemo(
    () => Array.from({ length: PANEL_COUNT }, (_, offset) => (activeIndex + 1 + offset) % SLIDE_COUNT),
    [activeIndex, SLIDE_COUNT],
  )

  const show = useCallback(
    (index) => dispatch(goToSlide((index + SLIDE_COUNT) % SLIDE_COUNT)),
    [dispatch, SLIDE_COUNT],
  )

  const handlePointerMove = (event) => {
    if (reduceMotion || event.pointerType !== 'mouse') return
    pointerX.set((event.clientX / window.innerWidth - 0.5) * -36)
    pointerY.set((event.clientY / window.innerHeight - 0.5) * -24)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowRight') show(activeIndex + 1)
    if (event.key === 'ArrowLeft') show(activeIndex - 1)
  }

  return (
    <section
      id="top"
      aria-labelledby="hero-title"
      onPointerMove={handlePointerMove}
      style={{ '--accent': accent.solid, '--accent-soft': accent.soft }}
      className="relative isolate overflow-hidden bg-ink pb-8 pt-24 sm:pb-10 sm:pt-28"
    >
      {/* Full-bleed photo of the current place */}
      <motion.div aria-hidden="true" style={{ y: backdropY }} className="absolute inset-0 -z-20">
        <motion.div style={{ x: driftX, y: driftY }} className="absolute -inset-10">
          <AnimatePresence initial={false}>
            <motion.img
              key={active.id}
              src={active.image}
              alt=""
              fetchPriority={activeIndex === 0 ? 'high' : undefined}
              initial={{ opacity: 0, transform: 'scale(1.12)' }}
              animate={{ opacity: 1, transform: 'scale(1.04)' }}
              exit={{ opacity: 0, transition: { duration: 1.2, ease: 'easeInOut' } }}
              transition={{ duration: 1.4, ease: EASE }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(8_20_42/0.75)_0%,rgb(8_20_42/0.15)_22%,rgb(8_20_42/0.1)_70%,rgb(8_20_42/0.7)_100%)]"
      />

      <h1 id="hero-title" className="sr-only">
        {business.name}: tours and travels in {business.city} for group tours and holiday packages
      </h1>

      <Container>
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Featured countries & packages"
          onKeyDown={handleKeyDown}
          className="relative flex min-h-[calc(100svh-8rem)] flex-col overflow-hidden rounded-[26px] ring-2 ring-paper/85 sm:min-h-[calc(100svh-9.5rem)] sm:rounded-[36px] lg:min-h-[min(calc(100svh-9.5rem),660px)]"
        >
          {/* Misty glass over the copy half, clear glass over the panels. Phones
              get a deeper tint instead of the blur: blurring a full-screen photo
              while it changes is too much for most phone graphics chips. */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(180deg,rgb(8_20_42/0.35)_0%,rgb(8_20_42/0.5)_55%,rgb(8_20_42/0.82)_100%)] lg:right-1/2 lg:bg-[linear-gradient(180deg,rgb(233_240_248/0.16)_0%,rgb(8_20_42/0.35)_55%,rgb(8_20_42/0.75)_100%)] lg:backdrop-blur-md"
          />
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-1/2 right-0 hidden bg-[linear-gradient(180deg,transparent_55%,rgb(8_20_42/0.55)_100%)] lg:block"
          />

          {/* Top row */}
          <div className="relative flex items-center justify-between gap-4 px-4 pt-5 sm:px-10 sm:pt-8 lg:px-14 lg:pt-8">
            <p className="flex items-center gap-3 text-[0.7rem] font-bold uppercase tracking-[0.22em] text-paper sm:text-xs">
              <span className="h-px w-7 bg-[var(--accent-soft)] transition-colors duration-700" />
              {business.city} · Group departures &amp; holidays
            </p>
            <p
              className="hidden items-center gap-2 text-xs font-semibold tabular-nums text-paper sm:flex"
              aria-live="polite"
            >
              <MapPin
                size={14}
                aria-hidden="true"
                className="text-[var(--accent-soft)] transition-colors duration-700"
              />
              {item?.region && item.region !== active.name ? `${active.name}, ${item.region}` : active.name}
              <span className="text-paper/60">
                · {pad(activeIndex + 1)}/{pad(SLIDE_COUNT)}
              </span>
            </p>
          </div>

          {/* Poster title */}
          <div
            aria-hidden="true"
            className="relative mt-4 sm:mt-6 lg:mt-7 grid h-[2.15em] grid-cols-[minmax(0,1fr)] items-end whitespace-nowrap font-poster text-[clamp(2.3rem,11.5vw,4.8rem)] font-bold uppercase leading-none tracking-[0.06em] perspective-[1000px] sm:text-[clamp(4.2rem,11.5vw,7.2rem)] lg:text-[clamp(4.2rem,8.5vw,7.8rem)]"
          >
            {/* One line each, never wrapping. The box keeps the height of two
                full-size lines, so the copy below never moves between slides.
                The old title flips away while the new one flips in, in the
                same grid cell, so the banner never sits empty between slides. */}
            <AnimatePresence initial={false}>
              <PosterTitle key={active.id} lines={active.poster} />
            </AnimatePresence>
          </div>

          {/* Copy and actions | panels and controls */}
          {/* On large screens the panels sit in the clear half, level with the second title line. */}
          <div className="relative mt-4 sm:mt-6 grid grid-cols-[minmax(0,1fr)] gap-6 sm:gap-8 px-4 pb-5 sm:px-10 sm:pb-8 lg:mt-5 lg:grid-cols-2 lg:gap-14 lg:px-14 lg:pb-10">
            <div>
              <div className="grid grid-cols-[minmax(0,1fr)]">
                <AnimatePresence initial={false}>
                  <motion.p
                    key={active.id}
                    initial={{ opacity: 0, transform: 'translateY(14px)' }}
                    animate={{
                      opacity: 1,
                      transform: 'translateY(0px)',
                      transition: { duration: 0.7, delay: 0.25, ease: EASE },
                    }}
                    exit={{ opacity: 0, transform: 'translateY(-8px)', transition: { duration: 0.3 } }}
                    className="col-start-1 row-start-1 min-h-[3.5rem] max-w-md text-sm leading-6 tracking-[0.02em] text-paper sm:min-h-[4rem] sm:text-lg sm:leading-8"
                  >
                    {active.tagline}
                  </motion.p>
                </AnimatePresence>
              </div>

              <div className="mt-5 sm:mt-8 flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-3 sm:gap-y-4">
                <SlideAction slide={active} />
                <button
                  type="button"
                  onClick={() => enquire({ service: serviceLabel, destination: item?.title ?? active.name })}
                  className="group inline-flex items-center gap-2.5 sm:gap-3 text-sm sm:text-base font-semibold text-paper"
                >
                  <span className="relative flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full ring-2 ring-paper/80 transition duration-500 group-hover:bg-[var(--accent)] group-hover:ring-[var(--accent)]">
                    <span className="absolute inset-0 rounded-full ring-2 ring-paper/40 motion-safe:animate-ping [animation-duration:2.4s]" />
                    <ArrowUpRight
                      size={18}
                      aria-hidden="true"
                      className="transition-transform duration-500 group-hover:rotate-45"
                    />
                  </span>
                  Plan this trip
                </button>
              </div>

              {item && (
              <ul className="mt-5 sm:mt-9 flex flex-wrap gap-x-5 sm:gap-x-6 gap-y-2 text-xs sm:text-sm text-paper/85">
                <li className="flex items-center gap-2">
                  <CalendarDays
                    size={16}
                    aria-hidden="true"
                    className="text-[var(--accent-soft)] transition-colors duration-700"
                  />
                  {item.nights}N / {item.days}D
                </li>
                <li className="flex items-center gap-2">
                  <Wallet
                    size={16}
                    aria-hidden="true"
                    className="text-[var(--accent-soft)] transition-colors duration-700"
                  />
                  from {formatPrice(item.price, item.currency)}
                </li>
                <li className="hidden basis-full truncate sm:block">{item.title}</li>
              </ul>
              )}
            </div>

            <div className="flex flex-col gap-4 sm:gap-6 lg:absolute lg:bottom-10 lg:right-14 lg:w-[calc(50%-7rem)]">
              <div className="flex items-center gap-5">
                <div className="flex h-[130px] flex-1 perspective-[1100px] sm:h-[220px] lg:h-[250px]">
                  {upcoming.map((index, order) => (
                    <Panel key={order} destination={slides[index]} index={index} order={order} onSelect={show} />
                  ))}
                </div>

                {/* Diamond pagination */}
                <div className="relative hidden flex-col items-center sm:flex">
                  <span
                    aria-hidden="true"
                    className="absolute -inset-y-10 left-1/2 w-px -translate-x-1/2 bg-paper/50"
                  />
                  {slides.map((destination, index) => {
                    const current = index === activeIndex
                    return (
                      <button
                        key={destination.id}
                        type="button"
                        onClick={() => show(index)}
                        aria-label={`Show ${destination.name}`}
                        aria-current={current ? 'true' : undefined}
                        className="group/dot relative flex h-9 w-9 items-center justify-center"
                      >
                        <span
                          className={`block h-3.5 w-3.5 rotate-45 border-2 transition-all duration-500 group-hover/dot:rotate-[135deg] ${
                            current ? 'scale-125 border-paper bg-paper' : 'border-paper/80 bg-ink/40 hover:bg-paper/60'
                          }`}
                        />
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="truncate font-hand text-lg text-paper sm:text-xl">
                  next:{' '}
                  <span className="text-[var(--accent-soft)] transition-colors duration-700">
                    {slides[upcoming[0]].name}
                  </span>
                </p>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => dispatch(previousSlide(SLIDE_COUNT))}
                    aria-label="Previous country"
                    className="group/arrow flex h-13 w-13 items-center justify-center rounded-xl bg-paper/10 text-paper ring-1 ring-paper/40 backdrop-blur transition hover:bg-paper hover:text-ink"
                  >
                    <ChevronLeft
                      size={22}
                      aria-hidden="true"
                      className="transition-transform group-hover/arrow:-translate-x-0.5"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => dispatch(nextSlide(SLIDE_COUNT))}
                    aria-label="Next country"
                    className="group/arrow flex h-13 w-13 items-center justify-center rounded-xl bg-[var(--accent)] text-white ring-1 ring-paper/50 transition-[background-color,filter] duration-700 hover:brightness-110"
                  >
                    <ChevronRight
                      size={22}
                      aria-hidden="true"
                      className="transition-transform group-hover/arrow:translate-x-0.5"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}

// With no active banners in the admin panel the hero is hidden.
function HeroSection() {
  const { banners, business } = useSite()
  if (banners.length === 0) return <HeaderSpacer title={`${business.name}: tours and travels in ${business.city}`} />
  return <HeroCarousel />
}

export default HeroSection

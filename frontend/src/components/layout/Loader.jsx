import { cubicBezier, motion, useReducedMotion } from 'framer-motion'
import Logo from '../ui/Logo.jsx'

export const FLIGHT_SECONDS = 2.0
const FLIGHT_EASE = [0.45, 0.05, 0.4, 1]
const ease = cubicBezier(...FLIGHT_EASE)

// The plane's centre travels from 62vh below the middle of the screen to 70vh
// above it. These convert a height on screen into the moment the plane passes it,
// so each contrail puff appears just as the engines go by.
const START_Y = 62
const END_Y = -70
const timeAtProgress = (progress) => {
  let t = 0
  while (t < 1 && ease(t) < progress) t += 0.005
  return t * FLIGHT_SECONDS
}

// Puffs of the two contrails, from the bottom of the screen to above the top.
// Streamlined puff count (28 per trail) for a silky 60fps takeoff on all devices.
const PUFFS_PER_TRAIL = 28
const PUFFS = Array.from({ length: PUFFS_PER_TRAIL }, (_, index) => {
  const screenY = 108 - index * (122 / PUFFS_PER_TRAIL) // vh from the top of the screen
  const progress = (START_Y - (screenY - 50)) / (START_Y - END_Y)
  return {
    screenY,
    delay: timeAtProgress(progress) + 0.05,
    size: 42 + ((index * 8) % 24),
    drift: 10 + ((index * 6) % 20),
    wobble: ((index * 11) % 9) - 4,
  }
})

const CLOUDS = [
  { left: '6%', width: 420, top: -30, duration: 3.2, opacity: 0.1 },
  { left: '58%', width: 520, top: -60, duration: 2.6, opacity: 0.12 },
  { left: '30%', width: 360, top: -10, duration: 3.8, opacity: 0.07 },
  { left: '72%', width: 300, top: 10, duration: 3.4, opacity: 0.08 },
]

const STARS = Array.from({ length: 36 }, (_, index) => ({
  left: `${(index * 37) % 100}%`,
  top: `${(index * 53) % 60}%`,
  delay: (index % 9) * 0.25,
}))

// Plane width and engine offset, larger on big screens.
const isLarge = typeof window !== 'undefined' && window.innerWidth >= 640
const PLANE_WIDTH = isLarge ? 190 : 140
const ENGINE_OFFSET = PLANE_WIDTH * 0.205

// Top view of an airliner, nose up. The livery picks up the theme:
// red tail, blue and green wingtips.
function Airliner({ className = '' }) {
  return (
    <svg viewBox="0 0 100 120" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="loader-body" x1="0" x2="1">
          <stop offset="0" stopColor="#dfe6f2" />
          <stop offset="0.5" stopColor="#ffffff" />
          <stop offset="1" stopColor="#cfd8e6" />
        </linearGradient>
      </defs>
      {/* Wings */}
      <path d="M56 42 L97 66 L97 73 L56 62 Z" fill="url(#loader-body)" />
      <path d="M44 42 L3 66 L3 73 L44 62 Z" fill="url(#loader-body)" />
      <path d="M93 63.5 L97 66 L97 73 L93 72 Z" fill="#2563eb" />
      <path d="M7 63.5 L3 66 L3 73 L7 72 Z" fill="#15803d" />
      {/* Engines */}
      <rect x="67" y="50" width="7" height="15" rx="3.5" fill="#c3cede" />
      <rect x="26" y="50" width="7" height="15" rx="3.5" fill="#c3cede" />
      {/* Tailplane */}
      <path d="M54.5 95 L73 107 L73 112 L54 106 Z" fill="url(#loader-body)" />
      <path d="M45.5 95 L27 107 L27 112 L46 106 Z" fill="url(#loader-body)" />
      {/* Fuselage */}
      <path
        d="M50 3 C54.5 3 56.5 12 56.5 22 L56.5 92 C56.5 101 53.5 112 50 117 C46.5 112 43.5 101 43.5 92 L43.5 22 C43.5 12 45.5 3 50 3 Z"
        fill="url(#loader-body)"
      />
      {/* Fin seen from above, in red */}
      <path d="M48.6 96 L51.4 96 L51.4 116 C50.6 117 49.4 117 48.6 116 Z" fill="#dc2626" />
      {/* Cockpit windows */}
      <path d="M46.5 13 Q50 9.5 53.5 13 L53 16 Q50 14 47 16 Z" fill="#1e3a8a" />
    </svg>
  )
}

// First-visit loader: a large airliner takes off from the bottom of the screen
// through a night sky, leaving two billowing cloud contrails, and the logo
// appears from a glow of cloud as it passes. On exit the sky lifts away.
function Loader() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      role="status"
      aria-label="Loading Arham Tours & Travels"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        pointerEvents: 'none',
        transition: { duration: 0.5, ease: 'easeOut' },
      }}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#070d1d_0%,#0f172a_45%,#16306a_100%)] text-paper pointer-events-auto shadow-[0_30px_90px_rgba(0,0,0,0.7)]"
    >
      {!reduceMotion && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* Stars */}
          {STARS.map((star, index) => (
            <span
              key={index}
              style={{ left: star.left, top: star.top, '--delay': `${star.delay}s` }}
              className="loader-star absolute h-[2px] w-[2px] rounded-full bg-white"
            />
          ))}

          {/* Cloud banks sliding down: the climb, felt from inside */}
          {CLOUDS.map((cloud, index) => (
            <span
              key={index}
              style={{
                left: cloud.left,
                width: cloud.width,
                height: cloud.width * 0.42,
                opacity: cloud.opacity,
                '--from': `${cloud.top}vh`,
                '--duration': `${cloud.duration}s`,
              }}
              className="loader-cloud absolute top-0 rounded-[50%] bg-[radial-gradient(closest-side,#fff,rgb(255_255_255/0.6)_45%,transparent)]"
            />
          ))}

          {/* Contrails: puffs of cloud that bloom behind each engine and drift apart */}
          {[-1, 1].map((side) =>
            PUFFS.map((puff, index) => (
              <span
                key={`${side}-${index}`}
                style={{
                  top: `${puff.screenY}vh`,
                  left: `calc(50% + ${side * ENGINE_OFFSET + puff.wobble}px)`,
                  width: puff.size,
                  height: puff.size,
                  marginLeft: -puff.size / 2,
                  '--delay': `${puff.delay}s`,
                  '--dx': `${side * puff.drift}px`,
                }}
                className="loader-puff absolute rounded-full bg-[radial-gradient(circle,rgb(255_255_255/0.85)_0%,rgb(226_232_240/0.45)_38%,transparent_68%)]"
              />
            )),
          )}

          {/* The plane: climbs on the outer box, banks and grows on the inner one */}
          <div
            style={{ width: PLANE_WIDTH, marginLeft: -PLANE_WIDTH / 2, marginTop: -PLANE_WIDTH * 0.6 }}
            className="loader-climb absolute left-1/2 top-1/2"
          >
            <div className="loader-bank">
              <Airliner className="w-full drop-shadow-[0_18px_24px_rgb(0_0_0/0.45)]" />
            </div>
          </div>
        </div>
      )}

      {/* Logo, appearing out of a glow of cloud as the plane passes */}
      <motion.div
        exit={{ opacity: 0, y: -30, transition: { duration: 0.35, ease: 'easeIn' } }}
        className="relative flex flex-col items-center px-6 text-center"
      >
        {!reduceMotion && (
          <span
            aria-hidden="true"
            className="loader-glow absolute left-1/2 top-1/2 -z-10 h-56 w-[34rem] max-w-[90vw] rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_255_255/0.3),transparent)]"
          />
        )}
        <div className="loader-rise" style={{ '--delay': `${reduceMotion ? 0 : FLIGHT_SECONDS * 0.5}s` }}>
          <Logo onDark className="[&>img]:h-14 sm:[&>img]:h-20" />
        </div>
        <p
          aria-hidden="true"
          className="loader-rise mt-5 font-hand text-2xl text-sky-soft"
          style={{ '--delay': `${reduceMotion ? 0.2 : FLIGHT_SECONDS * 0.65}s` }}
        >
          up, up and away…
        </p>
      </motion.div>
    </motion.div>
  )
}

export default Loader

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { MapPin, CalendarDays, Wallet, ArrowUpRight, Sparkles } from 'lucide-react'
import { formatPrice } from '../../data/packages.js'
import { useEnquire } from '../inquiry/useEnquire.js'

export default function Destination3DCard({ destination, index }) {
  const cardRef = useRef(null)
  const rectRef = useRef(null)
  const enquire = useEnquire()
  const reduceMotion = useReducedMotion()

  const item = destination.package
  const serviceLabel = !item
    ? 'Something else'
    : item.category === 'domestic'
      ? 'Domestic tour package'
      : 'International tour package'

  // Motion values for 3D tilt
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Spring physics for smooth fluid motion
  const mouseX = useSpring(x, { stiffness: 220, damping: 22 })
  const mouseY = useSpring(y, { stiffness: 220, damping: 22 })

  // 3D rotations based on mouse position inside the card
  const rotateX = useTransform(mouseY, [-0.5, 0.5], ['10deg', '-10deg'])
  const rotateY = useTransform(mouseX, [-0.5, 0.5], ['-10deg', '10deg'])

  const handleMouseEnter = () => {
    if (reduceMotion || !cardRef.current) return
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return
    rectRef.current = cardRef.current.getBoundingClientRect()
  }

  const handleMouseMove = (e) => {
    if (reduceMotion || !cardRef.current) return
    if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return
    if (!rectRef.current) {
      rectRef.current = cardRef.current.getBoundingClientRect()
    }
    const rect = rectRef.current
    if (!rect || rect.width === 0 || rect.height === 0) return
    const offsetX = (e.clientX - rect.left) / rect.width - 0.5
    const offsetY = (e.clientY - rect.top) / rect.height - 0.5
    x.set(offsetX)
    y.set(offsetY)
  }

  const handleMouseLeave = () => {
    rectRef.current = null
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className="perspective-[1200px] h-full"
    >
      <motion.article
        ref={cardRef}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          rotateX: reduceMotion ? 0 : rotateX,
          rotateY: reduceMotion ? 0 : rotateY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-ink/10 bg-white shadow-[0_15px_40px_-15px_rgba(15,23,42,0.12)] transition-shadow duration-500 hover:shadow-[0_28px_60px_-18px_rgba(15,23,42,0.22)]"
      >
        {/* --- Top Media Area with 3D Parallax Badges --- */}
        <div className="relative aspect-[16/11] w-full overflow-hidden bg-ink">
          <img
            src={destination.image}
            alt={destination.imageAlt}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          />

          {/* Gradients for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/60" />

          {/* Floating Top Floating Badges (TranslateZ for 3D depth) */}
          <div
            style={{ transform: 'translateZ(35px)' }}
            className="absolute inset-x-4 top-4 z-20 flex items-center justify-between gap-2"
          >
            {/* Region / Country pill */}
            <span className="inline-flex items-center gap-1.5 rounded-full bg-ink/75 px-3 py-1.5 text-xs font-semibold tracking-wide text-white backdrop-blur-md ring-1 ring-white/20">
              <span
                className="h-2 w-2 rounded-full animate-pulse bg-emerald-400"
                aria-hidden="true"
              />
              <MapPin size={13} className="text-white/80" aria-hidden="true" />
              {item?.region ?? 'Featured'}
            </span>

            {/* Category tag - sleek uniform frosted badge */}
            <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white backdrop-blur-md ring-1 ring-white/30 shadow-sm">
              {item?.category === 'domestic' ? 'Domestic' : 'International'}
            </span>
          </div>

          {/* Floating Destination Name over Image */}
          <div
            style={{ transform: 'translateZ(30px)' }}
            className="absolute inset-x-5 bottom-4 z-20"
          >
            <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-[0.2em] text-white/85">
              <Sparkles size={12} className="text-amber-300" aria-hidden="true" />
              <span>Must visit</span>
            </div>
            <h3 className="mt-1 font-display text-2xl font-bold tracking-tight text-white drop-shadow-md sm:text-[1.7rem]">
              {destination.name}
            </h3>
          </div>
        </div>

        {/* --- Card Body / Info Section --- */}
        <div
          style={{ transform: 'translateZ(25px)' }}
          className="relative z-10 flex flex-1 flex-col justify-between bg-white p-5 sm:p-6"
        >
          {/* Tagline / Teaser */}
          <p className="line-clamp-2 text-sm leading-relaxed text-slate">
            {destination.tagline}
          </p>

          {/* Package details strip */}
          {item ? (
            <div className="mt-4 rounded-2xl bg-paper-2/90 p-3.5 ring-1 ring-ink/5 backdrop-blur-sm transition-colors duration-300 group-hover:bg-paper-2">
              <p className="line-clamp-1 text-xs font-semibold text-ink">
                {item.title}
              </p>
              <div className="mt-2.5 flex items-center justify-between border-t border-ink/8 pt-2.5 text-xs text-slate">
                <span className="flex items-center gap-1.5 font-medium">
                  <CalendarDays size={14} className="text-blue-600" aria-hidden="true" />
                  {item.nights}N / {item.days}D
                </span>
                <span className="flex items-center gap-1.5 font-bold text-ink">
                  <Wallet size={14} className="text-blue-600" aria-hidden="true" />
                  from {formatPrice(item.price, item.currency)}
                </span>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl bg-paper-2/60 p-3.5 text-xs text-slate ring-1 ring-ink/5">
              Customized itinerary and prices available on request.
            </div>
          )}

          {/* Action buttons */}
          <div className="mt-5 flex items-center gap-2.5">
            <button
              type="button"
              onClick={() =>
                enquire({
                  service: serviceLabel,
                  destination: item?.title ?? destination.name,
                })
              }
              className="group/btn relative flex flex-1 items-center justify-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 px-4 py-2.5 text-xs font-semibold text-white shadow-[0_4px_14px_-2px_rgba(37,99,235,0.4)] transition-all duration-300 hover:from-blue-700 hover:via-indigo-700 hover:to-blue-800 hover:shadow-[0_6px_20px_-2px_rgba(37,99,235,0.5)] active:scale-[0.98]"
            >
              <span>Plan this trip</span>
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                aria-hidden="true"
              />
            </button>

            {item && (
              <Link
                to="/packages"
                className="inline-flex items-center justify-center rounded-xl border border-ink/15 bg-white px-3.5 py-2.5 text-xs font-semibold text-ink transition hover:border-ink/30 hover:bg-paper-2 active:scale-[0.98]"
              >
                See package
              </Link>
            )}
          </div>
        </div>
      </motion.article>
    </motion.div>
  )
}

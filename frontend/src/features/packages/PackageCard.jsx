import { memo } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, ChevronDown, FileImage, MapPin, MessageCircle } from 'lucide-react'
import SmartImage from '../../components/ui/SmartImage.jsx'
import Button from '../../components/ui/Button.jsx'
import { TiltGlare } from '../../components/ui/Tilt.jsx'
import { useTilt } from '../../hooks/useTilt.js'
import { formatPrice, getUpcomingDepartures, isOfferExpired } from '../../data/packages.js'
import { useEnquire } from '../inquiry/useEnquire.js'
import { useWhatsApp } from '../inquiry/whatsapp.js'

function PackageCard({ item, index }) {
  const enquire = useEnquire()
  const whatsApp = useWhatsApp()
  const serviceLabel = item.category === 'domestic' ? 'Domestic tour package' : 'International tour package'
  const upcoming = getUpcomingDepartures(item)
  const expired = isOfferExpired(item)
  const tilt = useTilt(6)

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 40, rotateX: 14 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.7, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={tilt.style}
      {...tilt.handlers}
      className="group relative flex flex-col overflow-hidden rounded-[22px] bg-white ring-1 ring-paper/10 transition-shadow duration-500 shadow-[0_20px_40px_-30px_rgb(15_23_42/0.25)] hover:shadow-[0_40px_70px_-35px_rgb(15_23_42/0.4)] hover:ring-paper/25"
    >
      <TiltGlare tilt={tilt} />
      <div className="relative aspect-[4/3] overflow-hidden">
        <SmartImage
          src={item.image}
          alt={item.imageAlt}
          label={item.region}
          className="h-full w-full"
          imgClassName="transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.06]"
        />
        {item.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-ink/75 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-paper backdrop-blur">
            {item.badge}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-ember-soft">
          <MapPin size={13} aria-hidden="true" />
          {item.region} · {item.category}
        </p>
        <h3 className="mt-3 text-2xl leading-tight text-paper">{item.title}</h3>
        <p className="mt-3 text-sm leading-6 text-mist">{item.description}</p>
        <p className="mt-4 text-xs leading-5 text-mist/80">{item.places.join(' · ')}</p>

        <details className="group/details mt-5 border-t border-paper/10 pt-4">
          <summary className="flex cursor-pointer list-none items-center justify-between text-sm font-semibold text-paper [&::-webkit-details-marker]:hidden">
            What's included
            <ChevronDown size={16} aria-hidden="true" className="transition-transform group-open/details:rotate-180" />
          </summary>
          <ul className="mt-3 space-y-1.5 text-sm leading-6 text-mist">
            {item.inclusions.map((inclusion) => (
              <li key={inclusion} className="flex gap-2">
                <span aria-hidden="true" className="text-ember-soft">
                  ·
                </span>
                {inclusion}
              </li>
            ))}
          </ul>
          {item.hotels.length > 0 && (
            <>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-paper/80">Hotels (or similar)</p>
              <ul className="mt-2 space-y-1 text-sm leading-6 text-mist">
                {item.hotels.map((hotel) => (
                  <li key={hotel}>{hotel}</li>
                ))}
              </ul>
            </>
          )}
        </details>

        <div className="mb-5 mt-auto flex flex-wrap items-end justify-between gap-x-4 gap-y-3 border-t border-paper/10 pt-5">
          <div className="min-w-[9rem] flex-1 text-sm text-mist">
            <p className="flex items-center gap-2">
              <CalendarDays size={15} aria-hidden="true" className="text-ember-soft" />
              {item.nights}N / {item.days}D
            </p>
            <p className="mt-1 text-xs">
              {upcoming.length > 0
                ? `Departs ${upcoming.join(', ')}`
                : expired
                  ? 'Published dates have passed. Ask for the next ones.'
                  : 'Dates on request'}
            </p>
          </div>
          <p className="ml-auto shrink-0 text-right">
            <span className="block text-[0.7rem] uppercase tracking-[0.14em] text-mist">From</span>
            <span className="font-display text-2xl text-paper">{formatPrice(item.price, item.currency)}</span>
            <span className="block text-[0.7rem] text-mist">{item.priceBasis}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="light" className="flex-1 basis-full min-[400px]:basis-0" onClick={() => enquire({ service: serviceLabel, destination: item.title })}>
            Enquire about this trip
          </Button>
          {item.flyer && (
            <a
              href={item.flyer}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View the official ${item.title} flyer (opens in a new tab)`}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-paper/20 text-paper transition hover:border-paper/60 hover:bg-paper/10"
            >
              <FileImage size={18} aria-hidden="true" />
            </a>
          )}
          <a
            href={whatsApp.quick(`the ${item.title} (${item.nights}N/${item.days}D)`)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Ask about ${item.title} on WhatsApp (opens in a new tab)`}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-paper/20 text-paper transition hover:border-whatsapp hover:bg-whatsapp"
          >
            <MessageCircle size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </motion.article>
  )
}

// Memoised: a card only re-renders when its own package changes.
export default memo(PackageCard)

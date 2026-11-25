import { ArrowUpRight, Clock, MapPin, Navigation } from 'lucide-react'
import { useBusiness } from '../../features/site/useSite.js'

// The office on a Google map, with the address, hours and a Directions link
// in a card over it.
function OfficeMap({ className = '' }) {
  const business = useBusiness()
  const address = business.addressLines.join(', ')

  return (
    <div
      className={`relative overflow-hidden rounded-[24px] bg-paper-2 shadow-[0_24px_50px_-34px_rgb(15_23_42/0.55)] ring-1 ring-ink/10 ${className}`}
    >
      <iframe
        title={`Map showing ${business.legalName}, ${address}`}
        src={business.mapEmbedUrl}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="block h-72 w-full border-0 sm:h-80"
      />
      <div className="m-3 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-ink/10 sm:absolute sm:bottom-0 sm:left-0 sm:right-0 sm:flex sm:items-end sm:justify-between sm:gap-4">
        <address className="flex gap-3 text-sm not-italic leading-6 text-ink">
          <MapPin size={18} aria-hidden="true" className="mt-0.5 shrink-0 text-ember" />
          <span>
            <span className="block font-semibold">{business.legalName}</span>
            {address}
            <span className="mt-1 flex items-center gap-1.5 text-xs text-slate">
              <Clock size={13} aria-hidden="true" />
              {business.hours}
            </span>
          </span>
        </address>
        <a
          href={business.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group/dir mt-3 inline-flex shrink-0 items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky sm:mt-0"
        >
          <Navigation size={15} aria-hidden="true" />
          Directions
          <ArrowUpRight size={15} aria-hidden="true" className="transition-transform group-hover/dir:rotate-45" />
        </a>
      </div>
    </div>
  )
}

export default OfficeMap

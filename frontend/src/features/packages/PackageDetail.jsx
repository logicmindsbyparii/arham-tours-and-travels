import { BedDouble, CalendarDays, Check, FileImage, MapPin, MessageCircle, Plane, Sparkles, X } from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import SmartImage from '../../components/ui/SmartImage.jsx'
import { formatDate, formatPrice, getUpcomingDepartures, isOfferExpired } from '../../data/packages.js'
import { CATEGORY_TONES } from '../../data/accents.js'
import { useEnquire } from '../inquiry/useEnquire.js'
import { useWhatsApp } from '../inquiry/whatsapp.js'

// The trip as a line of stops.
function RouteLine({ item, tone }) {
  const stops = item.places

  return (
    <ol aria-label="Route" className="relative mt-6 flex flex-wrap gap-x-1 gap-y-3">
      {stops.map((stop, index) => {
        return (
          <li key={`${stop}-${index}`} className="flex items-center gap-1 text-sm">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 font-medium ${
                index === 0 ? 'bg-ember text-white' : `${tone.soft} text-ink`
              }`}
            >
              {index === 0 && <Plane size={13} aria-hidden="true" />}
              {stop}
            </span>
            {index < stops.length - 1 && (
              <span aria-hidden="true" className="h-px w-4 border-t border-dashed border-slate/50" />
            )}
          </li>
        )
      })}
    </ol>
  )
}

const paragraphs = (text) =>
  text
    .split(/\n\s*\n/)
    .map((part) => part.trim())
    .filter(Boolean)

// Day-by-day plan, shown when the package has one.
function Itinerary({ days, tone }) {
  return (
    <div className="mt-8 border-t border-ink/10 pt-7">
      <h3 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-ink">Day by day</h3>
      <ol className="mt-4 space-y-4">
        {days.map((day) => (
          <li key={`${day.day}-${day.title}`} className="flex gap-4">
            <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${tone.solid}`}>
              {day.day}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-ink">{day.title}</p>
              {day.description && <p className="mt-1 text-sm leading-6 text-slate">{day.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

// Everything about one package, shown in the package popup (PackageDialog).
// onBeforeEnquire runs first, e.g. to close the popup before the page scrolls
// to the enquiry form.
function PackageDetail({ item, titleId, onBeforeEnquire }) {
  const enquire = useEnquire()
  const whatsApp = useWhatsApp()
  const tone = CATEGORY_TONES[item.category] ?? CATEGORY_TONES.international
  const upcoming = getUpcomingDepartures(item)
  const expired = isOfferExpired(item)
  const serviceLabel = item.category === 'domestic' ? 'Domestic tour package' : 'International tour package'

  return (
    <div className="theme-base grid bg-white lg:grid-cols-[1fr_1.15fr]">
      {/* Photo, kept in view on large screens while the details scroll */}
      <div className="relative p-3 sm:p-4 lg:sticky lg:top-0 lg:self-start">
        <div className="relative overflow-hidden rounded-[20px]">
          <SmartImage
            src={item.image}
            alt={item.imageAlt}
            label={item.region}
            className="aspect-[4/3] w-full lg:aspect-[4/5]"
          />
          {item.badge && (
            <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3.5 py-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-ink backdrop-blur">
              {item.badge}
            </span>
          )}
          <span className="absolute bottom-4 left-4 font-hand text-3xl text-white [text-shadow:0_2px_6px_rgb(15_23_42/0.6)]">
            {item.nights} nights in {item.region}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col p-6 pt-3 sm:p-9 lg:p-10">
        <p className={`flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] ${tone.text}`}>
          <MapPin size={14} aria-hidden="true" />
          {item.region} · {item.category}
        </p>
        <h2 id={titleId} className="mt-3 pr-10 text-[clamp(2rem,3.4vw,2.7rem)] leading-[1.05] text-ink">
          {item.title}
        </h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-slate">{item.description}</p>
        {paragraphs(item.fullDescription ?? '').map((text) => (
          <p key={text} className="mt-3 max-w-xl text-sm leading-7 text-slate">
            {text}
          </p>
        ))}

        {item.places.length > 0 && <RouteLine item={item} tone={tone} />}

        {item.highlights?.length > 0 && (
          <ul aria-label="Highlights" className="mt-6 flex flex-wrap gap-2">
            {item.highlights.map((highlight) => (
              <li key={highlight} className="inline-flex items-center gap-1.5 rounded-lg bg-paper-2 px-3 py-1.5 text-sm text-ink">
                <Sparkles size={14} aria-hidden="true" className={tone.text} />
                {highlight}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 grid gap-8 border-t border-ink/10 pt-7 md:grid-cols-[1.4fr_1fr]">
          <div>
            <h3 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-ink">What's included</h3>
            <ul className="mt-4 space-y-2.5 text-sm leading-6 text-ink/85">
              {item.inclusions.map((inclusion) => (
                <li key={inclusion} className="flex gap-2.5">
                  <Check size={16} aria-hidden="true" className={`mt-1 shrink-0 ${tone.text}`} />
                  {inclusion}
                </li>
              ))}
            </ul>
            {item.exclusions?.length > 0 && (
              <>
                <h3 className="mt-7 font-sans text-xs font-bold uppercase tracking-[0.18em] text-ink">Not included</h3>
                <ul className="mt-4 space-y-2.5 text-sm leading-6 text-slate">
                  {item.exclusions.map((exclusion) => (
                    <li key={exclusion} className="flex gap-2.5">
                      <X size={16} aria-hidden="true" className="mt-1 shrink-0 text-slate" />
                      {exclusion}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="space-y-7">
            {item.hotels.length > 0 && (
              <div>
                <h3 className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.18em] text-ink">
                  <BedDouble size={15} aria-hidden="true" className={tone.text} />
                  Hotels <span className="font-medium normal-case tracking-normal text-slate">(or similar)</span>
                </h3>
                <ul className="mt-4 space-y-2 text-sm leading-6 text-slate">
                  {item.hotels.map((hotel) => (
                    <li key={hotel} className="border-l-2 border-ink/10 pl-3">
                      {hotel}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.18em] text-ink">
                <CalendarDays size={15} aria-hidden="true" className={tone.text} />
                {item.validUntil ? 'Offer' : 'Departures'}
              </h3>
              {upcoming.length > 0 ? (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {upcoming.map((date) => (
                    <li key={date} className="rounded-lg bg-paper-2 px-3 py-1.5 text-sm font-medium text-ink">
                      {date}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-6 text-slate">
                  {item.validUntil && !expired
                    ? `Valid till ${formatDate(item.validUntil)}.`
                    : expired
                      ? 'The published dates have passed. Ask us for the next ones.'
                      : 'Dates on request.'}
                </p>
              )}
            </div>
          </div>
        </div>

        {item.itinerary?.length > 0 && <Itinerary days={item.itinerary} tone={tone} />}

        {item.gallery?.length > 0 && (
          <div className="mt-8 border-t border-ink/10 pt-7">
            <h3 className="font-sans text-xs font-bold uppercase tracking-[0.18em] text-ink">Photos</h3>
            <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {item.gallery.map((photo) => (
                <li key={photo.src}>
                  <SmartImage src={photo.src} alt={photo.alt} className="aspect-[4/3] w-full rounded-xl" />
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-9 flex flex-col gap-6 rounded-2xl bg-paper-2 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <p>
            <span className="block text-xs font-semibold uppercase tracking-[0.16em] text-slate">
              {item.nights}N / {item.days}D · from
            </span>
            <span className="font-display text-4xl leading-tight text-ink">{formatPrice(item.price, item.currency)}</span>
            <span className="block text-xs text-slate">{item.priceBasis}</span>
          </p>
          <div className="flex shrink-0 gap-2">
            <Button
              onClick={() => {
                onBeforeEnquire?.()
                enquire({ service: serviceLabel, destination: item.title })
              }}
            >
              Enquire now
            </Button>
            <a
              href={whatsApp.quick(`the ${item.title} (${item.nights}N/${item.days}D)`)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ask about ${item.title} on WhatsApp (opens in a new tab)`}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-whatsapp text-white transition hover:-translate-y-0.5 hover:brightness-110"
            >
              <MessageCircle size={19} aria-hidden="true" />
            </a>
            {item.flyer && (
              <a
                href={item.flyer}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View the official ${item.title} flyer (opens in a new tab)`}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-ink ring-1 ring-ink/15 transition hover:-translate-y-0.5 hover:bg-sky hover:text-white hover:ring-sky"
              >
                <FileImage size={18} aria-hidden="true" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PackageDetail

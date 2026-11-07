import { memo, useCallback, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { MessageCircle, Sparkles } from 'lucide-react'
import { TRIP_TYPES } from '../../data/carRental.js'
import Select from '../../components/ui/Select.jsx'
import DatePicker from '../../components/ui/DatePicker.jsx'
import { useEnquire } from '../inquiry/useEnquire.js'
import { useWhatsApp } from '../inquiry/whatsapp.js'

const EASE = [0.16, 1, 0.3, 1]

// Placeholder for the drop-off field, per trip type.
const DROP_HINTS = {
  'Airport transfer': 'e.g. Surat airport',
  'Local sightseeing': 'e.g. back to pick-up',
  'Outstation trip': 'e.g. Mumbai, Goa, Udaipur',
  'Group travel': 'e.g. event venue',
}

const TRAVELLER_OPTIONS = ['1–3', '4–6', '7–12', '13+']

const SUGGESTED_VEHICLES = {
  '1–3': {
    cars: 'Sedan (Dzire / Etios) or Ertiga SUV',
    note: 'Best for couples & small families (up to 4 seats)',
  },
  '4–6': {
    cars: 'Maruti Ertiga or Toyota Innova',
    note: 'Spacious 6–7 seater SUVs with comfortable legroom',
  },
  '7–12': {
    cars: 'Toyota Innova Crysta, Tata Winger or 12S Tempo Traveller',
    note: 'Ideal for extended family & wedding groups',
  },
  '13+': {
    cars: '17S/20S/26S Tempo Traveller or Luxury Bus (32–56 seater)',
    note: 'Heavy passenger group tours & corporate travel',
  },
}

const todayIso = () => new Date().toLocaleDateString('en-CA')

// One field of the quote panel: small capitals label over a soft control.
function Field({ id, label, children }) {
  return (
    <div className="flex min-w-0 flex-col">
      <label htmlFor={id} className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-slate">
        {label}
      </label>
      {children}
    </div>
  )
}

const controlClass =
  'mt-2 h-12 w-full min-w-0 rounded-xl bg-paper-2 px-3.5 text-sm text-ink ring-1 ring-ink/10 transition-[box-shadow,background-color] placeholder:text-slate/70 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky'

// The car rental quote panel, below the banner. The trip type and the route
// (pick-up and drop) are shared with the banner, so whatever was entered there
// is already filled in here; date and travellers are kept in this panel.
function CarQuoteForm({ tripType, onTripTypeChange, route, onRouteChange }) {
  const enquire = useEnquire()
  const whatsApp = useWhatsApp()
  const [form, setForm] = useState({ date: '', travellers: TRAVELLER_OPTIONS[0] })
  const minDate = useMemo(() => todayIso(), [])

  const update = useCallback((event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }, [])

  const updateRoute = (event) => {
    const { name, value } = event.target
    onRouteChange({ ...route, [name]: value })
  }

  const currentSuggestion = SUGGESTED_VEHICLES[form.travellers]

  const lines = [
    `Trip: ${tripType}`,
    route.pickup.trim() && `Pick-up: ${route.pickup.trim()}`,
    route.drop.trim() && `Drop: ${route.drop.trim()}`,
    form.date && `Date: ${form.date}`,
    `Travellers: ${form.travellers}`,
    currentSuggestion?.cars && `Suggested vehicle: ${currentSuggestion.cars}`,
  ].filter(Boolean)

  const whatsAppUrl = whatsApp.build(['Hi, I would like a car rental quote.', '', ...lines].join('\n'))

  return (
    <motion.div
      id="car-quote"
      initial={{ opacity: 0, y: 70, rotateX: 22 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 1.1, delay: 0.45, ease: EASE }}
      style={{ transformPerspective: 1400 }}
      className="origin-bottom rounded-[22px] bg-white p-6 text-ink shadow-[0_40px_80px_-45px_rgb(15_23_42/0.45)] ring-1 ring-ink/10 sm:rounded-[28px] sm:p-9 lg:px-12 lg:py-10"
    >
      <h2 className="font-sans text-2xl font-bold tracking-[-0.02em] sm:text-[1.9rem]">Looking for a car and driver?</h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate sm:text-base sm:leading-7">
        Tell us the kind of trip, the route and the date. We will suggest a suitable vehicle and send your quote on
        WhatsApp.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          window.open(whatsAppUrl, '_blank', 'noopener,noreferrer')
        }}
        className="mt-7 grid gap-x-5 gap-y-5 sm:grid-cols-2 lg:grid-cols-3 lg:items-end xl:grid-cols-[1.3fr_1.1fr_1.1fr_1fr_0.8fr_auto] xl:gap-x-4"
      >
        <Field id="car-trip" label="Type of trip">
          <Select
            id="car-trip"
            value={tripType}
            onChange={(event) => onTripTypeChange(event.target.value)}
            options={TRIP_TYPES.map((type) => type.label)}
            className={controlClass}
          />
        </Field>
        <Field id="car-pickup" label="Pick-up">
          <input
            id="car-pickup"
            name="pickup"
            value={route.pickup}
            onChange={updateRoute}
            placeholder="e.g. Adajan, Surat"
            maxLength={80}
            autoComplete="street-address"
            className={controlClass}
          />
        </Field>
        <Field id="car-drop" label="Drop">
          <input
            id="car-drop"
            name="drop"
            value={route.drop}
            onChange={updateRoute}
            placeholder={DROP_HINTS[tripType]}
            maxLength={80}
            className={controlClass}
          />
        </Field>
        <Field id="car-date" label="Date">
          <DatePicker id="car-date" name="date" min={minDate} value={form.date} onChange={update} className={controlClass} />
        </Field>
        <Field id="car-travellers" label="Travellers">
          <Select
            id="car-travellers"
            name="travellers"
            value={form.travellers}
            onChange={update}
            options={TRAVELLER_OPTIONS}
            className={controlClass}
          />
        </Field>
        <button
          type="submit"
          className="group inline-flex h-12 items-center justify-center gap-2.5 whitespace-nowrap rounded-lg bg-leaf px-6 text-sm font-semibold text-white shadow-[0_16px_32px_-14px_rgb(21_128_61/0.9)] transition-[background-color,transform] hover:bg-leaf-deep active:scale-[0.98] sm:col-span-2 lg:col-span-1"
        >
          <MessageCircle size={17} aria-hidden="true" />
          Get quote
        </button>
      </form>

      {/* Recommended car options based on selected passengers */}
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-sky/5 p-3.5 ring-1 ring-sky/20">
        <div className="flex items-center gap-2.5 text-xs text-slate">
          <Sparkles size={16} className="shrink-0 text-amber-500" aria-hidden="true" />
          <span>
            Recommended for <strong className="font-semibold text-ink">{form.travellers} travellers:</strong>{' '}
            <strong className="font-bold text-sky-deep">{currentSuggestion?.cars}</strong>
            <span className="hidden md:inline text-slate"> — {currentSuggestion?.note}</span>
          </span>
        </div>
        <a
          href="#car-passenger-finder"
          className="text-xs font-bold text-sky-deep hover:text-ink underline-offset-4 hover:underline"
        >
          Compare vehicle sizes &amp; rates &darr;
        </a>
      </div>

      <button
        type="button"
        onClick={() => enquire({ service: 'Car rental', destination: `${tripType} (${form.travellers} travellers - ${currentSuggestion?.cars})` })}
        className="mt-5 text-sm font-medium text-sky-deep underline-offset-4 transition-colors hover:text-ink hover:underline"
      >
        Prefer the full enquiry form? Add these details to it
      </button>
    </motion.div>
  )
}

export default memo(CarQuoteForm)

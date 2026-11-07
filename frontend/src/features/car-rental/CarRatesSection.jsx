import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Car,
  Bus,
  Clock,
  Route,
  MessageCircle,
  Phone,
  FileText,
  Info,
  CheckCircle2,
  Sparkles,
} from 'lucide-react'
import Container from '../../components/ui/Container.jsx'
import SectionHeading from '../../components/ui/SectionHeading.jsx'
import Tabs from '../../components/ui/Tabs.jsx'
import PassengerCarSelector from './PassengerCarSelector.jsx'
import {
  CAR_COLUMNS,
  OUTSTATION_FIXED_FARES,
  SURAT_LOCAL_DUTY,
  EXTRA_CHARGES,
  TERMS_AND_CONDITIONS,
  TEMPO_BUS_VEHICLES,
  TEMPO_BUS_FIXED_ROUTES,
} from '../../data/carRates.js'
import { formatPrice } from '../../data/packages.js'
import { useWhatsApp } from '../inquiry/whatsapp.js'
import { useEnquire } from '../inquiry/useEnquire.js'
import { useBusiness, useSite } from '../site/useSite.js'

const RATE_TABS = [
  { id: 'cars', label: 'Cars & SUVs (Sedan, Ertiga, Innova)' },
  { id: 'buses', label: 'Tempo Traveller, Winger & Bus' },
]

export default function CarRatesSection() {
  const [activeTab, setActiveTab] = useState('cars')
  const [highlightCarId, setHighlightCarId] = useState(null)
  const { carRental } = useSite()
  const whatsApp = useWhatsApp()
  const enquire = useEnquire()
  const business = useBusiness()
  const primaryPhone = business?.phones?.[0]

  const columns = carRental?.carColumns?.length ? carRental.carColumns : CAR_COLUMNS
  const outstationFares = carRental?.outstationFixedFares?.length ? carRental.outstationFixedFares : OUTSTATION_FIXED_FARES
  const localDuty = carRental?.localDuty?.length ? carRental.localDuty : SURAT_LOCAL_DUTY
  const extraCharges = carRental?.extraCharges?.length ? carRental.extraCharges : EXTRA_CHARGES
  const terms = carRental?.termsAndConditions?.length ? carRental.termsAndConditions : TERMS_AND_CONDITIONS
  const tempoVehicles = carRental?.tempoBusVehicles?.length ? carRental.tempoBusVehicles : TEMPO_BUS_VEHICLES
  const tempoRoutes = carRental?.tempoBusFixedRoutes?.length ? carRental.tempoBusFixedRoutes : TEMPO_BUS_FIXED_ROUTES
  const noteText = carRental?.note || 'GST 5% extra on total bill amount. Toll tax, parking & border tax extra as applicable.'

  const handleBook = (routeOrPackage, vehicle, price) => {
    enquire({
      service: 'Car rental',
      destination: `${routeOrPackage} - ${vehicle} (${typeof price === 'number' ? formatPrice(price, 'INR') : price})`,
    })
  }

  const getWaLink = (routeOrPackage, vehicle, price) => {
    const priceText = typeof price === 'number' ? `₹${price.toLocaleString('en-IN')}` : price
    const text = `Hello, I would like to book a car rental with Arham Tours:\n• Service/Route: ${routeOrPackage}\n• Vehicle: ${vehicle}\n• Rate: ${priceText}\nPlease confirm availability and details.`
    return whatsApp.build(text)
  }

  return (
    <section id="car-rates" aria-labelledby="car-rates-title" className="bg-paper py-20 text-ink sm:py-28">
      <Container>
        {/* Section Heading */}
        <SectionHeading
          id="car-rates-title"
          tone="dark"
          eyebrow="Transparent pricing"
          accentTone="green"
          title="Car rental rates &"
          accent="fixed fares."
          intro="Fixed outstation fares from Surat, local hourly duty packages, and extra km charges with no hidden surprises."
        />

        {/* Global GST & Toll Note Pill */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-sky/5 p-4 ring-1 ring-sky/20 sm:mt-10">
          <div className="flex items-center gap-2.5 text-xs font-medium text-slate sm:text-sm">
            <Info size={17} className="shrink-0 text-sky-deep" aria-hidden="true" />
            <span>
              <strong className="font-semibold text-ink">Important Note:</strong> {noteText}
            </span>
          </div>
          {primaryPhone && (
            <a
              href={primaryPhone.href}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-ink shadow-sm ring-1 ring-ink/10 transition hover:bg-paper-2"
            >
              <Phone size={13} className="text-leaf-deep" aria-hidden="true" />
              <span>Call: {primaryPhone.label}</span>
            </a>
          )}
        </div>

        {/* Interactive Passenger Capacity Matcher ("How many people?") */}
        <div className="mt-10 sm:mt-12">
          <PassengerCarSelector
            onSelectCar={(id) => setHighlightCarId(id)}
            onSwitchTab={(tab) => setActiveTab(tab)}
          />
        </div>

        {/* Category Tabs: Cars & SUVs vs Tempo Traveller & Bus */}
        <div id="car-rates-table" className="mt-12 scroll-mt-24 sm:mt-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Tabs
              tabs={RATE_TABS}
              activeId={activeTab}
              onChange={setActiveTab}
              label="Car rental rate categories"
              idPrefix="car-rate-category"
              tone="dark"
              className="inline-flex max-w-full rounded-full bg-paper-2 p-1.5 ring-1 ring-ink/10"
            />
            {highlightCarId && (
              <button
                type="button"
                onClick={() => setHighlightCarId(null)}
                className="text-xs font-bold text-sky-deep hover:text-ink underline-offset-4 hover:underline"
              >
                Clear highlighted selection &times;
              </button>
            )}
          </div>
        </div>

        {/* TAB 1: CARS & SUVS */}
        {activeTab === 'cars' && (
          <motion.div
            key="cars-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-12 space-y-16 sm:mt-14 sm:space-y-20"
          >
            {/* --- SECTION A: OUTSTATION FIXED FARES --- */}
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-deep">
                    <Route size={15} aria-hidden="true" />
                    <span>Fixed Route Fares</span>
                  </div>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                    Outstation Fixed Fares
                  </h3>
                  <p className="mt-1 text-sm text-slate">
                    One-way fixed rates between Surat and major transit airports &amp; cities.
                  </p>
                </div>
                <span className="self-start rounded-full bg-leaf/10 px-3 py-1 text-xs font-semibold text-leaf-deep sm:self-auto">
                  One-way guaranteed fares
                </span>
              </div>

              {/* Desktop Table View */}
              <div className="mt-6 hidden overflow-hidden rounded-[24px] border border-ink/10 bg-white shadow-sm md:block">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 border-b border-ink/10 bg-paper-2 text-xs font-bold uppercase tracking-wider text-ink">
                      <tr>
                        <th scope="col" className="px-6 py-4">
                          Route
                        </th>
                        {columns.map((car) => {
                          const isSelected = highlightCarId === car.id
                          return (
                            <th
                              key={car.id}
                              scope="col"
                              className={`px-4 py-4 text-center transition-colors ${
                                isSelected ? 'bg-sky-deep text-white' : ''
                              }`}
                            >
                              <span className={`block font-bold ${isSelected ? 'text-white' : 'text-ink'}`}>{car.name}</span>
                              <span className={`block text-[11px] font-normal normal-case ${isSelected ? 'text-sky-100' : 'text-slate'}`}>
                                {car.subtitle}
                              </span>
                              {isSelected && (
                                <span className="mt-1 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                                  Selected
                                </span>
                              )}
                            </th>
                          )
                        })}
                        <th scope="col" className="px-6 py-4 text-right">
                          Instant Book
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5 text-sm text-ink">
                      {outstationFares.map((item) => (
                        <tr key={item.id || item.route} className="transition-colors hover:bg-sky/5">
                          <td className="px-6 py-4 font-semibold text-ink">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-sky" aria-hidden="true" />
                              <span>{item.route}</span>
                            </div>
                          </td>
                          {columns.map((car) => {
                            const fare = item.prices?.[car.id]
                            const isSelected = highlightCarId === car.id
                            return (
                              <td
                                key={car.id}
                                className={`px-4 py-4 text-center font-semibold transition-colors ${
                                  isSelected ? 'bg-sky/10 border-x border-sky-deep/30' : ''
                                }`}
                              >
                                <span className={`block text-base font-bold ${isSelected ? 'text-sky-deep' : 'text-ink'}`}>
                                  {typeof fare === 'number' ? formatPrice(fare, 'INR') : (fare || '—')}
                                </span>
                                <span className="block text-[10px] uppercase tracking-wider text-slate">
                                  {car.capacity}
                                </span>
                              </td>
                            )
                          })}
                          <td className="px-6 py-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  const carId = highlightCarId || 'sedan'
                                  const carName = columns.find((c) => c.id === carId)?.name || 'Sedan'
                                  handleBook(item.route, carName, item.prices?.[carId])
                                }}
                                className="rounded-xl border border-ink/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-ink/30 hover:bg-paper-2"
                              >
                                Book
                              </button>
                              <a
                                href={getWaLink(
                                  item.route,
                                  highlightCarId ? (columns.find((c) => c.id === highlightCarId)?.name || 'Any Car') : 'Any Car',
                                  highlightCarId ? item.prices?.[highlightCarId] : item.prices?.sedan
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Book ${item.route} on WhatsApp`}
                                className="inline-flex items-center gap-1 rounded-xl bg-whatsapp px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-110"
                              >
                                <MessageCircle size={13} aria-hidden="true" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card View (Easy tapping on phones) */}
              <div className="mt-6 space-y-4 md:hidden">
                {outstationFares.map((item) => (
                  <div
                    key={item.id || item.route}
                    className="rounded-[20px] border border-ink/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center justify-between border-b border-ink/8 pb-3">
                      <div className="flex items-center gap-2 font-bold text-ink">
                        <span className="h-2 w-2 rounded-full bg-sky" aria-hidden="true" />
                        <span>{item.route}</span>
                      </div>
                      <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-[11px] font-semibold text-slate">
                        One-way
                      </span>
                    </div>

                    <div className="mt-3.5 grid grid-cols-2 gap-2.5 text-xs sm:grid-cols-4">
                      {columns.map((car) => {
                        const isSelected = highlightCarId === car.id
                        return (
                          <div
                            key={car.id}
                            className={`flex flex-col justify-between rounded-xl p-2.5 transition-all ${
                              isSelected
                                ? 'bg-sky/15 ring-2 ring-sky-deep font-bold scale-[1.02] shadow-sm'
                                : 'bg-paper-2/70 ring-1 ring-ink/5'
                            }`}
                          >
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="block font-semibold text-ink">{car.name}</span>
                                {isSelected && (
                                  <span className="rounded-full bg-sky-deep px-1.5 py-0.2 text-[8px] font-bold text-white uppercase">
                                    Match
                                  </span>
                                )}
                              </div>
                              <span className="block text-[10px] text-slate">{car.subtitle}</span>
                            </div>
                            <span className="mt-2 block text-sm font-bold text-sky-deep">
                              {typeof item.prices?.[car.id] === 'number'
                                ? formatPrice(item.prices[car.id], 'INR')
                                : (item.prices?.[car.id] || '—')}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    <div className="mt-4 flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          const carId = highlightCarId || 'sedan'
                          const carName = columns.find((c) => c.id === carId)?.name || 'Sedan'
                          handleBook(item.route, carName, item.prices?.[carId])
                        }}
                        className="flex-1 rounded-xl border border-ink/15 bg-white py-2 text-xs font-semibold text-ink shadow-sm transition active:scale-[0.98]"
                      >
                        Enquire
                      </button>
                      <a
                        href={getWaLink(
                          item.route,
                          highlightCarId ? (columns.find((c) => c.id === highlightCarId)?.name || 'Car Rental') : 'Car Rental',
                          highlightCarId ? item.prices?.[highlightCarId] : item.prices?.sedan
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-whatsapp py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-110 active:scale-[0.98]"
                      >
                        <MessageCircle size={14} aria-hidden="true" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- SECTION B: SURAT LOCAL DUTY --- */}
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-leaf-deep">
                    <Clock size={15} aria-hidden="true" />
                    <span>City Sightseeing &amp; Business</span>
                  </div>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                    Surat Local Duty
                  </h3>
                  <p className="mt-1 text-sm text-slate">
                    Hourly and kilometer packages for travel within Surat city and industrial areas.
                  </p>
                </div>
                <span className="self-start rounded-full bg-paper-2 px-3 py-1 text-xs font-semibold text-slate sm:self-auto">
                  Includes driver &amp; fuel
                </span>
              </div>

              {/* Local Duty Cards Grid */}
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {localDuty.map((duty) => (
                  <div
                    key={duty.id || duty.package}
                    className="relative flex flex-col justify-between overflow-hidden rounded-[24px] border border-ink/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-leaf/10 px-3 py-1 text-xs font-bold text-leaf-deep">
                          <Sparkles size={13} aria-hidden="true" />
                          {duty.tag}
                        </span>
                        <span className="text-xs font-medium text-slate">
                          {duty.duration} • {duty.distance}
                        </span>
                      </div>
                      <h4 className="mt-3 text-2xl font-bold text-ink">{duty.package}</h4>
                      <p className="mt-1 text-xs text-slate">
                        Ideal for shopping, business meetings, family functions and local sightseeing.
                      </p>

                      {/* Prices by vehicle */}
                      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {columns.map((car) => {
                          const p = duty.prices?.[car.id]
                          const isSelected = highlightCarId === car.id
                          return (
                            <div
                              key={car.id}
                              className={`rounded-xl p-3 text-center transition-all ${
                                isSelected
                                  ? 'bg-sky/15 ring-2 ring-sky-deep font-bold scale-[1.02] shadow-sm'
                                  : 'bg-paper-2 ring-1 ring-ink/5'
                              }`}
                            >
                              <div className="flex items-center justify-center gap-1">
                                <span className="block text-[11px] font-semibold text-slate">{car.name}</span>
                                {isSelected && (
                                  <span className="rounded-full bg-sky-deep px-1 py-0.2 text-[7px] font-bold text-white uppercase">
                                    Match
                                  </span>
                                )}
                              </div>
                              <span className={`mt-1 block text-base font-bold ${isSelected ? 'text-sky-deep' : 'text-ink'}`}>
                                {typeof p === 'number' ? formatPrice(p, 'INR') : (p || '—')}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="mt-6 flex items-center gap-3 border-t border-ink/8 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          const carId = highlightCarId || 'sedan'
                          const carName = columns.find((c) => c.id === carId)?.name || 'Local Duty'
                          handleBook(duty.package, carName, duty.prices?.[carId])
                        }}
                        className="flex-1 rounded-xl border border-ink/15 bg-white py-2.5 text-xs font-semibold text-ink shadow-sm transition hover:bg-paper-2"
                      >
                        Book package
                      </button>
                      <a
                        href={getWaLink(
                          `Surat Local ${duty.package}`,
                          highlightCarId ? (columns.find((c) => c.id === highlightCarId)?.name || 'Local Duty') : 'Local Duty',
                          highlightCarId ? duty.prices?.[highlightCarId] : duty.prices?.sedan
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-whatsapp py-2.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-110"
                      >
                        <MessageCircle size={14} aria-hidden="true" />
                        <span>WhatsApp book</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* --- SECTION C: EXTRA CHARGES --- */}
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-ember-deep">
                <Car size={15} aria-hidden="true" />
                <span>Per KM &amp; Overtime</span>
              </div>
              <h3 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                Extra Charges
              </h3>
              <p className="mt-1 text-sm text-slate">
                Transparent per-kilometer and extra-hour rates when your trip exceeds standard duty.
              </p>

              {/* Extra charges table */}
              <div className="mt-6 overflow-hidden rounded-[24px] border border-ink/10 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="border-b border-ink/10 bg-paper-2 text-xs font-bold uppercase tracking-wider text-ink">
                      <tr>
                        <th scope="col" className="px-6 py-4">
                          Vehicle Category
                        </th>
                        <th scope="col" className="px-6 py-4 text-center">
                          Extra Hours Rate
                        </th>
                        <th scope="col" className="px-6 py-4 text-center">
                          Extra Kms Rate
                        </th>
                        <th scope="col" className="px-6 py-4 text-center">
                          Outstation Rent (per km)
                        </th>
                        <th scope="col" className="px-6 py-4 text-right">
                          Enquire
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-ink/5 text-sm">
                      {extraCharges.map((item) => {
                        const isSelected = highlightCarId === item.id
                        return (
                          <tr
                            key={item.id || item.vehicle}
                            className={`transition-colors ${
                              isSelected ? 'bg-sky/10 font-bold border-l-4 border-sky-deep' : 'hover:bg-sky/5'
                            }`}
                          >
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div>
                                  <span className="block font-bold text-ink">{item.vehicle}</span>
                                  <span className="block text-xs text-slate">{item.subtitle}</span>
                                </div>
                                {isSelected && (
                                  <span className="rounded-full bg-sky-deep px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                                    Selected
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center font-semibold text-ink">
                              ₹{item.extraHr} / hr
                            </td>
                            <td className="px-6 py-4 text-center font-semibold text-ink">
                              ₹{item.extraKm} / km
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="inline-block rounded-full bg-leaf/10 px-3 py-1 font-bold text-leaf-deep">
                                ₹{item.outstationPerKm} / km
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                type="button"
                                onClick={() => handleBook(`Outstation Per Km`, item.vehicle, `₹${item.outstationPerKm}/km`)}
                                className="rounded-xl border border-ink/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink transition hover:border-ink/30 hover:bg-paper-2"
                              >
                                Get quote
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* --- SECTION D: TERMS & CONDITIONS --- */}
            <div className="rounded-[28px] border border-ink/10 bg-paper-2/70 p-7 sm:p-9">
              <div className="flex items-center gap-2.5">
                <FileText size={20} className="text-sky-deep" aria-hidden="true" />
                <h4 className="text-xl font-bold text-ink">Terms &amp; Conditions</h4>
              </div>
              <ul className="mt-5 space-y-3">
                {terms.map((term, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm leading-6 text-slate">
                    <CheckCircle2
                      size={18}
                      className="mt-0.5 shrink-0 text-leaf-deep"
                      aria-hidden="true"
                    />
                    <span>{term}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}

        {/* TAB 2: TEMPO TRAVELLER, WINGER & BUS */}
        {activeTab === 'buses' && (
          <motion.div
            key="buses-tab"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-12 space-y-16 sm:mt-14 sm:space-y-20"
          >
            <div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-deep">
                    <Bus size={15} aria-hidden="true" />
                    <span>Large Group &amp; Bus Travel</span>
                  </div>
                  <h3 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
                    Tempo Traveller, Winger &amp; Bus
                  </h3>
                  <p className="mt-1 text-sm text-slate">
                    Premium pushback AC tempo travellers, Winger vans and luxury sleeper/seater buses for wedding parties, pilgrim tours and family groups.
                  </p>
                </div>
                <span className="self-start rounded-full bg-sky/10 px-3 py-1 text-xs font-semibold text-sky-deep sm:self-auto">
                  Custom itineraries welcome
                </span>
              </div>

              {/* Alert notice for customized fleet rates */}
              <div className="mt-6 rounded-2xl border border-sky/20 bg-sky/5 p-4 text-sm text-slate">
                <div className="flex items-start gap-2.5">
                  <Info size={18} className="mt-0.5 shrink-0 text-sky-deep" aria-hidden="true" />
                  <div>
                    <p className="font-semibold text-ink">
                      Customized Quotes for Tempo Traveller &amp; Buses
                    </p>
                    <p className="mt-0.5 text-xs text-slate sm:text-sm">
                      Bus and Tempo rates depend on total days, route terrain, passenger capacity (12, 17, 20, 26, 35, 56 seater) and AC/non-AC requirements. Call or WhatsApp our Surat desk for guaranteed best competitive rates.
                    </p>
                  </div>
                </div>
              </div>

              {/* Fleet Cards Grid */}
              <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tempoVehicles.map((bus) => {
                  const isSelected = highlightCarId === bus.id
                  return (
                    <div
                      key={bus.id || bus.name}
                      className={`flex flex-col justify-between rounded-[24px] border bg-white p-6 shadow-sm transition-all ${
                        isSelected
                          ? 'border-sky-deep ring-2 ring-sky-deep/30 shadow-md scale-[1.01]'
                          : 'border-ink/10 hover:shadow-md'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <span className="rounded-full bg-paper-2 px-3 py-1 text-xs font-bold text-ink">
                              {bus.capacity}
                            </span>
                            {isSelected && (
                              <span className="rounded-full bg-sky-deep px-2 py-0.5 text-[9px] font-bold text-white uppercase">
                                Recommended
                              </span>
                            )}
                          </div>
                          <span className="inline-flex items-center gap-1 rounded-full bg-leaf/10 px-2.5 py-0.5 text-[11px] font-semibold text-leaf-deep">
                            Driver: {bus.driverAllowance}
                          </span>
                        </div>
                        <h4 className="mt-4 text-xl font-bold text-ink">{bus.name}</h4>
                        <p className="mt-1 text-xs text-slate">{bus.idealFor}</p>

                        <div className="mt-5 space-y-2 rounded-xl bg-paper-2/80 p-3.5 text-xs text-slate">
                          <div className="flex justify-between border-b border-ink/8 pb-2">
                            <span>Outstation Rate</span>
                            <span className="font-bold text-sky-deep">{bus.outstationPerKm}</span>
                          </div>
                          <div className="flex justify-between border-b border-ink/8 pb-2">
                            <span>Local (8h / 80km)</span>
                            <span className="font-bold text-sky-deep">{bus.local8hr80km}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Local (12h / 100km)</span>
                            <span className="font-bold text-sky-deep">{bus.local12hr100km}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 flex items-center gap-2.5 border-t border-ink/8 pt-4">
                        <button
                          type="button"
                          onClick={() => handleBook(bus.name, bus.capacity, 'Call for price')}
                          className="flex-1 rounded-xl border border-ink/15 bg-white py-2 text-xs font-semibold text-ink shadow-sm transition hover:bg-paper-2"
                        >
                          Enquire
                        </button>
                        <a
                          href={whatsApp.build(`Hi, I would like to inquire about ${bus.name} (${bus.capacity}) for my group travel. Please share rates and availability.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-whatsapp py-2 text-xs font-semibold text-white shadow-sm transition hover:brightness-110"
                        >
                          <MessageCircle size={14} aria-hidden="true" />
                          <span>WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Popular Fixed Routes for Groups */}
              <div className="mt-12">
                <h4 className="text-xl font-bold text-ink">Popular Group Routes from Surat</h4>
                <p className="mt-1 text-xs text-slate sm:text-sm">
                  Rates on request based on group headcount and travel dates.
                </p>

                <div className="mt-4 overflow-hidden rounded-[24px] border border-ink/10 bg-white shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead className="border-b border-ink/10 bg-paper-2 text-xs font-bold uppercase tracking-wider text-ink">
                        <tr>
                          <th scope="col" className="px-6 py-4">
                            Group Route
                          </th>
                          <th scope="col" className="px-4 py-4 text-center">
                            Tata Winger
                          </th>
                          <th scope="col" className="px-4 py-4 text-center">
                            Tempo (12 Seater)
                          </th>
                          <th scope="col" className="px-4 py-4 text-center">
                            Tempo (17 Seater)
                          </th>
                          <th scope="col" className="px-4 py-4 text-center">
                            Tempo (20 Seater)
                          </th>
                          <th scope="col" className="px-6 py-4 text-right">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink/5 text-sm">
                        {tempoRoutes.map((routeItem, index) => (
                          <tr key={index} className="transition-colors hover:bg-sky/5">
                            <td className="px-6 py-4 font-semibold text-ink">
                              {routeItem.route}
                            </td>
                            <td className="px-4 py-4 text-center font-medium text-slate">
                              <span className="inline-block rounded-md bg-paper-2 px-2.5 py-1 text-xs font-semibold text-sky-deep">
                                {routeItem.winger}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center font-medium text-slate">
                              <span className="inline-block rounded-md bg-paper-2 px-2.5 py-1 text-xs font-semibold text-sky-deep">
                                {routeItem.tempo12}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center font-medium text-slate">
                              <span className="inline-block rounded-md bg-paper-2 px-2.5 py-1 text-xs font-semibold text-sky-deep">
                                {routeItem.tempo17}
                              </span>
                            </td>
                            <td className="px-4 py-4 text-center font-medium text-slate">
                              <span className="inline-block rounded-md bg-paper-2 px-2.5 py-1 text-xs font-semibold text-sky-deep">
                                {routeItem.tempo20}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <a
                                href={whatsApp.build(`Hi, I would like to get a quote for: ${routeItem.route} for a group. Please provide rates.`)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-xl bg-whatsapp px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:brightness-110"
                              >
                                <MessageCircle size={13} aria-hidden="true" />
                                <span>Get quote</span>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </Container>
    </section>
  )
}

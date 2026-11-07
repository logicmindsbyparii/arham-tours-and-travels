import { useId, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  AlertCircle,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  Clock,
  CreditCard,
  DoorOpen,
  FileCheck2,
  Globe2,
  MessageCircle,
  RotateCcw,
  Search,
  Send,
  Timer,
  X,
} from 'lucide-react'
import Button from '../../components/ui/Button.jsx'
import { useEnquire } from '../inquiry/useEnquire.js'
import { useWhatsApp } from '../inquiry/whatsapp.js'
import { useSite } from '../site/useSite.js'
import { getSmoothScroll } from '../../hooks/useSmoothScroll.js'
import {
  buildChecklistMessage,
  COUNTRY_ALIASES,
  findBestMatch,
  POPULAR_SLUGS,
  safeFormatPrice,
} from './visaChecklist.js'

function getLowestTotal(country) {
  const valid = (country?.charges ?? []).filter((c) => typeof c.total === 'number' && !isNaN(c.total))
  if (valid.length === 0) return null
  return valid.reduce((min, curr) => (curr.total < min.total ? curr : min), valid[0])
}

function VisaFinder() {
  const { visaCountries } = useSite()
  const enquire = useEnquire()
  const whatsApp = useWhatsApp()
  const [searchParams] = useSearchParams()

  const listboxId = useId()
  const inputRef = useRef(null)
  const resultRef = useRef(null)

  // Read initial country from URL if a user arrived via deep-link (e.g. ?country=usa)
  const countryParam = searchParams.get('country') || ''
  const initialCountry = useMemo(() => {
    if (!countryParam || visaCountries.length === 0) return null
    return findBestMatch(countryParam, visaCountries)
  }, [countryParam, visaCountries])

  // Track user-selected country (if manually chosen or searched); fallback to initialCountry
  const [userSelected, setUserSelected] = useState(null)
  const [queryOverride, setQueryOverride] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [noMatchQuery, setNoMatchQuery] = useState('')
  const [openAccordions, setOpenAccordions] = useState({})

  // Active country is user choice if explicitly set, otherwise deep-link from URL
  const activeCountry = userSelected !== null ? userSelected : initialCountry
  const query = queryOverride !== null ? queryOverride : (activeCountry ? activeCountry.name : '')

  // Filter combobox suggestions
  const suggestions = useMemo(() => {
    const q = (query ?? '').trim().toLowerCase()
    if (!q) return []
    return visaCountries.filter((c) => {
      if (c.name?.toLowerCase().includes(q)) return true
      if (c.id && c.id.toLowerCase().includes(q)) return true
      if (c.slug && c.slug.toLowerCase().includes(q)) return true
      // Check aliases
      for (const [slug, keywords] of Object.entries(COUNTRY_ALIASES)) {
        if ((c.id === slug || c.slug === slug) && keywords.some((kw) => kw.includes(q))) {
          return true
        }
      }
      return false
    })
  }, [query, visaCountries])

  // Curated popular countries for quick chips
  const popularCountries = useMemo(() => {
    const popular = POPULAR_SLUGS.map((slug) => visaCountries.find((c) => (c.id || c.slug) === slug)).filter(Boolean)
    if (popular.length > 0) return popular
    return visaCountries.slice(0, 8)
  }, [visaCountries])

  const selectCountry = (country) => {
    if (!country) return
    setNoMatchQuery('')
    setUserSelected(country)
    setQueryOverride(country.name)
    setIsOpen(false)
    setActiveIndex(-1)

    // Keep URL parameter in sync quietly without triggering router re-renders or ScrollManager jump-to-top
    const slug = country.id || country.slug
    if (slug && typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.set('country', slug)
      window.history.replaceState(null, '', url.toString())
    }

    // Expand all accordion groups initially
    const initialAcc = {}
    ;(country.documentGroups ?? []).forEach((_, idx) => {
      initialAcc[idx] = true
    })
    setOpenAccordions(initialAcc)

    // Smoothly scroll straight down to the details card right below the search bar
    setTimeout(() => {
      if (resultRef.current) {
        const lenis = getSmoothScroll()
        if (lenis) {
          lenis.scrollTo(resultRef.current, { offset: -90 })
        } else {
          resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }, 60)
  }

  const clearSelection = () => {
    setUserSelected(false)
    setQueryOverride('')
    setNoMatchQuery('')
    setIsOpen(false)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      url.searchParams.delete('country')
      window.history.replaceState(null, '', url.toString())
    }
    setTimeout(() => {
      inputRef.current?.focus()
    }, 50)
  }

  const submitSearch = (textToSearch) => {
    const q = (textToSearch ?? query).trim()
    if (!q) return
    const match = findBestMatch(q, visaCountries)
    if (match) {
      selectCountry(match)
    } else {
      setNoMatchQuery(q)
      setUserSelected(false)
      setIsOpen(false)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!isOpen && suggestions.length > 0) {
        setIsOpen(true)
        setActiveIndex(0)
      } else if (isOpen) {
        setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0))
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (isOpen) {
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1))
      }
    } else if (event.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
    } else if (event.key === 'Enter') {
      event.preventDefault()
      event.stopPropagation()
      if (isOpen && activeIndex >= 0 && suggestions[activeIndex]) {
        selectCountry(suggestions[activeIndex])
      } else {
        submitSearch(query)
      }
    }
  }

  const toggleAccordion = (index) => {
    setOpenAccordions((prev) => ({ ...prev, [index]: !prev[index] }))
  }

  const whatsappMessage = activeCountry ? buildChecklistMessage(activeCountry) : ''
  const whatsappUrl = activeCountry ? whatsApp.build(whatsappMessage) : '#'

  // Empty state if 0 countries exist
  if (visaCountries.length === 0) {
    return (
      <div className="rounded-[24px] bg-paper-2 p-8 sm:p-12 text-center ring-1 ring-ink/5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-sky-soft/30 text-sky-deep">
          <Globe2 size={28} aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-ink sm:text-2xl">
          Tell us which country you need a visa for
        </h3>
        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate">
          Our Surat visa desk assists with tourist and visitor visas worldwide. Contact us with your destination for paperwork guidance.
        </p>
        <div className="mt-6 flex justify-center">
          <Button variant="primary" onClick={() => enquire({ service: 'Visa assistance', destination: '' })}>
            <Send size={16} aria-hidden="true" />
            Enquire for visa assistance
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 1. Search Bar and Combobox */}
      <div className="relative mx-auto max-w-2xl">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            submitSearch(query)
          }}
          className="relative flex items-center"
        >
          <label htmlFor="visa-search-input" className="sr-only">
            Search destination country for visa documents and charges
          </label>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate">
            <Search size={20} aria-hidden="true" />
          </div>
          <input
            ref={inputRef}
            id="visa-search-input"
            type="text"
            role="combobox"
            aria-expanded={isOpen && suggestions.length > 0}
            aria-controls={listboxId}
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? `country-opt-${activeIndex}` : undefined}
            value={query}
            onChange={(e) => {
              const val = e.target.value
              setQueryOverride(val)
              setIsOpen(true)
              setActiveIndex(-1)
              setNoMatchQuery('')
            }}
            onFocus={() => {
              if (query.trim()) setIsOpen(true)
            }}
            onBlur={() => {
              // Small delay to allow clicking suggestion items
              setTimeout(() => setIsOpen(false), 200)
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search country (e.g. USA, Dubai, Thailand)…"
            className="w-full rounded-2xl border border-ink/10 bg-white py-4 pl-12 pr-12 text-base text-ink placeholder:text-slate shadow-sm transition focus:border-sky focus:outline-none focus:ring-4 focus:ring-sky/15"
          />
          {query && (
            <button
              type="button"
              onClick={clearSelection}
              aria-label="Clear search input"
              className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate hover:text-ink cursor-pointer"
            >
              <X size={18} aria-hidden="true" />
            </button>
          )}
        </form>

        {/* Combobox Suggestions Dropdown */}
        {isOpen && suggestions.length > 0 && (
          <ul
            id={listboxId}
            role="listbox"
            className="absolute z-30 mt-2 max-h-64 w-full overflow-y-auto rounded-2xl border border-ink/10 bg-white py-2 shadow-xl"
          >
            {suggestions.map((country, idx) => {
              const lowest = getLowestTotal(country)
              return (
                <li
                  key={country.id || country.slug}
                  id={`country-opt-${idx}`}
                  role="option"
                  aria-selected={activeIndex === idx}
                  onMouseDown={(e) => {
                    e.preventDefault()
                    selectCountry(country)
                  }}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={`flex cursor-pointer items-center justify-between px-4 py-3 text-sm transition-colors ${
                    activeIndex === idx ? 'bg-sky-50 text-sky-deep font-medium' : 'text-ink hover:bg-paper-2'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    {country.flag && <span className="text-xl">{country.flag}</span>}
                    <span>{country.name}</span>
                  </span>
                  {lowest && (
                    <span className="rounded-full bg-ember/10 px-2 py-0.5 text-xs font-semibold text-ember">
                      From {safeFormatPrice(lowest.total, lowest.currency || 'INR')}
                    </span>
                  )}
                </li>
              )
            })}
          </ul>
        )}

        {/* Quick Country Tap Chips */}
        <div className="mt-3.5">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none sm:flex-wrap">
            <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-slate mr-1">Popular:</span>
            {popularCountries.map((c) => {
              const lowest = getLowestTotal(c)
              const isSelected = activeCountry && (activeCountry.id === c.id || activeCountry.slug === c.slug)
              return (
                <button
                  key={c.id || c.slug}
                  type="button"
                  onClick={() => selectCountry(c)}
                  className={`inline-flex min-h-[34px] shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition cursor-pointer focus-visible:outline-2 focus-visible:outline-sky ${
                    isSelected
                      ? 'bg-ink text-paper shadow-xs'
                      : 'bg-paper-2 text-ink ring-1 ring-ink/10 hover:bg-sky hover:text-white hover:ring-sky'
                  }`}
                >
                  {c.flag && <span>{c.flag}</span>}
                  <span>{c.name}</span>
                  {lowest && !isSelected && (
                    <span className="ml-0.5 opacity-70">
                      · {safeFormatPrice(lowest.total, lowest.currency || 'INR')}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* No Match Notification */}
      {noMatchQuery && (
        <div
          role="status"
          className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50/90 p-5 text-center text-amber-950 shadow-xs"
        >
          <p className="text-sm font-semibold">We could not find &ldquo;{noMatchQuery}&rdquo; in our instant list.</p>
          <p className="mt-1 text-xs text-amber-900 leading-relaxed">
            We provide visa assistance for almost all destinations worldwide. Tell our Surat team your travel plans and
            we will send you the custom checklist.
          </p>
          <div className="mt-4 flex justify-center">
            <Button
              variant="primary"
              className="text-xs sm:text-sm"
              onClick={() => enquire({ service: 'Visa assistance', destination: noMatchQuery })}
            >
              <Send size={15} aria-hidden="true" />
              Enquire for {noMatchQuery} visa
            </Button>
          </div>
        </div>
      )}

      {/* 2. Result Panel: Appears RIGHT BELOW SEARCH on the same page */}
      {activeCountry && (
        <div
          ref={resultRef}
          key={activeCountry.id || activeCountry.slug}
          className="scroll-mt-28 mx-auto max-w-4xl overflow-hidden rounded-[24px] bg-paper p-4.5 sm:p-10 shadow-lg ring-1 ring-ink/10"
        >
          {/* Header */}
          <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              {activeCountry.flag ? (
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-paper-2 text-3xl shadow-xs"
                  aria-hidden="true"
                >
                  {activeCountry.flag}
                </span>
              ) : (
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-paper-2 text-lg font-bold text-sky-deep shadow-xs">
                  {(activeCountry.name ?? '').slice(0, 2).toUpperCase()}
                </span>
              )}
              <div>
                <h3 className="text-xl sm:text-3xl font-bold text-ink">
                  {activeCountry.name} Visa Details
                </h3>
                {activeCountry.tagline && (
                  <p className="mt-1 max-w-xl text-xs sm:text-sm leading-5 sm:leading-6 text-slate">{activeCountry.tagline}</p>
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <Button type="button" variant="outlineDark" onClick={clearSelection} className="text-xs sm:text-sm">
                <RotateCcw size={15} aria-hidden="true" />
                Change country
              </Button>
            </div>
          </div>

          {/* Quick Facts Strip (hides empty fields) */}
          {(activeCountry.processingTime ||
            activeCountry.stayDuration ||
            activeCountry.validity ||
            activeCountry.entryType) && (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {activeCountry.processingTime && (
                <div className="rounded-xl bg-paper-2 p-3.5 ring-1 ring-ink/5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate">
                    <Clock size={14} className="text-leaf-deep" aria-hidden="true" />
                    <span>Processing</span>
                  </div>
                  <span className="mt-1 block text-sm font-semibold text-ink">{activeCountry.processingTime}</span>
                </div>
              )}
              {activeCountry.stayDuration && (
                <div className="rounded-xl bg-paper-2 p-3.5 ring-1 ring-ink/5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate">
                    <Timer size={14} className="text-ember-deep" aria-hidden="true" />
                    <span>Stay duration</span>
                  </div>
                  <span className="mt-1 block text-sm font-semibold text-ink">{activeCountry.stayDuration}</span>
                </div>
              )}
              {activeCountry.validity && (
                <div className="rounded-xl bg-paper-2 p-3.5 ring-1 ring-ink/5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate">
                    <Calendar size={14} className="text-sky-deep" aria-hidden="true" />
                    <span>Validity</span>
                  </div>
                  <span className="mt-1 block text-sm font-semibold text-ink">{activeCountry.validity}</span>
                </div>
              )}
              {activeCountry.entryType && (
                <div className="rounded-xl bg-paper-2 p-3.5 ring-1 ring-ink/5">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate">
                    <DoorOpen size={14} className="text-leaf-deep" aria-hidden="true" />
                    <span>Entry type</span>
                  </div>
                  <span className="mt-1 block text-sm font-semibold text-ink">{activeCountry.entryType}</span>
                </div>
              )}
            </div>
          )}

          {/* Section: Documents Required */}
          <div className="mt-8">
            <h4 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-ink">
              <FileCheck2 size={22} className="text-sky shrink-0" aria-hidden="true" />
              <span>Documents required for {activeCountry.name}</span>
            </h4>
            <p className="mt-1 text-xs text-slate">
              Checklist personalized for this destination. Ensure all documents are clear and valid.
            </p>

            {(activeCountry.documentGroups ?? []).length === 0 ? (
              <p className="mt-4 rounded-xl bg-paper-2 p-4 text-xs italic text-slate">
                Document requirements will be confirmed upon enquiry.
              </p>
            ) : (
              <>
                {/* Desktop view: responsive grid cards */}
                <div className="mt-5 hidden sm:grid sm:grid-cols-2 gap-4">
                  {(activeCountry.documentGroups ?? []).map((group, gIdx) => (
                    <div
                      key={gIdx}
                      className="rounded-2xl bg-paper-2 p-5 ring-1 ring-ink/5 shadow-xs transition hover:shadow-sm"
                    >
                      <h5 className="border-b border-ink/10 pb-2.5 text-sm font-bold text-ink">
                        {group.title || `Group ${gIdx + 1}`}
                      </h5>
                      <ul className="mt-3.5 space-y-2.5">
                        {(group.items ?? []).map((item, iIdx) => (
                          <li key={iIdx} className="flex items-start gap-2.5 text-xs leading-5 text-ink/90">
                            <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-leaf-soft/40 text-leaf-deep">
                              <Check size={11} strokeWidth={3} aria-hidden="true" />
                            </span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                {/* Mobile view: accordion */}
                <div className="mt-5 space-y-3 sm:hidden">
                  {(activeCountry.documentGroups ?? []).map((group, gIdx) => {
                    const isExpanded = openAccordions[gIdx] ?? true
                    return (
                      <div key={gIdx} className="rounded-xl border border-ink/10 bg-paper-2 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => toggleAccordion(gIdx)}
                          className="flex min-h-[44px] w-full items-center justify-between px-4 py-3 text-left text-xs font-bold text-ink cursor-pointer"
                        >
                          <span>{group.title || `Group ${gIdx + 1}`}</span>
                          {isExpanded ? (
                            <ChevronUp size={16} aria-hidden="true" />
                          ) : (
                            <ChevronDown size={16} aria-hidden="true" />
                          )}
                        </button>
                        {isExpanded && (
                          <div className="border-t border-ink/5 px-4 pb-4 pt-2">
                            <ul className="space-y-2">
                              {(group.items ?? []).map((item, iIdx) => (
                                <li key={iIdx} className="flex items-start gap-2 text-xs leading-5 text-ink/90">
                                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-leaf-soft/40 text-leaf-deep">
                                    <Check size={10} strokeWidth={3} aria-hidden="true" />
                                  </span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>

          {/* Section: Visa Charges */}
          <div className="mt-10 border-t border-ink/10 pt-8">
            <h4 className="flex items-center gap-2 text-lg sm:text-xl font-bold text-ink">
              <CreditCard size={22} className="text-ember shrink-0" aria-hidden="true" />
              <span>Visa charges for {activeCountry.name}</span>
            </h4>
            <p className="mt-1 text-xs text-slate">
              Transparent cost breakdown of embassy fees and our assistance services.
            </p>

            {(activeCountry.charges ?? []).length === 0 ? (
              <div className="mt-4 rounded-2xl bg-paper-2 p-6 text-center ring-1 ring-ink/5">
                <p className="text-sm font-semibold text-ink">Charges are confirmed when you enquire</p>
                <p className="mt-1 text-xs text-slate">
                  Embassy fee rates fluctuate with foreign exchange. Contact our desk for an accurate current quote.
                </p>
                <Button
                  className="mt-4 text-xs sm:text-sm"
                  variant="primary"
                  onClick={() => enquire({ service: 'Visa assistance', destination: activeCountry.name })}
                >
                  <Send size={15} aria-hidden="true" />
                  Enquire for {activeCountry.name} fees
                </Button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                {/* Desktop and tablet table */}
                <div className="hidden sm:block overflow-hidden rounded-2xl bg-paper-2 ring-1 ring-ink/5">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-ink/10 bg-paper/70 font-semibold uppercase tracking-wider text-slate">
                          <th scope="col" className="px-4 py-3.5">Visa type</th>
                          <th scope="col" className="px-4 py-3.5">Embassy fee</th>
                          <th scope="col" className="px-4 py-3.5">Service fee</th>
                          <th scope="col" className="px-4 py-3.5">Total</th>
                          <th scope="col" className="px-4 py-3.5">Processing time</th>
                          <th scope="col" className="px-4 py-3.5">Note</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-ink/5">
                        {(activeCountry.charges ?? []).map((charge, idx) => (
                          <tr key={idx} className="hover:bg-paper/40 transition-colors">
                            <td className="px-4 py-3 font-semibold text-ink">{charge.visaType}</td>
                            <td className="px-4 py-3 text-slate">
                              {safeFormatPrice(charge.embassyFee, charge.currency || 'INR')}
                            </td>
                            <td className="px-4 py-3 text-slate">
                              {safeFormatPrice(charge.serviceFee, charge.currency || 'INR')}
                            </td>
                            <td className="px-4 py-3 font-bold text-sky-deep">
                              {safeFormatPrice(charge.total, charge.currency || 'INR')}
                            </td>
                            <td className="px-4 py-3 text-slate">{charge.processingTime || '—'}</td>
                            <td className="px-4 py-3 text-slate">{charge.note || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Mobile stacked cards */}
                <div className="space-y-3 sm:hidden">
                  {(activeCountry.charges ?? []).map((charge, idx) => (
                    <div key={idx} className="rounded-xl bg-paper-2 p-4 ring-1 ring-ink/5 shadow-xs">
                      <div className="flex items-start justify-between gap-2 border-b border-ink/10 pb-2">
                        <span className="font-semibold text-xs text-ink">{charge.visaType}</span>
                        <span className="font-bold text-xs text-sky-deep">
                          {safeFormatPrice(charge.total, charge.currency || 'INR')}
                        </span>
                      </div>
                      <div className="mt-2.5 space-y-1.5 text-[11px]">
                        <div className="flex justify-between text-slate">
                          <span>Embassy fee:</span>
                          <span className="font-medium text-ink">
                            {safeFormatPrice(charge.embassyFee, charge.currency || 'INR')}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate">
                          <span>Service fee:</span>
                          <span className="font-medium text-ink">
                            {safeFormatPrice(charge.serviceFee, charge.currency || 'INR')}
                          </span>
                        </div>
                        {charge.processingTime && (
                          <div className="flex justify-between text-slate">
                            <span>Processing time:</span>
                            <span className="font-medium text-ink">{charge.processingTime}</span>
                          </div>
                        )}
                        {charge.note && <p className="mt-1 text-slate italic pt-1">{charge.note}</p>}
                      </div>
                    </div>
                  ))}
                </div>

                {activeCountry.chargesNote && (
                  <p className="text-xs text-slate italic pt-1">* {activeCountry.chargesNote}</p>
                )}
              </div>
            )}
          </div>

          {/* Notes callout */}
          {activeCountry.notes && (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 text-amber-950">
              <div className="flex items-start gap-3">
                <AlertCircle size={18} className="mt-0.5 shrink-0 text-amber-700" aria-hidden="true" />
                <div className="text-xs leading-relaxed">
                  <span className="font-bold">Important note for {activeCountry.name}: </span>
                  <span className="whitespace-pre-line text-amber-900">{activeCountry.notes}</span>
                </div>
              </div>
            </div>
          )}

          {/* Actions & WhatsApp Sharing */}
          <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 border-t border-ink/10 pt-6">
            <Button
              variant="primary"
              className="min-h-[44px] justify-center"
              onClick={() => enquire({ service: 'Visa assistance', destination: activeCountry.name })}
            >
              <Send size={16} aria-hidden="true" />
              Enquire for {activeCountry.name} visa
            </Button>
            <Button href={whatsappUrl} variant="whatsapp" external className="min-h-[44px] justify-center">
              <MessageCircle size={16} aria-hidden="true" />
              Share checklist on WhatsApp
            </Button>
          </div>

          {/* General Guidance Disclaimer */}
          <p className="mt-4 text-[11px] text-slate italic">
            Disclaimer: General guidance. Final requirements and fees are decided by the embassy and confirmed by our team
            when you enquire.
          </p>
        </div>
      )}
    </div>
  )
}

export default VisaFinder

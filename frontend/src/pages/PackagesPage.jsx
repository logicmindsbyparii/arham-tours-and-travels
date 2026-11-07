import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import Select from '../components/ui/Select.jsx'
import Button from '../components/ui/Button.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import PageBanner from '../components/layout/PageBanner.jsx'
import HeaderSpacer from '../components/layout/HeaderSpacer.jsx'
import Seo from '../components/seo/Seo.jsx'
import PackageTile from '../features/packages/PackageTile.jsx'
import PackageDialog from '../features/packages/PackageDialog.jsx'
import PlanTripBand from '../features/inquiry/PlanTripBand.jsx'
import ContactSection from '../sections/ContactSection.jsx'
import PromisesSection from '../sections/PromisesSection.jsx'
import { formatPrice, getPricePerPerson } from '../data/packages.js'
import { useEnquire } from '../features/inquiry/useEnquire.js'
import { useSectionContent, useSite } from '../features/site/useSite.js'
import heroImage from '../assets/images/ha-long-bay-hero.webp'

const TYPE_TABS = [
  { id: 'all', label: 'All trips' },
  { id: 'international', label: 'International' },
  { id: 'domestic', label: 'Domestic' },
]

// Built-in banner; the admin can change it under Website content (packages.banner).
const BANNER = {
  image: heroImage,
  title: 'Tour packages from Surat,',
  accent: 'ready to book.',
  intro:
    'Group departures and holidays closer to home, with flights, stays and sightseeing arranged together. Prices are confirmed when you enquire.',
}

const SORTS = {
  recommended: { label: 'Recommended', compare: () => 0 },
  'price-low': { label: 'Price: low to high', compare: (a, b) => getPricePerPerson(a) - getPricePerPerson(b) },
  'price-high': { label: 'Price: high to low', compare: (a, b) => getPricePerPerson(b) - getPricePerPerson(a) },
  shortest: { label: 'Duration: shortest first', compare: (a, b) => a.nights - b.nights },
  longest: { label: 'Duration: longest first', compare: (a, b) => b.nights - a.nights },
}

function matchesSearch(item, query) {
  if (!query) return true
  const haystack = [item.title, item.region, item.description, ...item.places, ...item.inclusions].join(' ').toLowerCase()
  return query
    .toLowerCase()
    .split(/\s+/)
    .every((word) => haystack.includes(word))
}

function PackagesPage() {
  const enquire = useEnquire()
  const { packages } = useSite()
  const banner = useSectionContent('packages.banner', BANNER)
  const TYPES = TYPE_TABS.map((type) => ({
    ...type,
    count: type.id === 'all' ? packages.length : packages.filter((item) => item.category === type.id).length,
  }))
  // The cheapest trip per traveller, shown at its published price and basis.
  const cheapest = packages.length
    ? packages.reduce((best, item) => (getPricePerPerson(item) < getPricePerPerson(best) ? item : best))
    : null
  const regions = [...new Set(packages.map((item) => item.region))]
  // The type filter lives in the address (?type=domestic), so the menu's
  // Domestic / International links open the page already filtered. Changing
  // the tab updates the address without scrolling the page.
  const [searchParams, setSearchParams] = useSearchParams()
  const type = TYPES.some((item) => item.id === searchParams.get('type')) ? searchParams.get('type') : 'all'
  const setType = (next) =>
    setSearchParams(next === 'all' ? {} : { type: next }, { replace: true, state: { keepScroll: true } })
  const [sort, setSort] = useState('recommended')
  const [query, setQuery] = useState('')
  // The package whose full details are open in the popup, if any.
  const [viewing, setViewing] = useState(null)

  const results = useMemo(
    () =>
      packages
        .filter((item) => type === 'all' || item.category === type)
        .filter((item) => matchesSearch(item, query.trim()))
        .toSorted(SORTS[sort].compare),
    [packages, type, sort, query],
  )

  const clearFilters = () => {
    setType('all')
    setQuery('')
    setSort('recommended')
  }

  return (
    <>
      <Seo path="/packages" />
      {banner ? (
        <PageBanner
          image={banner.image}
          crumb="Tour packages"
          title={banner.title}
          accent={banner.accent}
          intro={banner.intro}
          facts={[
            { value: packages.length, label: 'Packages' },
            { value: regions.length, label: 'Destinations' },
            ...(cheapest
              ? [{ value: formatPrice(cheapest.price, cheapest.currency), label: `From, ${cheapest.priceBasis}` }]
              : []),
            { value: 'Surat', label: 'Group departures' },
          ]}
        />
      ) : (
        <HeaderSpacer title="Tour packages" />
      )}

      {/* Filters and list */}
      <section id="results" aria-labelledby="results-title" className="theme-light scroll-mt-0 bg-ink pb-24 sm:pb-32">
        <h2 id="results-title" className="sr-only">
          Packages
        </h2>
        {/* Sticky on large screens only, so it never covers half a phone screen. */}
        <div className="z-30 border-b border-paper/10 bg-ink/90 backdrop-blur-md lg:sticky lg:top-[4.5rem]">
          <Container className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
            <Tabs
              tabs={TYPES}
              activeId={type}
              onChange={setType}
              label="Type of trip"
              idPrefix="package-type"
              className="rounded-full bg-white p-1.5 ring-1 ring-paper/10"
            />
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block sm:w-72">
                <span className="sr-only">Search by place or activity</span>
                <Search size={17} aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 text-mist" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search a place, e.g. Hanoi"
                  className="min-h-12 w-full rounded-full border border-paper/15 bg-white pl-11 pr-4 text-sm text-paper placeholder:text-mist focus:border-sky focus:outline-none focus:ring-2 focus:ring-sky/25"
                />
              </label>
              <div className="flex min-h-12 items-center gap-1 rounded-full border border-paper/15 bg-white pl-4 pr-1 text-sm text-mist focus-within:border-sky sm:w-72">
                <span id="package-sort-label">Sort</span>
                <div className="min-w-0 flex-1">
                  <Select
                    id="package-sort"
                    aria-labelledby="package-sort-label package-sort"
                    value={sort}
                    onChange={(event) => setSort(event.target.value)}
                    options={Object.entries(SORTS).map(([id, option]) => ({ value: id, label: option.label }))}
                    className="min-h-11 rounded-full bg-transparent px-2 font-semibold text-paper focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </Container>
        </div>

        <Container>
          <p role="status" className="mt-10 text-sm text-mist">
            {results.length === 1 ? 'Showing 1 package' : `Showing ${results.length} packages`}
            {query.trim() && ` for “${query.trim()}”`}
            {sort !== 'recommended' && ' · Prices compared per person'}
          </p>

          <div
            id="package-type-panel"
            role="tabpanel"
            aria-labelledby={`package-type-tab-${type}`}
            className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {results.map((item, index) => (
                <PackageTile key={item.id} item={item} index={index} onView={setViewing} />
              ))}
            </AnimatePresence>

            {results.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="col-span-full flex flex-col items-center rounded-[28px] bg-white px-6 py-16 text-center ring-1 ring-paper/10"
              >
                <p className="font-hand text-3xl text-sky-deep">No trip matches that yet</p>
                <p className="mt-3 max-w-md text-slate">
                  We also plan trips that are not listed here. Clear the filters, or tell us where you want to go.
                </p>
                <div className="mt-7 flex flex-wrap justify-center gap-3">
                  <Button variant="outline" onClick={clearFilters}>
                    <X size={16} aria-hidden="true" />
                    Clear filters
                  </Button>
                  <Button onClick={() => enquire({ service: 'Something else', destination: query.trim() })}>
                    Ask for a custom trip
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          <p className="mt-10 text-xs leading-6 text-mist">
            Prices, durations and inclusions are taken from Arham's published package flyers and may change with dates
            and availability. Hotels are as listed or similar. Your final quote confirms exactly what is included.
          </p>
        </Container>
      </section>

      <PromisesSection />
      <PlanTripBand />
      <ContactSection />
      <PackageDialog item={viewing} onClose={() => setViewing(null)} />
    </>
  )
}

export default PackagesPage

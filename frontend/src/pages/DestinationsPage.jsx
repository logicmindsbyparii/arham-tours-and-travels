import { useSearchParams } from 'react-router-dom'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Tabs from '../components/ui/Tabs.jsx'
import PageBanner from '../components/layout/PageBanner.jsx'
import HeaderSpacer from '../components/layout/HeaderSpacer.jsx'
import Seo from '../components/seo/Seo.jsx'
import FaqSection from '../components/seo/FaqSection.jsx'
import PlanTripBand from '../features/inquiry/PlanTripBand.jsx'
import ContactSection from '../sections/ContactSection.jsx'
import Destination3DCard from '../features/destinations/Destination3DCard.jsx'
import { useSectionContent, useSite } from '../features/site/useSite.js'
import bannerImage from '../assets/images/golden-bridge-walkway.webp'

const TYPE_TABS = [
  { id: 'all', label: 'All places' },
  { id: 'international', label: 'International' },
  { id: 'domestic', label: 'Domestic' },
]

// Built-in banner; the admin can change it under Website content (destinations.banner).
const BANNER = {
  image: bannerImage,
  title: 'Vietnam and Goa,',
  accent: 'seen up close.',
  intro:
    'Limestone bays, mountain bridges, old quarters and palm-lined beaches: the places our tour packages from Surat take you.',
}

function DestinationsPage() {
  const { destinations, packages, faqs } = useSite()
  const banner = useSectionContent('destinations.banner', BANNER)
  const regions = [...new Set(packages.map((item) => item.region))]
  const TYPES = TYPE_TABS.map((type) => ({
    ...type,
    count:
      type.id === 'all'
        ? destinations.length
        : destinations.filter((place) => place.package?.category === type.id).length,
  }))
  // ?type=domestic | international, set by the menu's sub-links or the tabs.
  const [searchParams, setSearchParams] = useSearchParams()
  const type = TYPES.some((item) => item.id === searchParams.get('type')) ? searchParams.get('type') : 'all'
  const setType = (next) =>
    setSearchParams(next === 'all' ? {} : { type: next }, { replace: true, state: { keepScroll: true } })
  const shown = destinations.filter((place) => type === 'all' || place.package?.category === type)

  return (
    <>
      <Seo path="/destinations" />
      {banner ? (
        <PageBanner
          image={banner.image}
          crumb="Destinations"
          title={banner.title}
          accent={banner.accent}
          accentClassName="text-sky-soft"
          intro={banner.intro}
          facts={[
            { value: destinations.length, label: 'Places to see' },
            { value: regions.length, label: 'Countries & states' },
            { value: packages.length, label: 'Tour packages' },
            { value: 'Surat', label: 'Group departures' },
          ]}
        />
      ) : (
        <HeaderSpacer title="Destinations" />
      )}

      <section id="guide" aria-labelledby="guide-title" className="bg-paper py-20 text-ink sm:py-28">
        <Container>
          <SectionHeading
            id="guide-title"
            tone="dark"
            eyebrow="Destination guide"
            accentTone="green"
            title="Where each trip"
            accent="takes you."
            intro="Explore hand-picked destinations featured across our top holiday packages with live durations, starting prices, and 3D previews."
          />
          <Tabs
            tabs={TYPES}
            activeId={type}
            onChange={setType}
            label="Type of destination"
            idPrefix="destination-type"
            tone="dark"
            className="mt-10 inline-flex max-w-full rounded-full bg-paper-2 p-1.5 ring-1 ring-ink/10 sm:mt-12"
          />
          <div
            id="destination-type-panel"
            role="tabpanel"
            aria-labelledby={`destination-type-tab-${type}`}
            className="mt-12 grid grid-cols-1 gap-7 sm:gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {shown.map((destination, index) => (
              <Destination3DCard key={destination.id} destination={destination} index={index} />
            ))}
          </div>
        </Container>
      </section>

      <FaqSection faqs={faqs.destinations ?? []} />
      <PlanTripBand note="dreaming of somewhere else?" />
      <ContactSection />
    </>
  )
}

export default DestinationsPage

import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import PageBanner from '../components/layout/PageBanner.jsx'
import HeaderSpacer from '../components/layout/HeaderSpacer.jsx'
import Seo from '../components/seo/Seo.jsx'
import AboutSection from '../sections/AboutSection.jsx'
import PromisesSection from '../sections/PromisesSection.jsx'
import ContactSection from '../sections/ContactSection.jsx'
import PlanTripBand from '../features/inquiry/PlanTripBand.jsx'
import { useBusiness, useSectionContent } from '../features/site/useSite.js'
import bannerImage from '../assets/images/mountain-valley.webp'

// Built-in banner; the admin can change it under Website content (about.banner).
const BANNER = {
  image: bannerImage,
  title: 'A travel agency in Surat,',
  accent: 'planning every detail.',
  intro:
    'Arham Tours & Travels is the travel brand of Arham Holiday Designer LLP. We plan group tours, holidays, flights, visas and hotels as one plan, from our office on U M Road.',
}

function AboutPage() {
  const business = useBusiness()
  const banner = useSectionContent('about.banner', BANNER)
  const DETAILS = [
    { label: 'Brand', value: business.name },
    { label: 'Registered as', value: business.legalName },
    { label: 'Office', value: business.addressLines.join(', ') },
    { label: 'Contact person', value: business.contactPerson },
    { label: 'Phone', value: business.phones.map((phone) => phone.label).join(', ') },
    { label: 'Email', value: business.emails.join(', ') },
    { label: 'Office hours', value: business.hours },
  ].filter((detail) => detail.value)

  return (
    <>
      <Seo path="/about" />
      {banner ? (
        <PageBanner
          image={banner.image}
          crumb="About us"
          title={banner.title}
          accent={banner.accent}
          intro={banner.intro}
        />
      ) : (
        <HeaderSpacer title="About us" />
      )}

      <AboutSection />
      <PromisesSection />

      <section aria-labelledby="company-title" className="bg-paper-2 py-20 text-ink sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <SectionHeading
            id="company-title"
            tone="dark"
            eyebrow="Company details"
            accentTone="red"
            title="Who you are"
            accent="booking with."
          />
          <Reveal as="dl" delay={0.1} className="divide-y divide-ink/10 rounded-[24px] bg-paper px-6 ring-1 ring-ink/5 sm:px-8">
            {DETAILS.map((detail) => (
              <div key={detail.label} className="grid gap-1 py-5 sm:grid-cols-[11rem_1fr] sm:gap-6">
                <dt className="text-sm font-semibold text-slate">{detail.label}</dt>
                <dd className="break-words text-base text-ink">{detail.value}</dd>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      <PlanTripBand note="ready when you are" title="Let us plan your next trip." />
      <ContactSection />
    </>
  )
}

export default AboutPage

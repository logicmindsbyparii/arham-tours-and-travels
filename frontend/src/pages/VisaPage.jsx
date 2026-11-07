import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import PageBanner from '../components/layout/PageBanner.jsx'
import Seo from '../components/seo/Seo.jsx'
import FaqSection from '../components/seo/FaqSection.jsx'
import ContactSection from '../sections/ContactSection.jsx'
import PlanTripBand from '../features/inquiry/PlanTripBand.jsx'
import VisaFinder from '../features/visa/VisaFinder.jsx'
import { useSectionContent, useSite } from '../features/site/useSite.js'
import bannerImage from '../assets/images/flight-takeoff.webp'

const DEFAULT_BANNER = {
  image: bannerImage,
  title: 'Visa assistance, documents & charges,',
  accent: 'simplified.',
  intro: 'Find the exact checklist and visa fees for your destination, prepare your paperwork, and get expert assistance from our team.',
}

const STEPS = [
  {
    title: 'Check document checklist',
    text: 'Select your destination and view the exact paperwork required for your profile (employed, business, student).',
  },
  {
    title: 'Share documents for review',
    text: 'Send your documents for pre-check via WhatsApp or visit our office on U M Road in Surat.',
  },
  {
    title: 'Filing & embassy submission',
    text: 'We verify every paper, schedule biometric appointments if needed, and submit the application correctly.',
  },
  {
    title: 'Get your visa & fly',
    text: 'Receive your approved e-visa or stamped passport and head out on your trip with confidence.',
  },
]

function VisaPage() {
  const { visaCountries, faqs } = useSite()
  const banner = useSectionContent('visa.banner', DEFAULT_BANNER)

  return (
    <>
      <Seo path="/visa" />
      <PageBanner
        image={banner?.image || bannerImage}
        crumb="Visa assistance"
        title={banner?.title || DEFAULT_BANNER.title}
        accent={banner?.accent || DEFAULT_BANNER.accent}
        intro={banner?.intro || DEFAULT_BANNER.intro}
        facts={[
          { label: 'Available countries', value: String(visaCountries.length) },
          { label: 'Document pre-check', value: '100% manual' },
          { label: 'Support', value: 'Surat team' },
          { label: 'Indian passport', value: 'Tailored' },
        ]}
      />

      {/* Main Visa Search and Live Result Section */}
      <section id="search" aria-labelledby="visa-search-heading" className="bg-paper py-16 sm:py-24 text-ink">
        <Container>
          <SectionHeading
            id="visa-search-heading"
            tone="dark"
            eyebrow="Instant lookup"
            accentTone="blue"
            title="Search country for documents"
            accent="& visa charges."
            intro="Type your destination country to view the complete document checklist, consular processing timeline, and exact visa fee breakdown."
          />

          <div className="mt-10">
            <VisaFinder />
          </div>
        </Container>
      </section>

      {/* How It Works Steps */}
      <section aria-labelledby="steps-title" className="bg-paper-2 py-20 text-ink sm:py-28">
        <Container>
          <SectionHeading
            id="steps-title"
            tone="dark"
            eyebrow="How it works"
            accentTone="green"
            title="Four simple steps to"
            accent="your visa."
            intro="We take the confusion out of embassy requirements with clear checklists, transparent fees, and rigorous verification."
          />
          <ol className="mt-12 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <Reveal
                as="li"
                key={step.title}
                delay={index * 0.08}
                className="rounded-[24px] bg-paper p-6 sm:p-7 shadow-xs ring-1 ring-ink/5"
              >
                <span className="font-display text-4xl font-bold text-sky">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* FAQs: using faqs.visa */}
      <FaqSection faqs={faqs?.visa ?? []} />

      {/* Plan Trip Band */}
      <PlanTripBand
        note="destination not listed?"
        title="Need a visa for another country? We assist with that too."
        text="Share your destination country and travel dates with our visa team in Surat. We check the latest embassy rules and assist with your application."
        service="Visa assistance"
        topic="visa assistance"
      />

      {/* Contact Section */}
      <ContactSection />
    </>
  )
}

export default VisaPage

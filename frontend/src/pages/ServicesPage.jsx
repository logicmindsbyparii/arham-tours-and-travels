import { ArrowUpRight, CarFront, Check, Luggage, MessageCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import Button from '../components/ui/Button.jsx'
import SmartImage from '../components/ui/SmartImage.jsx'
import PageBanner from '../components/layout/PageBanner.jsx'
import HeaderSpacer from '../components/layout/HeaderSpacer.jsx'
import Seo from '../components/seo/Seo.jsx'
import FaqSection from '../components/seo/FaqSection.jsx'
import ContactSection from '../sections/ContactSection.jsx'
import { useEnquire } from '../features/inquiry/useEnquire.js'
import { useWhatsApp } from '../features/inquiry/whatsapp.js'
import { useSectionContent, useSite } from '../features/site/useSite.js'
import bannerImage from '../assets/images/flight-wing.webp'

// Built-in banner; the admin can change it under Website content (services.banner).
const BANNER = {
  image: bannerImage,
  title: 'Flights, visas, hotels',
  accent: 'and cruises, handled.',
  intro: 'Everything around the trip, booked with your tour package or on its own by our travel team in Surat.',
}

// How an enquiry turns into a booked trip.
const STEPS = [
  { title: 'Tell us what you need', text: 'Send an enquiry, call or WhatsApp us with your destination, dates and number of travellers.' },
  { title: 'Get options and a quote', text: 'We come back with suitable flights, stays or packages and a clear price.' },
  { title: 'Confirm and get ready', text: 'Once you confirm, we book everything and guide you on the documents you need.' },
  { title: 'Travel', text: 'Head off with your bookings in place and our team a call or a message away.' },
]

// Services that have their own page.
const MORE = [
  {
    to: '/packages',
    icon: Luggage,
    title: 'Tour packages',
    text: 'Vietnam group departures and Goa holidays, priced as one plan.',
  },
  {
    to: '/car-rental',
    icon: CarFront,
    title: 'Car rental',
    text: 'A car and driver for airport transfers, sightseeing, outstation trips and groups.',
  },
]

function ServiceCard({ service, index }) {
  const enquire = useEnquire()
  const whatsApp = useWhatsApp()
  const Icon = service.icon

  return (
    <Reveal
      as="article"
      id={service.id}
      delay={(index % 2) * 0.1}
      aria-labelledby={`${service.id}-title`}
      className="flex flex-col overflow-hidden rounded-[26px] bg-paper shadow-[0_30px_60px_-40px_rgb(15_23_42/0.45)] ring-1 ring-ink/5"
    >
      <div className="relative">
        <SmartImage src={service.image} alt={service.imageAlt} label={service.title} className="aspect-[16/9] w-full" />
        <span className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-leaf-deep">
          <Icon size={22} aria-hidden="true" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <h3 id={`${service.id}-title`} className="text-2xl font-semibold text-ink">
          {service.title}
        </h3>
        <p className="mt-3 text-base leading-7 text-slate">{service.summary}</p>
        <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
          {service.features.map((feature) => (
            <li key={feature} className="flex items-start gap-3 text-sm text-ink">
              <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-leaf-deep" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex flex-wrap gap-3 pt-7">
          <Button variant="leaf" onClick={() => enquire({ service: service.inquiryLabel, destination: '' })}>
            Enquire now
          </Button>
          <Button href={whatsApp.quick(service.title.toLowerCase())} variant="outlineDark" external>
            <MessageCircle size={17} aria-hidden="true" />
            WhatsApp
          </Button>
        </div>
      </div>
    </Reveal>
  )
}

function ServicesPage() {
  const { services, faqs } = useSite()
  const banner = useSectionContent('services.banner', BANNER)

  return (
    <>
      <Seo path="/services" />
      {banner ? (
        <PageBanner
          image={banner.image}
          crumb="Services"
          title={banner.title}
          accent={banner.accent}
          intro={banner.intro}
          facts={[
            { value: services.length + MORE.length, label: 'Travel services' },
            { value: 'Domestic', label: '& international flights' },
            { value: 'Visa', label: 'Document guidance' },
            { value: 'Groups', label: 'Families & groups welcome' },
          ]}
        />
      ) : (
        <HeaderSpacer title="Services" />
      )}

      <section aria-labelledby="all-services-title" className="bg-paper-2 py-20 text-ink sm:py-28">
        <Container>
          <SectionHeading
            id="all-services-title"
            tone="dark"
            eyebrow="Travel services"
            accentTone="green"
            title="What we can"
            accent="book for you."
          />
          <div className="mt-12 grid gap-6 sm:mt-14 lg:grid-cols-2 lg:gap-8">
            {services.map((service, index) => (
              <ServiceCard key={service.id} service={service} index={index} />
            ))}
          </div>

          <ul className="mt-6 grid gap-6 md:grid-cols-2 lg:mt-8 lg:gap-8">
            {MORE.map(({ to, icon: Icon, title, text }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="group flex h-full items-start gap-5 rounded-[26px] bg-ink p-6 text-paper transition duration-500 hover:-translate-y-1 sm:p-8"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-ember text-white">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center justify-between gap-3 text-xl font-semibold">
                      {title}
                      <ArrowUpRight size={20} aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-45" />
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-mist">{text}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section aria-labelledby="steps-title" className="bg-paper py-20 text-ink sm:py-28">
        <Container>
          <SectionHeading
            id="steps-title"
            tone="dark"
            eyebrow="How it works"
            accentTone="red"
            title="From enquiry to"
            accent="departure."
          />
          <ol className="mt-12 grid gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, index) => (
              <Reveal as="li" key={step.title} delay={index * 0.08} className="rounded-[24px] border border-ink/10 p-6 sm:p-7">
                <span className="font-display text-4xl font-bold text-ember">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-4 text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate">{step.text}</p>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <FaqSection faqs={faqs.services ?? []} />
      <ContactSection />
    </>
  )
}

export default ServicesPage

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, MessageCircle } from 'lucide-react'
import Container from '../../components/ui/Container.jsx'
import SectionHeading from '../../components/ui/SectionHeading.jsx'
import Tabs from '../../components/ui/Tabs.jsx'
import Button from '../../components/ui/Button.jsx'
import SmartImage from '../../components/ui/SmartImage.jsx'
import Tilt from '../../components/ui/Tilt.jsx'
import { useEnquire } from '../inquiry/useEnquire.js'
import { useWhatsApp } from '../inquiry/whatsapp.js'
import { useSectionContent, useSite } from '../site/useSite.js'

// Built-in heading; the admin can change it under Website content (home.services).
const HEADING = {
  eyebrow: 'Travel services',
  title: 'Everything around the trip,',
  accent: 'handled.',
  intro: 'The pieces that make a trip work, booked with your package or on their own: tickets, visas, stays and cruises.',
}

function ServicesSection() {
  const { services } = useSite()
  const heading = useSectionContent('home.services', HEADING)
  const [activeId, setActiveId] = useState(null)
  const enquire = useEnquire()
  const whatsApp = useWhatsApp()
  if (services.length === 0) return null

  const tabs = services.map((item) => ({ id: item.id, label: item.title }))
  // The chosen tab, or the first service (also when the chosen one was removed).
  const service = services.find((item) => item.id === activeId) ?? services[0]
  const Icon = service.icon

  return (
    <section id="services" aria-labelledby={heading ? 'services-title' : undefined} aria-label={heading ? undefined : 'Travel services'} className="bg-paper py-24 text-ink sm:py-32">
      <Container className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          {heading && (
            <SectionHeading
              id="services-title"
              tone="dark"
              eyebrow={heading.eyebrow}
              accentTone="green"
              title={heading.title}
              accent={heading.accent}
              intro={heading.intro}
            />
          )}
          <Tabs
            tabs={tabs}
            activeId={service.id}
            onChange={setActiveId}
            label="Travel services"
            idPrefix="services"
            tone="dark"
            variant="list"
            className="mt-12"
          />
        </div>

        <div
          id="services-panel"
          role="tabpanel"
          aria-labelledby={`services-tab-${service.id}`}
          className="lg:sticky lg:top-28 lg:self-start"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24, rotateY: -14, transformPerspective: 1200 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              exit={{ opacity: 0, y: -12, rotateY: 10 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Tilt max={6} className="overflow-hidden rounded-[26px] shadow-[0_40px_70px_-40px_rgb(15_23_42/0.35)]">
                <SmartImage src={service.image} alt={service.imageAlt} className="aspect-[16/11] w-full" />
                <span className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-full bg-paper text-leaf-deep">
                  <Icon size={22} aria-hidden="true" />
                </span>
              </Tilt>

              <h3 className="mt-8 text-3xl text-ink">{service.title}</h3>
              <p className="mt-3 text-base leading-7 text-slate">{service.summary}</p>

              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-ink">
                    <Check size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-leaf-deep" />
                    {feature}
                  </li>
                ))}
              </ul>
              {service.note && <p className="mt-6 text-sm leading-6 text-slate">{service.note}</p>}

              <div className="mt-8 flex flex-wrap gap-3">
                <Button variant="leaf" onClick={() => enquire({ service: service.inquiryLabel, destination: '' })}>
                  Enquire about {service.title.toLowerCase()}
                </Button>
                <Button href={whatsApp.quick(service.title.toLowerCase())} variant="outlineDark" external>
                  <MessageCircle size={17} aria-hidden="true" />
                  WhatsApp
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </Container>
    </section>
  )
}

export default ServicesSection

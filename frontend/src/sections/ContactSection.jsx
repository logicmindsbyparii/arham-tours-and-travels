import { Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import Container from '../components/ui/Container.jsx'
import SectionHeading from '../components/ui/SectionHeading.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import Button from '../components/ui/Button.jsx'
import OfficeMap from '../components/ui/OfficeMap.jsx'
import InquiryForm from '../features/inquiry/InquiryForm.jsx'
import { useWhatsApp } from '../features/inquiry/whatsapp.js'
import { useBusiness, useSectionContent } from '../features/site/useSite.js'

// Built-in heading; the admin can change it under Website content (home.contact).
const HEADING = {
  eyebrow: 'Plan your trip',
  title: 'Where would you',
  accent: 'like to go?',
  intro: 'Send an enquiry, call or visit our Surat office. We will come back with options, dates and a quote.',
}

// withMap: show the office on a map instead of the plain address (home page).
function ContactSection({ withMap = false }) {
  const business = useBusiness()
  const whatsApp = useWhatsApp()
  const heading = useSectionContent('home.contact', HEADING)

  return (
    <section id="contact" aria-labelledby={heading ? 'contact-title' : undefined} aria-label={heading ? undefined : 'Plan your trip'} className="bg-paper py-24 text-ink sm:py-32">
      <Container className="grid gap-16 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          {heading && (
            <SectionHeading
              id="contact-title"
              tone="dark"
              eyebrow={heading.eyebrow}
              accentTone="green"
              title={heading.title}
              accent={heading.accent}
              intro={heading.intro}
            />
          )}

          <Reveal delay={0.1} className="mt-12 space-y-8">
            {business.phones.length > 0 && (
            <div className="flex gap-4">
              <Phone size={20} aria-hidden="true" className="mt-1 shrink-0 text-ember-deep" />
              <div>
                <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-slate">
                  {business.contactPerson ? `Call ${business.contactPerson}` : 'Call us'}
                </h3>
                <ul className="mt-2 space-y-1">
                  {business.phones.map((phone) => (
                    <li key={phone.href}>
                      <a href={phone.href} className="text-lg text-ink underline-offset-4 hover:underline">
                        {phone.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            )}

            {business.emails.length > 0 && (
            <div className="flex gap-4">
              <Mail size={20} aria-hidden="true" className="mt-1 shrink-0 text-sky-deep" />
              <div>
                <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-slate">Email</h3>
                <ul className="mt-2 space-y-1">
                  {business.emails.map((email) => (
                    <li key={email}>
                      <a href={`mailto:${email}`} className="break-all text-lg text-ink underline-offset-4 hover:underline">
                        {email}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            )}

            {withMap ? (
              <OfficeMap />
            ) : (
              <div className="flex gap-4">
                <MapPin size={20} aria-hidden="true" className="mt-1 shrink-0 text-leaf-deep" />
                <div>
                  <h3 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-slate">Visit</h3>
                  <address className="mt-2 text-base not-italic leading-7 text-ink">
                    <span className="block">{business.legalName}</span>
                    {business.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                  <p className="mt-2 text-sm text-slate">{business.hours}</p>
                  <a
                    href={business.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-sm font-semibold text-leaf-deep underline-offset-4 hover:underline"
                  >
                    Open in Google Maps
                  </a>
                </div>
              </div>
            )}

            <Button href={whatsApp.general()} variant="whatsapp" external>
              <MessageCircle size={18} aria-hidden="true" />
              Chat on WhatsApp
            </Button>
          </Reveal>
        </div>

        <Reveal delay={0.15}>
          <InquiryForm />
        </Reveal>
      </Container>
    </section>
  )
}

export default ContactSection

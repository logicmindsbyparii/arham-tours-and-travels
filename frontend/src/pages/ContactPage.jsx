import { motion } from 'framer-motion'
import { ChevronRight, Mail, MessageCircle, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../components/ui/Container.jsx'
import Seo from '../components/seo/Seo.jsx'
import FaqSection from '../components/seo/FaqSection.jsx'
import InquiryForm from '../features/inquiry/InquiryForm.jsx'
import { INQUIRY_SECTION_ID } from '../features/inquiry/useEnquire.js'
import { useWhatsApp } from '../features/inquiry/whatsapp.js'
import { useSite } from '../features/site/useSite.js'

const EASE = [0.16, 1, 0.3, 1]

// Quick ways to reach the team, one theme colour each. Channels without
// details in the admin settings are left out.
function buildChannels(business, whatsApp) {
  return [
    {
      icon: Phone,
      tone: 'bg-ember',
      title: business.contactPerson ? `Call ${business.contactPerson}` : 'Call us',
      links: business.phones.map((phone) => ({ label: phone.label, href: phone.href })),
    },
    {
      icon: MessageCircle,
      tone: 'bg-leaf',
      title: 'WhatsApp',
      links: [{ label: 'Chat with us now', href: whatsApp.general(), external: true }],
    },
    {
      icon: Mail,
      tone: 'bg-sky',
      title: 'Email',
      links: business.emails.map((email) => ({ label: email, href: `mailto:${email}` })),
    },
  ].filter((channel) => channel.links.length > 0)
}

function rise(delay) {
  return {
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  }
}

// Contact page: no banner. The enquiry form and the ways to reach us are the
// first thing on the page.
function ContactPage() {
  const { business, faqs } = useSite()
  const whatsApp = useWhatsApp()
  const CHANNELS = buildChannels(business, whatsApp)

  return (
    <>
      <Seo path="/contact" />

      <section
        id={INQUIRY_SECTION_ID}
        aria-labelledby="page-title"
        className="relative isolate overflow-hidden bg-[linear-gradient(180deg,#eaf1fd_0%,#f5f7fa_45%,#ffffff_100%)] pb-20 pt-28 text-ink sm:pb-24 sm:pt-32"
      >
        <div aria-hidden="true" className="absolute -right-40 -top-40 -z-10 h-[32rem] w-[32rem] rounded-full bg-sky/15 blur-3xl" />
        <div aria-hidden="true" className="absolute -left-48 bottom-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-leaf/10 blur-3xl" />

        <Container className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
          {/* Ways to reach us and the office */}
          <div className="min-w-0">
            <nav aria-label="Breadcrumb">
              <ol className="flex items-center gap-2 text-sm text-slate">
                <li>
                  <Link to="/" className="transition-colors hover:text-ink">
                    Home
                  </Link>
                </li>
                <li aria-hidden="true">
                  <ChevronRight size={14} />
                </li>
                <li aria-current="page" className="font-medium text-ink">
                  Contact
                </li>
              </ol>
            </nav>

            <motion.h1
              id="page-title"
              {...rise(0.1)}
              className="mt-5 font-sans text-[clamp(2.3rem,5.2vw,3.9rem)] font-bold leading-[1.02] tracking-[-0.03em]"
            >
              Talk to our{' '}
              <span className="bg-[linear-gradient(90deg,#1d4ed8_0%,#15803d_100%)] bg-clip-text text-transparent">
                {business.city} travel team.
              </span>
            </motion.h1>
            <motion.p {...rise(0.2)} className="mt-4 max-w-lg text-base leading-7 text-slate">
              Fill in the form, call, WhatsApp or email us. We come back with options, dates and a quote.
            </motion.p>

            <motion.ul {...rise(0.3)} className="mt-8 grid gap-3 sm:grid-cols-2">
              {CHANNELS.map(({ icon: Icon, tone, title, links }, index) => (
                <li
                  key={title}
                  className={`flex items-start gap-3.5 rounded-2xl bg-white p-4 shadow-[0_14px_30px_-24px_rgb(15_23_42/0.5)] ring-1 ring-ink/10 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_40px_-26px_rgb(15_23_42/0.55)] ${
                    index === CHANNELS.length - 1 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white ${tone}`}>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                  <h2 className="font-sans text-xs font-bold uppercase tracking-[0.16em] text-slate">{title}</h2>
                  <ul className="mt-1 space-y-0.5">
                    {links.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                          className="break-all text-[0.95rem] font-semibold text-ink underline-offset-4 hover:underline"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                  </div>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Enquiry form */}
          <motion.div {...rise(0.25)} className="min-w-0 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-[28px] bg-white shadow-[0_40px_80px_-45px_rgb(15_23_42/0.5)] ring-1 ring-ink/10">
              <InquiryForm />
            </div>
          </motion.div>
        </Container>
      </section>

      <FaqSection faqs={faqs.contact ?? []} />
    </>
  )
}

export default ContactPage

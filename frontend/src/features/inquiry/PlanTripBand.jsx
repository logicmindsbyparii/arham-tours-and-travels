import { MessageCircle } from 'lucide-react'
import Container from '../../components/ui/Container.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import Button from '../../components/ui/Button.jsx'
import { useEnquire } from './useEnquire.js'
import { useWhatsApp } from './whatsapp.js'

// Blue-to-green call to action that opens the enquiry form for a custom trip.
function PlanTripBand({
  note = 'not on the list?',
  title = 'Tell us where you want to go. We will plan it.',
  text = 'Domestic or international, for two people or a whole group: share your dates and budget and we will send you options and a quote.',
  service = 'Something else',
  topic = 'a custom holiday',
}) {
  const enquire = useEnquire()
  const whatsApp = useWhatsApp()

  return (
    <section aria-labelledby="plan-trip-title" className="bg-paper py-20 sm:py-24">
      <Container>
        <Reveal className="relative overflow-hidden rounded-[28px] bg-[linear-gradient(120deg,#1d4ed8_0%,#2563eb_45%,#15803d_100%)] px-6 py-12 text-white sm:rounded-[32px] sm:px-14 sm:py-16">
          <svg aria-hidden="true" viewBox="0 0 600 200" className="absolute -right-10 bottom-0 w-[70%] max-w-xl opacity-25">
            <path d="M10 180 C 150 120, 300 170, 420 90 S 560 30, 590 20" fill="none" stroke="#fff" strokeWidth="2.5" className="route-line" />
            <circle cx="590" cy="20" r="6" fill="#fff" />
          </svg>
          <div className="relative max-w-2xl">
            <p className="font-hand text-lg text-white/85 sm:text-xl">{note}</p>
            <h2 id="plan-trip-title" className="mt-2 text-[clamp(1.8rem,4.2vw,3.2rem)] font-semibold leading-[1.1]">
              {title}
            </h2>
            <p className="mt-5 text-base leading-7 text-white/85">{text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="light" onClick={() => enquire({ service, destination: '' })}>
                Plan my trip
              </Button>
              <Button href={whatsApp.quick(topic)} variant="whatsapp" external>
                <MessageCircle size={17} aria-hidden="true" />
                WhatsApp us
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  )
}

export default PlanTripBand

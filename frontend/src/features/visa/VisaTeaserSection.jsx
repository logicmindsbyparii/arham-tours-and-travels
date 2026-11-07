import { ArrowRight } from 'lucide-react'
import Container from '../../components/ui/Container.jsx'
import SectionHeading from '../../components/ui/SectionHeading.jsx'
import Button from '../../components/ui/Button.jsx'
import VisaFinder from './VisaFinder.jsx'
import { useSectionContent } from '../site/useSite.js'

const DEFAULTS = {
  eyebrow: 'Visa assistance',
  title: 'Visa documents & charges,',
  accent: 'instantly.',
  intro: 'Type your destination below to instantly see required paperwork and complete visa charges right here.',
}

function VisaTeaserSection() {
  const heading = useSectionContent('home.visa', DEFAULTS)

  if (!heading) return null

  return (
    <section id="visa" aria-labelledby="visa-teaser-heading" className="bg-paper py-20 sm:py-28 text-ink">
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            id="visa-teaser-heading"
            tone="dark"
            eyebrow={heading.eyebrow}
            accentTone="blue"
            title={heading.title}
            accent={heading.accent}
            intro={heading.intro}
          />
          <div className="shrink-0">
            <Button to="/visa">
              Visa assistance page
              <ArrowRight size={16} aria-hidden="true" />
            </Button>
          </div>
        </div>

        <div className="mt-12">
          <VisaFinder />
        </div>
      </Container>
    </section>
  )
}

export default VisaTeaserSection

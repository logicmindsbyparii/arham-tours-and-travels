import Container from '../../components/ui/Container.jsx'
import SectionHeading from '../../components/ui/SectionHeading.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import { useSite } from '../site/useSite.js'

// Renders nothing until real reviews are published in the admin panel
// (Testimonials), so the site never shows invented or placeholder reviews.
function TestimonialsSection() {
  const { testimonials } = useSite()
  if (testimonials.length === 0) return null

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="bg-paper-2 py-24 text-ink sm:py-32">
      <Container>
        <SectionHeading
          id="reviews-title"
          tone="dark"
          eyebrow="Traveller reviews"
          accentTone="blue"
          title="In our travellers'"
          accent="own words."
        />

        {/* CSS columns give a simple masonry layout for quotes of different lengths. */}
        <div className="mt-14 gap-6 sm:columns-2 lg:columns-3">
          {testimonials.map((item, index) => (
            <Reveal
              as="figure"
              key={item.id ?? item.name}
              delay={(index % 3) * 0.08}
              className="mb-6 break-inside-avoid rounded-[22px] bg-paper p-7 ring-1 ring-ink/10"
            >
              <span aria-hidden="true" className="block font-display text-6xl leading-[0.6] text-ember-deep">
                “
              </span>
              <blockquote className="mt-4 text-[0.95rem] leading-7 text-ink/85">
                <p>{item.quote}</p>
              </blockquote>
              {item.rating && (
                <p className="mt-4 text-sm text-ember-deep" aria-label={`Rated ${item.rating} out of 5`}>
                  {'★'.repeat(item.rating)}
                  <span className="text-ink/20">{'★'.repeat(5 - item.rating)}</span>
                </p>
              )}
              <figcaption className="mt-6 border-t border-ink/10 pt-5">
                <span className="block font-display text-xl text-ink">{item.name}</span>
                <span className="mt-1 block text-xs text-slate">
                  {[item.trip, item.source].filter(Boolean).join(' · ')}
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  )
}

export default TestimonialsSection

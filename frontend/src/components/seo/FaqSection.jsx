import { memo, useCallback, useId, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import Container from '../ui/Container.jsx'
import SectionHeading from '../ui/SectionHeading.jsx'
import Reveal from '../ui/Reveal.jsx'
import { JsonLd } from './Seo.jsx'
import { faqJsonLd } from '../../config/seo.js'

// One question. The answer slides open by animating the grid row from 0fr to
// 1fr, so it eases to its natural height whatever its length. It stays in the
// page while closed, for search engines. Memoised: opening one question only
// re-renders that question and the one that closes.
const FaqItem = memo(function FaqItem({ faq, index, open, onToggle, idPrefix }) {
  const buttonId = `${idPrefix}-q${index}`
  const panelId = `${idPrefix}-a${index}`

  return (
    <div className="py-1">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => onToggle(index)}
          className="flex min-h-14 w-full items-center justify-between gap-4 py-4 text-left text-base font-semibold text-ink transition-colors hover:text-sky-deep sm:text-lg"
        >
          {faq.question}
          <Plus
            size={20}
            aria-hidden="true"
            className={`shrink-0 text-sky-deep transition-transform duration-300 ease-out ${open ? 'rotate-45' : ''}`}
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-5 pr-8 text-sm leading-7 text-slate sm:text-base">{faq.answer}</p>
        </div>
      </div>
    </div>
  )
})

// Frequently asked questions as an accordion (one open at a time), plus
// FAQPage structured data so they can show up in search results. Renders
// nothing when the page has no published questions.
function FaqSection({ faqs, title = 'Questions we', accent = 'often hear.', intro }) {
  const idPrefix = useId()
  const [openIndex, setOpenIndex] = useState(0)
  const toggle = useCallback((index) => setOpenIndex((current) => (current === index ? -1 : index)), [])
  const structuredData = useMemo(() => faqJsonLd(faqs), [faqs])

  if (faqs.length === 0) return null

  return (
    <section aria-labelledby="faq-title" className="bg-paper-2 py-20 text-ink sm:py-28">
      <Container className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading id="faq-title" tone="dark" eyebrow="FAQ" accentTone="blue" title={title} accent={accent} intro={intro} />

        <Reveal delay={0.1} className="divide-y divide-ink/10 border-y border-ink/10">
          {faqs.map((faq, index) => (
            <FaqItem
              key={faq.question}
              faq={faq}
              index={index}
              open={openIndex === index}
              onToggle={toggle}
              idPrefix={idPrefix}
            />
          ))}
        </Reveal>
      </Container>
      <JsonLd data={structuredData} />
    </section>
  )
}

export default FaqSection

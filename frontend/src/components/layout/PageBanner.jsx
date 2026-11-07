import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Container from '../ui/Container.jsx'
import Reveal from '../ui/Reveal.jsx'
import SplitHeading from '../ui/SplitHeading.jsx'

const EASE = [0.16, 1, 0.3, 1]

// The photo banner at the top of every inner page: breadcrumb, the page's
// <h1>, a short intro and optional key facts. id="top" so "Back to top" and
// the logo's glide-up land here.
// facts: [{ value, label }], shown as a row of figures under the intro.
function PageBanner({ image, crumb, title, accent, accentClassName = 'text-leaf-soft', intro, facts, children }) {
  const reduceMotion = useReducedMotion()
  const { scrollY } = useScroll()
  const imageY = useTransform(scrollY, [0, 700], [0, reduceMotion ? 0 : 140])

  return (
    <section id="top" aria-labelledby="page-title" className="relative isolate overflow-hidden bg-ink pb-16 pt-28 sm:pb-24 sm:pt-36">
      <motion.img
        src={image}
        alt=""
        fetchPriority="high"
        style={{ y: imageY }}
        initial={{ scale: 1.15, opacity: 0 }}
        animate={{ scale: 1.05, opacity: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(15_23_42/0.88)_10%,rgb(15_23_42/0.55)_55%,rgb(15_23_42/0.25)_100%),linear-gradient(0deg,rgb(15_23_42/0.6),transparent_45%)]"
      />

      <Container>
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-sm text-mist">
            <li>
              <Link to="/" className="transition-colors hover:text-paper">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} />
            </li>
            <li aria-current="page" className="text-paper">
              {crumb}
            </li>
          </ol>
        </nav>

        <SplitHeading
          as="h1"
          id="page-title"
          text={title}
          accent={accent}
          accentClassName={accentClassName}
          className="mt-6 max-w-4xl text-[clamp(1.9rem,6vw,4.75rem)] font-semibold leading-[1.05] text-paper sm:mt-8"
        />
        {intro && (
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-xl text-base leading-7 text-paper/85 sm:mt-7 sm:text-lg sm:leading-8">{intro}</p>
          </Reveal>
        )}

        {facts && (
          <Reveal
            delay={0.3}
            as="dl"
            className="mt-10 grid max-w-3xl grid-cols-2 gap-6 border-t border-paper/20 pt-8 sm:mt-12 sm:grid-cols-4"
          >
            {facts.map((fact) => (
              <div key={fact.label} className="flex flex-col">
                <dt className="text-sm text-mist">{fact.label}</dt>
                {/* nowrap: a word or phone number is never split across lines. */}
                <dd className="order-first whitespace-nowrap font-display text-lg font-semibold text-paper min-[400px]:text-xl sm:text-2xl lg:text-[1.75rem]">
                  {fact.value}
                </dd>
              </div>
            ))}
          </Reveal>
        )}
        {children}
      </Container>
    </section>
  )
}

export default PageBanner

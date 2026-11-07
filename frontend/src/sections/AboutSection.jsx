import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import Container from '../components/ui/Container.jsx'
import Reveal from '../components/ui/Reveal.jsx'
import Button from '../components/ui/Button.jsx'
import { useSectionContent } from '../features/site/useSite.js'
import mountainValley from '../assets/images/mountain-valley.webp'
import hanoiTrainStreet from '../assets/images/hanoi-train-street.webp'

// Every fact here comes from arhamtours.in or its published package flyers.
const facts = [
  { value: 'Surat', label: 'Office on U M Road' },
  { value: 'Surat', label: 'Group departure city' },
  { value: 'Gujarati', label: 'Tour manager on group trips' },
  { value: 'All-in', label: 'Flights, stays, visas & sightseeing' },
]

// Built-in text; the admin can change it under Website content (home.about).
// Paragraphs in body are separated by a blank line.
const ABOUT = {
  eyebrow: 'About us',
  title: 'Your journey,',
  accent: 'planned from start to finish.',
  body: 'Arham Tours & Travels is the travel brand of Arham Holiday Designer LLP, based in Surat. We put together holidays where the flights, hotels, sightseeing and paperwork are arranged as one plan.\n\nOur group departures feature all-inclusive travel with a Gujarati tour manager travelling with the group. For trips closer to home, our Goa holidays let you choose the hotel that suits your budget.',
  image: mountainValley,
  imageAlt: 'Pine forests and a river valley below snow-capped mountains',
}

// Hidden when "Home: About us" is unpublished or deleted in Website content.
function AboutSection() {
  const about = useSectionContent('home.about', ABOUT)
  return about ? <AboutContent about={about} /> : null
}

function AboutContent({ about }) {
  const [lead, ...paragraphs] = about.body
    .split(/\n\s*\n/)
    .map((text) => text.trim())
    .filter(Boolean)
  const imagesRef = useRef(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: imagesRef, offset: ['start end', 'end start'] })
  const backY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [40, -40])
  const frontY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [90, -90])
  // The pair of photos turns slowly in 3D as it passes, the front one floating
  // ahead of the back one.
  const stackRotateY = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [16, -10])
  const stackRotateX = useTransform(scrollYProgress, [0, 1], reduceMotion ? [0, 0] : [6, -4])

  return (
    <section id="about" aria-labelledby="about-title" className="bg-paper py-24 text-ink sm:py-32">
      <Container className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
        <motion.div
          ref={imagesRef}
          style={{ rotateY: stackRotateY, rotateX: stackRotateX, transformPerspective: 1400 }}
          className="relative order-2 mx-auto w-full max-w-[540px] transform-3d lg:order-1"
        >
          <motion.div
            style={{ y: backY }}
            className="ml-auto w-[78%] overflow-hidden rounded-[24px] shadow-[0_40px_80px_-40px_rgb(15_23_42/0.35)]"
          >
            <img
              src={about.image}
              alt={about.imageAlt}
              decoding="async"
              className="aspect-[4/5] w-full object-cover"
            />
          </motion.div>
          <motion.div
            style={{ y: frontY, z: 90 }}
            className="absolute -bottom-6 left-2 w-[52%] sm:left-0 overflow-hidden rounded-[20px] border-[6px] border-paper shadow-[0_30px_60px_-25px_rgb(15_23_42/0.35)]"
          >
            <img
              src={hanoiTrainStreet}
              alt="Railway tracks running between houses and cafés on Hanoi Train Street"
              decoding="async"
              className="aspect-[4/5] w-full object-cover"
            />
          </motion.div>
          <p className="absolute -top-16 left-0 z-10 -rotate-6 font-hand text-[1.35rem] leading-none text-sky-deep [text-shadow:0_2px_14px_rgb(255_255_255/0.95)] sm:-top-20 sm:text-[1.7rem]">
            From Surat, to the world
          </p>
        </motion.div>

        <div className="order-1 lg:order-2">
          <Reveal>
            <span className="eyebrow text-sky-deep">{about.eyebrow}</span>
            <h2 id="about-title" className="mt-5 text-[clamp(2.3rem,5vw,4.2rem)] leading-[1.03]">
              {about.title} <em className="italic text-sky-deep">{about.accent}</em>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            {lead && <p className="mt-8 max-w-xl text-lg leading-8 text-slate">{lead}</p>}
            {paragraphs.map((text) => (
              <p key={text} className="mt-4 max-w-xl text-base leading-7 text-slate">
                {text}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.2} as="dl" className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-8 border-t border-ink/15 pt-10">
            {facts.map((fact) => (
              <div key={fact.label} className="flex min-w-0 flex-col">
                <dt className="text-sm text-slate">{fact.label}</dt>
                <dd className="order-first font-display text-[clamp(1.3rem,7vw,1.7rem)] text-ink sm:text-4xl">{fact.value}</dd>
              </div>
            ))}
          </Reveal>

          <Reveal delay={0.3} className="mt-12">
            <Button href="#contact">Talk to our team</Button>
          </Reveal>
        </div>
      </Container>
    </section>
  )
}

export default AboutSection

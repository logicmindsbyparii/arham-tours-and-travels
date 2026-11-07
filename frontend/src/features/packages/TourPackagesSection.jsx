import { useMemo, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Container from '../../components/ui/Container.jsx'
import Button from '../../components/ui/Button.jsx'
import SectionHeading from '../../components/ui/SectionHeading.jsx'
import Tabs from '../../components/ui/Tabs.jsx'
import Reveal from '../../components/ui/Reveal.jsx'
import PackageCard from './PackageCard.jsx'
import { PACKAGE_CATEGORIES, filterByCategory } from '../../data/packages.js'
import { useSectionContent, useSite } from '../site/useSite.js'

// Built-in heading; the admin can change it under Website content (home.packages).
const HEADING = {
  eyebrow: 'Tour packages',
  title: 'Journeys ready to',
  accent: 'book.',
  intro:
    'Group departures and holidays closer to home, with flights, stays and sightseeing arranged together. Prices are confirmed when you enquire.',
}

const HOME_LIMIT = 3

function TourPackagesSection() {
  const { packages } = useSite()
  const heading = useSectionContent('home.packages', HEADING)
  const [activeCategory, setActiveCategory] = useState('featured')
  const tabs = useMemo(
    () =>
      PACKAGE_CATEGORIES.map((category) => ({
        ...category,
        count: filterByCategory(packages, category.id).length,
      })),
    [packages],
  )
  const tabPackages = useMemo(() => filterByCategory(packages, activeCategory), [packages, activeCategory])
  // The home page shows the first three; "View more packages" opens the full list.
  const visiblePackages = tabPackages.slice(0, HOME_LIMIT)
  const allPackagesLink =
    activeCategory === 'featured' ? '/packages#results' : `/packages?type=${activeCategory}#results`
  const linkedCount = activeCategory === 'featured' ? packages.length : tabPackages.length

  return (
    <section id="packages" aria-labelledby={heading ? 'packages-title' : undefined} aria-label={heading ? undefined : 'Tour packages'} className="theme-light bg-ink py-24 sm:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          {heading && (
            <SectionHeading
              id="packages-title"
              eyebrow={heading.eyebrow}
              title={heading.title}
              accent={heading.accent}
              intro={heading.intro}
            />
          )}
          <Reveal delay={0.15}>
            <Tabs
              tabs={tabs}
              activeId={activeCategory}
              onChange={setActiveCategory}
              label="Package categories"
              idPrefix="packages"
              className="rounded-full bg-ink-2 p-1.5 ring-1 ring-paper/10"
            />
          </Reveal>
        </div>

        <div
          id="packages-panel"
          role="tabpanel"
          aria-labelledby={`packages-tab-${activeCategory}`}
          className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visiblePackages.map((item, index) => (
              <PackageCard key={`${activeCategory}-${item.id}`} item={item} index={index} />
            ))}
          </AnimatePresence>
          {visiblePackages.length === 0 && (
            <p className="col-span-full rounded-[22px] bg-white px-6 py-12 text-center text-sm text-mist ring-1 ring-paper/10">
              No packages in this category right now. Ask us about your trip and we will plan it.
            </p>
          )}
        </div>

        <div className="mt-12 flex flex-col items-start gap-6 border-t border-paper/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-2xl text-xs leading-6 text-mist">
            Prices, durations and inclusions are taken from Arham's published package flyers and may change with
            dates and availability. Hotels are as listed or similar. Your final quote confirms exactly what is included.
          </p>
          <Button to={allPackagesLink} className="shrink-0">
            View more packages
            {linkedCount > HOME_LIMIT && <span className="tabular-nums">({linkedCount})</span>}
            <ArrowRight size={17} aria-hidden="true" className="transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </div>
      </Container>
    </section>
  )
}

export default TourPackagesSection

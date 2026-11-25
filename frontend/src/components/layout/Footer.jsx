import { ArrowUp } from 'lucide-react'
import Logo from '../ui/Logo.jsx'
import Container from '../ui/Container.jsx'
import SiteLink from '../ui/SiteLink.jsx'
import { scrollToTop } from '../../hooks/useSmoothScroll.js'
import { useNavigation } from '../../data/navigation.js'
import { useBusiness } from '../../features/site/useSite.js'

function Footer() {
  const year = new Date().getFullYear()
  const business = useBusiness()
  const { footerLinks } = useNavigation()

  return (
    <footer className="relative overflow-hidden bg-ink pt-20 text-paper">
      <Container>
        <div className="grid gap-12 pb-8 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <SiteLink href="#top" aria-label={`${business.name}, home`} className="inline-block rounded-md">
              <Logo onDark />
            </SiteLink>
            <p className="mt-6 max-w-sm text-sm leading-7 text-mist">
              Group departures, holiday packages, flights, visas, cruises, passports and hotels, arranged by our{' '}
              {business.city} travel team.
            </p>
            {business.socialLinks.length > 0 && (
              <ul className="mt-6 flex flex-wrap gap-4 text-sm">
                {business.socialLinks.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-mist hover:text-paper">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            {Object.entries(footerLinks).map(([heading, links]) => (
              <nav key={heading} aria-label={`Footer: ${heading}`}>
                <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-ember-soft">{heading}</h2>
                <ul className="mt-5 space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <SiteLink href={link.href} className="text-sm text-mist transition-colors hover:text-paper">
                        {link.label}
                      </SiteLink>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}

            <div>
              <h2 className="font-sans text-xs font-bold uppercase tracking-[0.2em] text-ember-soft">Contact</h2>
              <ul className="mt-5 space-y-3 text-sm text-mist">
                {business.phones.map((phone) => (
                  <li key={phone.href}>
                    <a href={phone.href} className="hover:text-paper">
                      {phone.label}
                    </a>
                  </li>
                ))}
                {business.emails.map((email) => (
                  <li key={email}>
                    <a href={`mailto:${email}`} className="break-all hover:text-paper">
                      {email}
                    </a>
                  </li>
                ))}
                {business.addressLines.length > 0 && (
                  <li>
                    <a href={business.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-paper">
                      {business.addressLines.at(-1)}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Designed & Developed by Logic Minds by Parii */}
        <div className="flex items-center justify-center pb-6 pt-2">
          <a
            href="https://logicmindsbyparii.com/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Designed & Developed by Logic Minds by Parii (opens in a new tab)"
            className="group inline-flex flex-wrap items-center justify-center gap-2.5 text-xs text-mist/80 cursor-pointer transition-opacity hover:opacity-95"
          >
            <span className="hidden h-px w-10 bg-gradient-to-r from-transparent to-paper/20 sm:inline-block transition-all duration-300 group-hover:w-14 group-hover:to-sky-400/40" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-mist/60 transition-colors group-hover:text-mist">
              Designed &amp; Developed by
            </span>
            <span className="font-bold tracking-[0.16em] text-paper transition-colors duration-300 group-hover:text-sky-300">
              LOGIC MINDS
            </span>
            <span className="text-[12px] font-normal italic tracking-normal text-sky-400 transition-colors group-hover:text-sky-300">
              by Parii
            </span>
            <span className="hidden h-px w-10 bg-gradient-to-l from-transparent to-paper/20 sm:inline-block transition-all duration-300 group-hover:w-14 group-hover:to-sky-400/40" />
          </a>
        </div>

        <div className="border-t border-paper/10" />

        <div className="flex flex-col gap-4 py-8 text-xs text-mist sm:flex-row sm:items-center sm:justify-between">
          <p className="leading-relaxed text-mist/80">
            © {year} {business.name}, a brand of {business.legalName}. All rights reserved.
          </p>
          {/* Stays on the current page: only scrolls back up. */}
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-2 transition-colors duration-200 hover:text-paper cursor-pointer self-start sm:self-auto"
          >
            Back to top <ArrowUp size={14} aria-hidden="true" />
          </button>
        </div>
      </Container>

     
    </footer>
  )
}

export default Footer

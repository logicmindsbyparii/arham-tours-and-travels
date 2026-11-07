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
        <div className="grid gap-12 border-b border-paper/10 pb-14 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <SiteLink href="#top" aria-label={`${business.name}, home`} className="inline-block rounded-md">
              <Logo onDark />
            </SiteLink>
            <p className="mt-6 max-w-sm text-sm leading-7 text-mist">
              Group departures, holiday packages, flights, visas, hotels and cruises, arranged by our{' '}
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

        <div className="flex flex-col gap-4 py-8 text-xs text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {business.name}, a brand of {business.legalName}. Prices and itineraries are subject to
            confirmation. Destination photography via Unsplash.
          </p>
          {/* Stays on the current page: only scrolls back up. */}
          <button type="button" onClick={scrollToTop} className="inline-flex items-center gap-2 hover:text-paper">
            Back to top <ArrowUp size={14} aria-hidden="true" />
          </button>
        </div>
      </Container>

     
    </footer>
  )
}

export default Footer

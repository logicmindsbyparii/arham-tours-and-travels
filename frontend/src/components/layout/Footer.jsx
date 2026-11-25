import { ArrowUp, Sparkles } from 'lucide-react'
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

        {/* Designed & Developed by Logic Minds by Pari - 3D Signature Badge */}
        <div className="flex items-center justify-center pb-8 pt-2">
          <div className="group relative inline-flex items-center gap-3 rounded-2xl border-t border-white/20 border-b border-black/80 bg-gradient-to-b from-[#1e293b] via-[#0f172a] to-[#090d16] px-5 py-2.5 sm:px-6 sm:py-3 shadow-[0_16px_36px_-6px_rgba(0,0,0,0.9),0_0_28px_-4px_rgba(56,189,248,0.25),inset_0_1px_1px_rgba(255,255,255,0.25),inset_0_-2px_4px_rgba(0,0,0,0.8)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-6px_rgba(56,189,248,0.35),0_0_35px_rgba(56,189,248,0.3),inset_0_1px_2px_rgba(255,255,255,0.4)]">
            {/* 3D Glowing Icon Tile */}
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 via-sky-500 to-cyan-300 p-0.5 shadow-[0_4px_12px_rgba(56,189,248,0.45),inset_0_1px_1px_rgba(255,255,255,0.6)]">
              <Sparkles size={16} className="text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)] animate-pulse" />
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm sm:text-[15px]">
              <span className="font-normal text-slate-300 tracking-wide drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                Designed &amp; Developed by
              </span>
              <span className="font-black tracking-wider bg-gradient-to-r from-white via-sky-100 to-sky-300 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                Logic Minds
              </span>
              <span className="inline-flex items-center rounded-full bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 px-3 py-0.5 text-xs font-bold text-white shadow-[0_3px_10px_rgba(37,99,235,0.5),inset_0_1px_1px_rgba(255,255,255,0.5)] ring-1 ring-white/30 tracking-wide">
                by Pari
              </span>
            </div>
          </div>
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

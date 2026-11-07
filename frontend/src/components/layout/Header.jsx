import { useCallback, useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Menu, MessageCircle } from 'lucide-react'
import Logo from '../ui/Logo.jsx'
import Button from '../ui/Button.jsx'
import Container from '../ui/Container.jsx'
import SiteLink from '../ui/SiteLink.jsx'
import MobileMenu from './MobileMenu.jsx'
import NavDropdown from './NavDropdown.jsx'
import { useNavigation } from '../../data/navigation.js'
import { useWhatsApp } from '../../features/inquiry/whatsapp.js'
import { useActiveSection } from '../../hooks/useActiveSection.js'

// Each link's marker takes one colour of the theme, in turn.
const DOT_COLORS = ['bg-ember-soft', 'bg-sky-soft', 'bg-leaf-soft']

// Pages whose banner has a light background: the header uses dark text and
// the full-colour logo there even before the page is scrolled.
const LIGHT_BANNER_PATHS = ['/car-rental', '/contact']

function Header() {
  const { pathname } = useLocation()
  const { navLinks } = useNavigation()
  const whatsApp = useWhatsApp()
  const sectionIds = navLinks.filter((link) => link.href.startsWith('#')).map((link) => link.href.slice(1))
  const activeSection = useActiveSection(sectionIds, pathname)
  // Page links are current on their own page, section links while their
  // section is on screen on the home page.
  const isCurrent = (href) =>
    href.startsWith('#') ? pathname === '/' && activeSection === href.slice(1) : pathname === href
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButtonRef = useRef(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Closing the menu hands keyboard focus back to the button that opened it.
  const closeMenu = useCallback(() => {
    setMenuOpen((wasOpen) => {
      if (wasOpen) window.requestAnimationFrame(() => menuButtonRef.current?.focus())
      return false
    })
  }, [])
  const solid = scrolled || menuOpen
  const lightTop = !solid && LIGHT_BANNER_PATHS.includes(pathname)

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid
          ? 'theme-light bg-ink/95 shadow-[0_1px_0_rgb(15_23_42/0.08),0_10px_30px_-20px_rgb(15_23_42/0.35)] backdrop-blur-md'
          : lightTop
            ? 'theme-light bg-transparent'
            : 'bg-transparent'
      }`}
    >
      <Container className="flex h-[4.5rem] items-center justify-between gap-6">
        <SiteLink href="#top" aria-label="Arham Tours & Travels, home" onClick={closeMenu} className="rounded-md">
          <Logo onDark={!solid && !lightTop} />
        </SiteLink>

        {/* Hover: the label rolls up and a coloured diamond drops in above it. */}
        <nav aria-label="Main" className="hidden xl:block">
          <ul className="flex items-center gap-6">
            {navLinks.map((link, index) => {
              const current = isCurrent(link.href)
              const label = (
                <>
                  <span
                    aria-hidden="true"
                    className={`absolute -top-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 transition duration-500 ease-out-expo ${
                      DOT_COLORS[index % DOT_COLORS.length]
                    } ${current ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`}
                  />
                  <span className="relative block overflow-hidden">
                    <span className="block transition-transform duration-500 ease-out-expo group-hover:-translate-y-full">
                      {link.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 translate-y-full italic transition-transform duration-500 ease-out-expo group-hover:translate-y-0"
                    >
                      {link.label}
                    </span>
                  </span>
                </>
              )
              if (link.children) {
                return <NavDropdown key={link.href} link={link} current={current} label={label} />
              }
              return (
                <li key={link.href}>
                  <SiteLink
                    href={link.href}
                    aria-current={current ? (link.href.startsWith('#') ? 'location' : 'page') : undefined}
                    className={`group relative block whitespace-nowrap py-2 text-sm font-medium transition-colors ${
                      current ? 'text-paper' : 'text-paper/75 hover:text-paper'
                    }`}
                  >
                    {label}
                  </SiteLink>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <a
            href={whatsApp.quick('planning a trip')}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on WhatsApp (opens in a new tab)"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-paper/20 text-paper transition hover:border-paper/60 hover:bg-paper/10"
          >
            <MessageCircle size={19} aria-hidden="true" />
          </a>
          <Button href="#contact">Plan my trip</Button>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-paper/20 text-paper transition hover:border-paper/60 hover:bg-paper/10 xl:hidden"
        >
          <Menu size={22} aria-hidden="true" />
        </button>
      </Container>

      <MobileMenu open={menuOpen} onClose={closeMenu} isCurrent={isCurrent} />
    </header>
  )
}

export default Header

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import { ChevronDown, MessageCircle, Phone, X } from 'lucide-react'
import Logo from '../ui/Logo.jsx'
import Button from '../ui/Button.jsx'
import SiteLink from '../ui/SiteLink.jsx'
import KindIcon from '../ui/KindIcon.jsx'
import { useNavigation } from '../../data/navigation.js'
import { useBusiness } from '../../features/site/useSite.js'
import { useWhatsApp } from '../../features/inquiry/whatsapp.js'
import { getSmoothScroll } from '../../hooks/useSmoothScroll.js'

const EASE = [0.16, 1, 0.3, 1]

const list = {
  shown: { transition: { staggerChildren: 0.04, delayChildren: 0.12 } },
  hidden: {},
}
const row = {
  hidden: { opacity: 0, transform: 'translateY(14px)' },
  shown: { opacity: 1, transform: 'translateY(0px)', transition: { duration: 0.5, ease: EASE } },
}

const rowClass = (current) =>
  `group flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3.5 text-left text-[1.05rem] font-medium transition-colors duration-300 ${
    current ? 'bg-sky/[0.08] text-sky-deep' : 'text-ink hover:bg-paper-2'
  }`

// The open sheet. Mounted fresh on every open, so the accordion of the
// section you are in starts open.
function MenuSheet({ onClose, isCurrent }) {
  const panelRef = useRef(null)
  const { pathname } = useLocation()
  const { navLinks } = useNavigation()
  const business = useBusiness()
  const whatsApp = useWhatsApp()
  const [expanded, setExpanded] = useState(
    () => navLinks.find((link) => link.children && pathname.startsWith(link.href))?.href ?? null,
  )

  // While open: hold the page still, close on Escape, keep Tab inside the
  // menu and start keyboard focus on the first row.
  useEffect(() => {
    const lenis = getSmoothScroll()
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !panelRef.current) return
      const focusable = [...panelRef.current.querySelectorAll('a[href], button:not([disabled])')]
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    const focusTimer = window.setTimeout(() => panelRef.current?.querySelector('[data-menu-link]')?.focus(), 300)

    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener('keydown', handleKeyDown)
      document.documentElement.style.overflow = ''
      lenis?.start()
    }
  }, [onClose])

  return (
    <>
      {/* Clear backdrop: the page stays visible below the menu; a tap there closes it. */}
      <motion.div
        aria-hidden="true"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[79] bg-ink/10 xl:hidden"
      />
      <motion.nav
        ref={panelRef}
        id="mobile-menu"
        aria-label="Mobile"
        data-lenis-prevent
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: 'inset(0 0 0% 0)' }}
        exit={{ clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.45, ease: [0.7, 0, 0.84, 0] } }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed inset-x-0 top-0 z-[80] flex max-h-[100dvh] flex-col bg-white text-ink shadow-[0_30px_60px_-30px_rgb(15_23_42/0.45)] xl:hidden"
      >
        {/* Top bar */}
        <div className="border-b border-ink/10 bg-paper-2/70">
          <div className="mx-auto flex h-[4.5rem] w-full max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
            <SiteLink href="#top" onClick={onClose} aria-label="Arham Tours & Travels, home" className="rounded-md">
              <Logo />
            </SiteLink>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close menu"
              className="group flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-ink ring-1 ring-ink/10 transition hover:bg-ink hover:text-white"
            >
              <X size={22} aria-hidden="true" className="transition-transform duration-500 group-hover:rotate-90" />
            </button>
          </div>
        </div>

        <div className="min-h-0 overflow-y-auto overscroll-contain">
          <motion.div
            variants={list}
            initial="hidden"
            animate="shown"
            className="mx-auto flex w-full max-w-7xl flex-col px-3 pb-5 pt-4 sm:px-6"
          >
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const current = isCurrent(link.href)

                if (!link.children) {
                  return (
                    <motion.li key={link.href} variants={row}>
                      <SiteLink
                        data-menu-link
                        href={link.href}
                        onClick={onClose}
                        aria-current={current ? 'page' : undefined}
                        className={rowClass(current)}
                      >
                        {link.label}
                      </SiteLink>
                    </motion.li>
                  )
                }

                const isOpen = expanded === link.href
                const panelId = `menu-${link.label.toLowerCase()}`
                return (
                  <motion.li key={link.href} variants={row}>
                    <div
                      className={`flex w-full items-center justify-between rounded-xl transition-colors duration-300 ${
                        current || isOpen ? 'bg-sky/[0.08] text-sky-deep' : 'text-ink hover:bg-paper-2'
                      }`}
                    >
                      <SiteLink
                        data-menu-link
                        href={link.href}
                        onClick={onClose}
                        aria-current={current ? 'page' : undefined}
                        className="flex-1 px-4 py-3.5 text-left text-[1.05rem] font-medium"
                      >
                        {link.label}
                      </SiteLink>
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setExpanded(isOpen ? null : link.href)}
                        aria-label={`Toggle ${link.label} sub-items`}
                        className="flex h-12 w-12 items-center justify-center rounded-xl text-ink/60 transition hover:text-ink"
                      >
                        <ChevronDown
                          size={20}
                          aria-hidden="true"
                          className={`shrink-0 transition-transform duration-500 ease-out-expo ${isOpen ? 'rotate-180' : ''}`}
                        />
                      </button>
                    </div>
                    {/* Accordion: the height eases open, the links slide in after it */}
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.ul
                          id={panelId}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ height: { duration: 0.45, ease: EASE }, opacity: { duration: 0.3 } }}
                          className="overflow-hidden"
                        >
                          {link.children.map((child, index) => (
                            <motion.li
                              key={child.href}
                              initial={{ opacity: 0, transform: 'translateX(-10px)' }}
                              animate={{ opacity: 1, transform: 'translateX(0px)' }}
                              transition={{ duration: 0.4, delay: 0.08 + index * 0.05, ease: EASE }}
                            >
                              <SiteLink
                                href={child.href}
                                onClick={onClose}
                                className="group flex items-center gap-3 rounded-xl py-3 pl-9 pr-4 text-[0.95rem] text-slate transition-colors hover:bg-paper-2 hover:text-ink"
                              >
                                <span className="flex w-6 justify-center">
                                  <KindIcon kind={child.kind} />
                                </span>
                                <span className="flex-1">{child.label}</span>
                                <span className="rounded-full bg-paper-2 px-2 py-0.5 text-xs font-semibold tabular-nums text-slate transition-colors group-hover:bg-white">
                                  {child.count}
                                </span>
                              </SiteLink>
                            </motion.li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </motion.li>
                )
              })}
            </ul>

            {/* Actions */}
            <motion.div variants={row} className="px-1 pt-4">
              <Button href="#contact" onClick={onClose} className="w-full rounded-xl! text-base">
                Plan a custom tour
              </Button>
              <div className={`mt-3 grid gap-3 ${business.phones.length > 0 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                {business.phones.length > 0 && (
                  <Button href={business.phones[0].href} variant="outlineDark" className="rounded-xl! px-3!">
                    <Phone size={16} aria-hidden="true" />
                    Call us
                  </Button>
                )}
                <Button
                  href={whatsApp.quick('planning a trip')}
                  variant="whatsapp"
                  external
                  className="rounded-xl! px-3!"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  WhatsApp
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.nav>
    </>
  )
}

// The menu below the xl breakpoint: a clean white sheet that unrolls down from
// the top, only as tall as its links (the page stays in view below), with the rows rising in one after another.
// Packages and Destinations open an accordion of their sub-pages. Rendered
// into <body> so the blurred header never becomes its positioning box.
function MobileMenu({ open, onClose, isCurrent }) {
  return createPortal(
    <AnimatePresence>{open && <MenuSheet onClose={onClose} isCurrent={isCurrent} />}</AnimatePresence>,
    document.body,
  )
}

export default MobileMenu

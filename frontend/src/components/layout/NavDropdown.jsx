import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronDown } from 'lucide-react'
import SiteLink from '../ui/SiteLink.jsx'
import KindIcon from '../ui/KindIcon.jsx'

const EASE = [0.16, 1, 0.3, 1]
// Grace period before closing, so moving the mouse from the label down to
// the panel never closes it on the way.
const CLOSE_DELAY = 140

const TILE_TONES = {
  all: 'bg-ember/10',
  domestic: 'bg-leaf/10',
  international: 'bg-sky/10',
}

// A main-menu entry with a drop-down of its sub-pages (All / Domestic /
// International). Opens on hover, on click or tap, and with Enter, Space or
// Arrow Down from the keyboard; closes on leaving, Escape or an outside click.
// `label` is the rendered label of the entry, so it matches the plain links.
function NavDropdown({ link, current, label }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)
  const buttonRef = useRef(null)
  const closeTimer = useRef(null)
  const panelId = useId()

  const show = () => {
    window.clearTimeout(closeTimer.current)
    setOpen(true)
  }
  const hideSoon = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY)
  }

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  useEffect(() => {
    if (!open) return undefined
    const handlePointer = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    const handleKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('pointerdown', handlePointer)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('pointerdown', handlePointer)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const [all, ...kinds] = link.children

  return (
    <li
      ref={rootRef}
      className="relative"
      onPointerEnter={(event) => event.pointerType === 'mouse' && show()}
      onPointerLeave={(event) => event.pointerType === 'mouse' && hideSoon()}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <div className="flex items-center">
        <SiteLink
          ref={buttonRef}
          href={link.href}
          onClick={() => setOpen(false)}
          className={`group relative flex items-center whitespace-nowrap py-2 text-sm font-medium transition-colors ${
            current || open ? 'text-paper' : 'text-paper/75 hover:text-paper'
          }`}
        >
          {label}
        </SiteLink>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`Toggle ${link.label} options`}
          onClick={(e) => {
            e.stopPropagation()
            setOpen((value) => !value)
          }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              setOpen(true)
              window.requestAnimationFrame(() => rootRef.current?.querySelector('[data-dropdown-link]')?.focus())
            }
          }}
          className="p-1 text-paper/75 transition-colors hover:text-paper"
        >
          <ChevronDown
            size={15}
            aria-hidden="true"
            className={`transition-transform duration-500 ease-out-expo ${open ? 'rotate-180' : ''}`}
          />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: 10, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98, transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease: EASE }}
            // pt-3 bridges the gap below the label, so the pointer never leaves the item.
            className="theme-base absolute left-1/2 top-full z-50 w-[22rem] -translate-x-1/2 origin-top pt-3"
          >
            <div className="overflow-hidden rounded-2xl bg-white p-2 text-ink shadow-[0_30px_60px_-20px_rgb(15_23_42/0.4)] ring-1 ring-ink/10">
              <ul>
                {kinds.map((child, index) => (
                  <motion.li
                    key={child.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.05 + index * 0.05, ease: EASE }}
                  >
                    <SiteLink
                      data-dropdown-link
                      href={child.href}
                      onClick={() => setOpen(false)}
                      className="group/item flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-paper-2 focus-visible:bg-paper-2"
                    >
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform duration-500 ease-out-expo group-hover/item:scale-110 ${TILE_TONES[child.kind]}`}
                      >
                        <KindIcon kind={child.kind} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold text-ink">{child.label}</span>
                        <span className="block text-xs text-slate">{child.note}</span>
                      </span>
                      <span className="rounded-full bg-paper-2 px-2 py-0.5 text-xs font-semibold tabular-nums text-slate transition-colors group-hover/item:bg-white">
                        {child.count}
                      </span>
                    </SiteLink>
                  </motion.li>
                ))}
              </ul>
              <SiteLink
                data-dropdown-link
                href={all.href}
                onClick={() => setOpen(false)}
                className="group/all mt-1 flex items-center justify-between rounded-xl bg-paper-2 px-4 py-3 text-sm font-semibold text-ink transition-colors hover:bg-ink hover:text-white focus-visible:bg-ink focus-visible:text-white"
              >
                <span className="flex items-center gap-2.5">
                  <KindIcon kind="all" className="group-hover/all:text-white" />
                  {all.label}
                  <span className="text-xs font-normal opacity-60">{all.count}</span>
                </span>
                <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-500 ease-out-expo group-hover/all:translate-x-1" />
              </SiteLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

export default NavDropdown

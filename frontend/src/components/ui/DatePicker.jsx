import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useFloatingPanel } from '../../hooks/useFloatingPanel.js'

const PANEL_WIDTH = 320
const PANEL_HEIGHT = 420
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

// Dates travel as 'YYYY-MM-DD' strings in local time, like a native date input.
const toIso = (date) => date.toLocaleDateString('en-CA')
const fromIso = (iso) => {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}
const addDays = (date, days) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days)
const addMonths = (date, months) => {
  const target = new Date(date.getFullYear(), date.getMonth() + months, 1)
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  return new Date(target.getFullYear(), target.getMonth(), Math.min(date.getDate(), lastDay))
}
const formatLong = (date) =>
  date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

// A styled calendar that replaces the native date input, whose pop-up the
// browser draws and CSS cannot style. Arrow keys move by day and week,
// Page Up / Page Down by month, Home / End to the week's ends, Enter picks and
// Escape closes. onChange receives { target: { name, value } } with
// 'YYYY-MM-DD' (or '' when cleared), like a native input, so form handlers
// work unchanged. Other props (aria-invalid, ...) go to the trigger button.
function DatePicker({ id, name, value, onChange, min, placeholder = 'Pick a date', className = '', ...props }) {
  const autoId = useId()
  const triggerId = id ?? autoId
  const panelId = `${triggerId}-calendar`
  const today = new Date()
  const todayIso = toIso(today)
  const minDate = min ? fromIso(min) : null
  const selected = value ? fromIso(value) : null

  const [open, setOpen] = useState(false)
  const [focused, setFocused] = useState(selected ?? today)
  const [direction, setDirection] = useState(0)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const panelRef = useRef(null)
  const gridRef = useRef(null)
  const { up, style } = useFloatingPanel(triggerRef, open, {
    width: PANEL_WIDTH,
    height: PANEL_HEIGHT,
  })

  const isDisabled = (date) => Boolean(minDate && date < minDate)
  const clampToMin = (date) => (isDisabled(date) ? minDate : date)

  const openPanel = () => {
    setFocused(clampToMin(selected ?? today))
    setDirection(0)
    setOpen(true)
  }

  const close = (refocus = true) => {
    setOpen(false)
    if (refocus) triggerRef.current.focus()
  }

  const choose = (date) => {
    if (isDisabled(date)) return
    onChange?.({ target: { name, value: toIso(date) } })
    close()
  }

  const moveTo = (date) => {
    const next = clampToMin(date)
    const monthStep = (next.getFullYear() - focused.getFullYear()) * 12 + next.getMonth() - focused.getMonth()
    if (monthStep) setDirection(Math.sign(monthStep))
    setFocused(next)
  }

  // Close on a click anywhere else.
  useEffect(() => {
    if (!open) return
    const handlePointer = (event) => {
      if (!rootRef.current.contains(event.target) && !panelRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointer)
    return () => document.removeEventListener('pointerdown', handlePointer)
  }, [open])

  // Keep keyboard focus on the highlighted day.
  useEffect(() => {
    if (open) gridRef.current?.querySelector('[data-focused="true"]')?.focus({ preventScroll: true })
  }, [open, focused])

  const handleGridKey = (event) => {
    const moves = {
      ArrowLeft: () => addDays(focused, -1),
      ArrowRight: () => addDays(focused, 1),
      ArrowUp: () => addDays(focused, -7),
      ArrowDown: () => addDays(focused, 7),
      PageUp: () => addMonths(focused, -1),
      PageDown: () => addMonths(focused, 1),
      Home: () => addDays(focused, -focused.getDay()),
      End: () => addDays(focused, 6 - focused.getDay()),
    }
    if (moves[event.key]) {
      event.preventDefault()
      moveTo(moves[event.key]())
    }
  }

  const handlePanelKey = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
    } else if (event.key === 'Tab') {
      // The panel lives in a portal, so keep Tab cycling inside it.
      const focusable = [...panelRef.current.querySelectorAll('button:not([disabled])')].filter(
        (button) => button.tabIndex >= 0,
      )
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
  }

  // The month on show: leading blanks, then every day of the month.
  const year = focused.getFullYear()
  const month = focused.getMonth()
  const firstWeekday = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => new Date(year, month, index + 1)),
  ]
  const monthLabel = focused.toLocaleDateString('en-IN', {
    month: 'long',
    year: 'numeric',
  })
  const canGoBack = !minDate || new Date(year, month, 1) > minDate

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? close(false) : openPanel())}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown' && !open) {
            event.preventDefault()
            openPanel()
          }
        }}
        {...props}
        className={`group flex w-full items-center justify-between gap-3 text-left ${className} ${open ? 'ring-2 ring-sky' : ''}`}
      >
        <span className={`truncate ${selected ? '' : 'text-slate/70'}`}>
          {selected ? formatLong(selected) : placeholder}
        </span>
        <CalendarDays
          size={18}
          aria-hidden="true"
          className={`shrink-0 transition-colors duration-300 ${open ? 'text-sky' : 'text-slate group-hover:text-sky'}`}
        />
      </button>
      {/* Lets a form post the value like a native date input. */}
      {name && <input type="hidden" name={name} value={value ?? ''} />}

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              ref={panelRef}
              id={panelId}
              role="dialog"
              aria-modal="false"
              aria-label="Choose a date"
              onKeyDown={handlePanelKey}
              initial={{ opacity: 0, y: up ? 10 : -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: up ? 6 : -6,
                scale: 0.98,
                transition: { duration: 0.15 },
              }}
              transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
              style={style}
              data-lenis-prevent
              className={`z-60 select-none overflow-y-auto overscroll-contain rounded-3xl bg-white p-4 font-sans text-ink shadow-[0_30px_60px_-20px_rgb(15_23_42/0.45)] ring-1 ring-ink/10 ${
                up ? 'origin-bottom' : 'origin-top'
              }`}
            >
              {/* Month header */}
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => moveTo(addMonths(focused, -1))}
                  disabled={!canGoBack}
                  aria-label="Previous month"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink ring-1 ring-ink/10 transition hover:bg-sky hover:text-white hover:ring-sky disabled:pointer-events-none disabled:opacity-30"
                >
                  <ChevronLeft size={18} aria-hidden="true" />
                </button>
                <p aria-live="polite" className="font-sans text-[0.95rem] font-bold tracking-[-0.01em]">
                  {monthLabel}
                </p>
                <button
                  type="button"
                  onClick={() => moveTo(addMonths(focused, 1))}
                  aria-label="Next month"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink ring-1 ring-ink/10 transition hover:bg-sky hover:text-white hover:ring-sky"
                >
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
              </div>

              <div className="mt-4 grid grid-cols-7 text-center text-[0.68rem] font-bold uppercase tracking-[0.12em] text-slate">
                {WEEKDAYS.map((day) => (
                  <span key={day} className={day === 'Su' ? 'text-ember-deep' : ''}>
                    {day}
                  </span>
                ))}
              </div>

              <div className="relative -mx-1 mt-1 overflow-hidden p-1">
                <AnimatePresence mode="popLayout" initial={false} custom={direction}>
                  <motion.div
                    key={`${year}-${month}`}
                    ref={gridRef}
                    role="grid"
                    aria-label={monthLabel}
                    onKeyDown={handleGridKey}
                    custom={direction}
                    variants={{
                      enter: (dir) => ({ opacity: 0, x: dir * 40 }),
                      center: { opacity: 1, x: 0 },
                      exit: (dir) => ({ opacity: 0, x: dir * -40 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="grid grid-cols-7 gap-1"
                  >
                    {cells.map((date, index) => {
                      if (!date) return <span key={`blank-${index}`} aria-hidden="true" />
                      const iso = toIso(date)
                      const isSelected = iso === value
                      const isToday = iso === todayIso
                      const isFocused = iso === toIso(focused)
                      const disabled = isDisabled(date)
                      return (
                        <button
                          key={iso}
                          type="button"
                          role="gridcell"
                          tabIndex={isFocused ? 0 : -1}
                          data-focused={isFocused}
                          aria-selected={isSelected}
                          aria-current={isToday ? 'date' : undefined}
                          aria-label={formatLong(date)}
                          disabled={disabled}
                          onClick={() => choose(date)}
                          className={`relative flex aspect-square items-center justify-center rounded-xl text-sm transition-[background-color,color,transform] focus-visible:outline-offset-1 ${
                            isSelected
                              ? 'bg-[linear-gradient(135deg,#2563eb,#15803d)] font-bold text-white shadow-[0_10px_20px_-10px_rgb(37_99_235/0.9)]'
                              : disabled
                                ? 'cursor-not-allowed text-slate/35'
                                : 'font-medium text-ink hover:-translate-y-0.5 hover:bg-sky/10 hover:text-sky-deep'
                          }`}
                        >
                          {date.getDate()}
                          {isToday && (
                            <span
                              aria-hidden="true"
                              className={`absolute bottom-1.5 h-1 w-1 rounded-full ${isSelected ? 'bg-white' : 'bg-ember'}`}
                            />
                          )}
                        </button>
                      )
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-ink/10 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    onChange?.({ target: { name, value: '' } })
                    close()
                  }}
                  className="rounded-full px-3 py-1.5 text-sm font-semibold text-slate transition hover:bg-ember/10 hover:text-ember-deep"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => choose(today)}
                  disabled={isDisabled(fromIso(todayIso))}
                  className="rounded-full bg-sky/10 px-4 py-1.5 text-sm font-semibold text-sky-deep transition hover:bg-sky hover:text-white disabled:opacity-40"
                >
                  Today
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}

export default DatePicker

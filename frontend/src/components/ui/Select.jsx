import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, ChevronDown } from 'lucide-react'
import { useFloatingPanel } from '../../hooks/useFloatingPanel.js'

const LIST_MAX_HEIGHT = 288

// A styled drop-down that replaces the native <select>, whose open list the
// browser draws and CSS cannot style. It follows the WAI-ARIA "select-only
// combobox" pattern: Enter, Space or Arrow keys open it, Arrow keys, Home and
// End move, typing a letter jumps to the next option starting with it, Enter
// picks, Escape and Tab close. onChange receives { target: { name, value } },
// like a native select, so form handlers work unchanged.
//
// options: strings, or { value, label } objects. placeholder: shown while the
// value is empty. Other props (aria-invalid, aria-describedby, ...) go to the
// trigger button; `id` lets a <label htmlFor> point at it.
function Select({ id, name, value, onChange, options, placeholder, className = '', tone = 'light', ...props }) {
  const autoId = useId()
  const triggerId = id ?? autoId
  const listId = `${triggerId}-list`
  const items = options.map((option) => (typeof option === 'string' ? { value: option, label: option } : option))
  const selectedIndex = items.findIndex((item) => item.value === value)
  const selected = items[selectedIndex]

  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(Math.max(selectedIndex, 0))
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const listRef = useRef(null)
  const listHeight = Math.min(items.length * 42 + 12, LIST_MAX_HEIGHT)
  const { up: openUp, style } = useFloatingPanel(triggerRef, open, { minWidth: 220, height: listHeight })

  const openList = (index = Math.max(selectedIndex, 0)) => {
    setActiveIndex(index)
    setOpen(true)
  }

  const choose = (index) => {
    onChange?.({ target: { name, value: items[index].value } })
    setOpen(false)
    triggerRef.current.focus()
  }

  // Close on a click anywhere else.
  useEffect(() => {
    if (!open) return
    const handlePointer = (event) => {
      if (!rootRef.current.contains(event.target) && !listRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', handlePointer)
    return () => document.removeEventListener('pointerdown', handlePointer)
  }, [open])

  // Keep the highlighted option in view.
  useEffect(() => {
    if (open)
      listRef.current?.children[activeIndex]?.scrollIntoView({
        block: 'nearest',
      })
  }, [open, activeIndex])

  const jumpToLetter = (key) => {
    const start = open ? activeIndex + 1 : selectedIndex + 1
    for (let step = 0; step < items.length; step++) {
      const index = (start + step) % items.length
      if (items[index].label.toLowerCase().startsWith(key)) return index
    }
    return -1
  }

  const handleKeyDown = (event) => {
    const last = items.length - 1
    if (!open) {
      if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
        event.preventDefault()
        openList()
      } else if (event.key.length === 1 && /\S/.test(event.key)) {
        const index = jumpToLetter(event.key.toLowerCase())
        if (index >= 0) onChange?.({ target: { name, value: items[index].value } })
      }
      return
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        setActiveIndex((index) => Math.min(index + 1, last))
        break
      case 'ArrowUp':
        event.preventDefault()
        setActiveIndex((index) => Math.max(index - 1, 0))
        break
      case 'Home':
        event.preventDefault()
        setActiveIndex(0)
        break
      case 'End':
        event.preventDefault()
        setActiveIndex(last)
        break
      case 'Enter':
      case ' ':
        event.preventDefault()
        choose(activeIndex)
        break
      case 'Escape':
        event.preventDefault()
        setOpen(false)
        break
      case 'Tab':
        setOpen(false)
        break
      default:
        if (event.key.length === 1 && /\S/.test(event.key)) {
          const index = jumpToLetter(event.key.toLowerCase())
          if (index >= 0) setActiveIndex(index)
        }
    }
  }

  const dark = tone === 'dark'

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={handleKeyDown}
        {...props}
        className={`group flex w-full items-center justify-between gap-3 text-left ${className} ${
          open ? 'ring-2 ring-sky' : ''
        }`}
      >
        <span className={`truncate ${selected ? '' : 'text-slate/70'}`}>{selected ? selected.label : placeholder}</span>
        <ChevronDown
          size={18}
          aria-hidden="true"
          className={`shrink-0 text-slate transition-transform duration-300 ${open ? 'rotate-180 text-sky' : 'group-hover:translate-y-0.5'}`}
        />
      </button>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.ul
              ref={listRef}
              id={listId}
              role="listbox"
              aria-labelledby={triggerId}
              tabIndex={-1}
              data-lenis-prevent
              initial={{ opacity: 0, y: openUp ? 8 : -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: openUp ? 6 : -6,
                scale: 0.98,
                transition: { duration: 0.15 },
              }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
              style={{
                ...style,
                maxHeight: Math.min(style.maxHeight ?? LIST_MAX_HEIGHT, LIST_MAX_HEIGHT),
              }}
              className={`z-60 overflow-y-auto overscroll-contain rounded-2xl p-1.5 font-sans shadow-[0_24px_50px_-18px_rgb(15_23_42/0.45)] ring-1 ${
                openUp ? 'origin-bottom' : 'origin-top'
              } ${dark ? 'bg-ink-2 ring-white/10' : 'bg-white ring-ink/10'}`}
            >
              {items.map((item, index) => {
                const isSelected = index === selectedIndex
                const isActive = index === activeIndex
                return (
                  <li
                    key={item.value}
                    id={`${listId}-${index}`}
                    role="option"
                    aria-selected={isSelected}
                    onPointerEnter={() => setActiveIndex(index)}
                    onClick={() => choose(index)}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-sm transition-colors ${
                      isActive ? (dark ? 'bg-white/10' : 'bg-sky/10') : ''
                    } ${isSelected ? 'font-semibold text-sky-deep' : dark ? 'text-white' : 'text-ink'}`}
                  >
                    <span className="truncate">{item.label}</span>
                    {isSelected && <Check size={16} aria-hidden="true" className="shrink-0" />}
                  </li>
                )
              })}
            </motion.ul>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </div>
  )
}

export default Select

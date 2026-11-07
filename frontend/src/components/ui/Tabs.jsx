import { useRef } from 'react'

const styles = {
  // Horizontal pills, used on dark (light) or paper (dark) backgrounds.
  pills: {
    list: 'no-scrollbar flex gap-1 overflow-x-auto',
    // On phones the pills share the row so every tab stays in view.
    tab: 'flex-1 shrink-0 whitespace-nowrap rounded-full px-3 py-2.5 text-[0.8rem] font-semibold transition-colors sm:flex-none sm:px-5 sm:text-sm',
    light: { active: 'bg-paper text-ink', idle: 'text-paper/75 hover:bg-paper/10 hover:text-paper' },
    dark: { active: 'bg-ink text-paper', idle: 'text-slate hover:bg-ink/5 hover:text-ink' },
  },
  // Large vertical list, used by the services section.
  list: {
    list: 'flex flex-col border-t border-ink/15',
    // Hover: a wash of colour sweeps in from the left and the label steps right.
    tab: 'group/tab relative isolate flex w-full items-baseline gap-5 overflow-hidden border-b border-ink/15 py-5 text-left font-display text-[clamp(1.5rem,3vw,2.3rem)] leading-tight transition-[color,padding] duration-500 ease-out-expo before:absolute before:inset-0 before:-z-10 before:origin-left before:scale-x-0 before:bg-[linear-gradient(90deg,rgb(43_122_75/0.14),rgb(31_111_178/0.06)_70%,transparent)] before:transition-transform before:duration-700 before:ease-out-expo hover:pl-4 hover:before:scale-x-100 aria-selected:pl-4 aria-selected:before:scale-x-100',
    dark: { active: 'text-ink', idle: 'text-ink/45 hover:text-ink/80' },
    light: { active: 'text-paper', idle: 'text-paper/45 hover:text-paper/80' },
  },
}

// Accessible tabs (WAI-ARIA tabs pattern): arrow keys, Home and End move
// between tabs. Pair them with an element whose id is `${idPrefix}-panel`.
function Tabs({ tabs, activeId, onChange, label, idPrefix, tone = 'light', variant = 'pills', className = '' }) {
  const tabRefs = useRef([])
  const vertical = variant === 'list'
  const style = styles[variant]
  const colors = style[tone]

  const handleKeyDown = (event, index) => {
    const lastIndex = tabs.length - 1
    const next = index === lastIndex ? 0 : index + 1
    const previous = index === 0 ? lastIndex : index - 1
    const nextIndex = {
      [vertical ? 'ArrowDown' : 'ArrowRight']: next,
      [vertical ? 'ArrowUp' : 'ArrowLeft']: previous,
      Home: 0,
      End: lastIndex,
    }[event.key]

    if (nextIndex === undefined) return
    event.preventDefault()
    onChange(tabs[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div
      role="tablist"
      aria-label={label}
      aria-orientation={vertical ? 'vertical' : 'horizontal'}
      className={`${style.list} ${className}`}
    >
      {tabs.map((tab, index) => {
        const isActive = tab.id === activeId
        return (
          <button
            key={tab.id}
            ref={(node) => {
              tabRefs.current[index] = node
            }}
            type="button"
            role="tab"
            id={`${idPrefix}-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`${idPrefix}-panel`}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={`${style.tab} ${isActive ? colors.active : colors.idle}`}
          >
            {vertical && (
              <span className="font-sans text-xs font-bold tabular-nums tracking-widest opacity-70 transition-colors group-hover/tab:text-leaf-deep group-aria-selected/tab:text-leaf-deep group-aria-selected/tab:opacity-100">
                {String(index + 1).padStart(2, '0')}
              </span>
            )}
            {tab.label}
            {tab.count !== undefined && <span className="ml-1.5 opacity-60 max-[379px]:hidden sm:ml-2">{tab.count}</span>}
          </button>
        )
      })}
    </div>
  )
}

export default Tabs

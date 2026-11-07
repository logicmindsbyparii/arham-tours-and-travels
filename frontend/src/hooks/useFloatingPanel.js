import { useLayoutEffect, useState } from 'react'

const EDGE = 8
// Room the fixed header takes at the top of the screen.
const HEADER_SPACE = 80

// Places a pop-up (drop-down list, calendar) next to its trigger with fixed
// positioning, so it can be rendered in a portal above every section instead
// of being clipped or covered by neighbouring 3D cards. It opens below the
// trigger whenever it fits there, otherwise above, and follows the trigger
// while the page scrolls.
//
// width: the panel width in px, or omit it to match the trigger.
// minWidth: the narrowest a trigger-wide panel may be.
// height: the panel's expected height, used to decide up or down.
export function useFloatingPanel(triggerRef, open, { width, minWidth = 0, height, gap = 8 }) {
  const [placement, setPlacement] = useState({ up: false, style: { position: 'fixed' } })

  useLayoutEffect(() => {
    if (!open) return undefined

    const place = () => {
      const box = triggerRef.current?.getBoundingClientRect()
      if (!box) return
      const viewWidth = window.innerWidth
      const viewHeight = window.innerHeight
      const panelWidth = Math.min(Math.max(width ?? box.width, minWidth), viewWidth - EDGE * 2)
      const below = viewHeight - box.bottom - gap - EDGE
      const above = box.top - gap - HEADER_SPACE
      const up = below < height && above > below

      // Line up with the trigger's left edge, or its right edge if that would
      // run off the screen.
      let left = box.left
      if (left + panelWidth > viewWidth - EDGE) left = box.right - panelWidth
      left = Math.max(EDGE, Math.min(left, viewWidth - panelWidth - EDGE))

      setPlacement({
        up,
        style: {
          position: 'fixed',
          left,
          width: panelWidth,
          ...(up ? { bottom: viewHeight - box.top + gap } : { top: box.bottom + gap }),
          maxHeight: Math.max(160, up ? above : below),
        },
      })
    }

    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open, triggerRef, width, minWidth, height, gap])

  return placement
}

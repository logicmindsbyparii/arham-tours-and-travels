import { useEffect, useState } from 'react'
import { getSmoothScroll } from './useSmoothScroll.js'

// True while the first-visit loader should show: until the page has loaded
// and at least `minMs` have passed (so the take-off plays out), and never
// longer than `maxMs` on a slow connection. Scrolling is locked meanwhile.
export function useFirstLoad(minMs, maxMs = 3800) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const root = document.documentElement
    root.style.overflow = 'hidden'
    getSmoothScroll()?.stop()

    const loaded = new Promise((resolve) => {
      if (document.readyState === 'complete') resolve()
      else window.addEventListener('load', resolve, { once: true })
    })
    const minimum = new Promise((resolve) => window.setTimeout(resolve, minMs))
    const maximum = new Promise((resolve) => window.setTimeout(resolve, maxMs))

    let cancelled = false
    Promise.race([Promise.all([loaded, minimum]), maximum]).then(() => {
      if (!cancelled) {
        root.style.overflow = ''
        getSmoothScroll()?.start()
        setLoading(false)
      }
    })

    return () => {
      cancelled = true
      root.style.overflow = ''
      getSmoothScroll()?.start()
    }
  }, [minMs, maxMs])

  return loading
}

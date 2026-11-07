import { useEffect } from 'react'
import Lenis from 'lenis'

let instance = null

// The running Lenis instance, or null when smooth scrolling is off.
export function getSmoothScroll() {
  return instance
}

// Weighted, inertial scrolling on desktop (touch keeps native scrolling).
// Anchor links glide to their section and stop clear of the fixed header.
// Skipped entirely for visitors who prefer reduced motion.
export function useSmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    instance = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.0,
      overscroll: true,
    })

    // Anchor links ("#contact") glide to their section. Lenis' own `anchors`
    // option is not used: it also caught router links to another page
    // ("/packages#results"), looked for the section before that page had
    // rendered and warned "Target not found". Router links call
    // preventDefault, so they are skipped here and ScrollManager scrolls to
    // the section once the new page is on screen.
    const handleAnchorClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
      const link = event.target instanceof Element ? event.target.closest('a[href*="#"]') : null
      if (!link) return
      const url = new URL(link.href, window.location.href)
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)))
      // No offset: Lenis already keeps the html scroll-padding-top (5rem)
      // clear of the fixed header, the same as ScrollManager's jumps.
      if (target) instance?.scrollTo(target)
    }
    window.addEventListener('click', handleAnchorClick)

    return () => {
      window.removeEventListener('click', handleAnchorClick)
      instance.destroy()
      instance = null
    }
  }, [])
}

// Glides to the top of the current page.
export function scrollToTop() {
  if (instance) instance.scrollTo(0)
  else window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}

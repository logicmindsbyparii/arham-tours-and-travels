import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getSmoothScroll } from '../../hooks/useSmoothScroll.js'

// Jumps straight to a target (the CSS scroll-padding keeps sections clear of
// the fixed header). Going through Lenis also cancels any glide it started on
// the previous page, since it handles "/#section" link clicks too.
function jumpTo(target) {
  const lenis = getSmoothScroll()
  if (lenis) {
    lenis.scrollTo(target, { immediate: true, force: true })
  } else if (typeof target === 'number') {
    window.scrollTo(0, target)
  } else {
    target.scrollIntoView()
  }
}

// On every link followed: go to the section named in the URL (e.g. /#about or
// /packages?type=domestic#results), or to the top of the new page. A page
// that only updates its own address (a filter tab writing ?type=) passes
// state { keepScroll: true } and stays where it is.
function ScrollManager() {
  const { pathname, hash, key, state } = useLocation()

  useEffect(() => {
    if (state?.keepScroll) return undefined
    const go = () => {
      const section = hash ? document.getElementById(hash.slice(1)) : null
      jumpTo(section ?? 0)
    }
    // Wait a frame so the new page's sections are in the document, then aim
    // again once images and fonts above the section have settled the layout.
    const frame = window.requestAnimationFrame(go)
    const settle = window.setTimeout(go, 400)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(settle)
    }
    // Only router navigations (a new key): plain same-page anchors are
    // handled by smooth scrolling.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, key])

  return null
}

export default ScrollManager

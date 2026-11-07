import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SITE_CHANGED_KEY, fetchSite, selectSiteState } from './siteSlice.js'

const MIN_GAP_MS = 2000
const POLL_MS = 30 * 1000

// Keeps the website in step with the admin panel. The published content is
// loaded when the site opens and again:
// - at once when the admin panel changes something, in this tab (stale) or in
//   another tab of the same browser (storage event);
// - when the visitor comes back to the tab or window;
// - every 30 seconds while the tab is visible (changes made on another device).
export function useSiteLoader() {
  const dispatch = useDispatch()
  const { status, stale, fetchedAt } = useSelector(selectSiteState)

  useEffect(() => {
    if (status === 'idle' || (stale && status !== 'loading')) dispatch(fetchSite())
  }, [dispatch, stale, status])

  useEffect(() => {
    const refresh = (force = false) => {
      if (document.visibilityState !== 'visible') return
      if (force || Date.now() - fetchedAt > MIN_GAP_MS) dispatch(fetchSite())
    }
    const onVisible = () => refresh()
    const onStorage = (event) => event.key === SITE_CHANGED_KEY && refresh(true)
    const timer = window.setInterval(onVisible, POLL_MS)

    document.addEventListener('visibilitychange', onVisible)
    window.addEventListener('focus', onVisible)
    window.addEventListener('storage', onStorage)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', onVisible)
      window.removeEventListener('focus', onVisible)
      window.removeEventListener('storage', onStorage)
    }
  }, [dispatch, fetchedAt])
}

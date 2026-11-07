import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { api } from '../lib/api.js'
import { announceSiteChange, markSiteStale } from '../features/site/siteSlice.js'

// Loads a GET endpoint and reloads it whenever the query changes or reload()
// is called. Returns { data, meta, loading, error, reload }.
export function useApiQuery(path, query) {
  const [state, setState] = useState({ data: null, meta: null, error: null, requestKey: null })
  const [version, setVersion] = useState(0)
  const queryKey = JSON.stringify(query ?? {})
  // The request the current state answers; loading until it matches.
  const requestKey = path ? `${path}|${queryKey}|${version}` : null

  useEffect(() => {
    if (!path) return undefined
    const controller = new AbortController()
    const key = `${path}|${queryKey}|${version}`
    api
      .get(path, { query: JSON.parse(queryKey), signal: controller.signal })
      .then((json) => setState({ data: json.data, meta: json.meta ?? null, error: null, requestKey: key }))
      .catch((error) => {
        if (error.name !== 'AbortError') setState((current) => ({ ...current, error, requestKey: key }))
      })
    return () => controller.abort()
  }, [path, queryKey, version])

  const reload = useCallback(() => setVersion((value) => value + 1), [])
  return { data: state.data, meta: state.meta, error: state.error, loading: state.requestKey !== requestKey, reload }
}

// Wraps a write request: tells the public website to reload its content
// after it succeeds (so deleted or unpublished items disappear there too).
export function useMutation() {
  const dispatch = useDispatch()
  return useCallback(
    async (method, path, body) => {
      const json = await api[method](path, ...(body === undefined ? [] : [body]))
      dispatch(markSiteStale())
      announceSiteChange()
      return json
    },
    [dispatch],
  )
}

// Search box, filters and page number of a list page. The search is sent to
// the server 300 ms after typing stops; any change goes back to page 1.
export function useListControls(initialFilters = {}) {
  const [search, setSearch] = useState('')
  const [q, setQ] = useState('')
  const [filters, setFilters] = useState(initialFilters)
  const [page, setPage] = useState(1)

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQ(search.trim())
      setPage(1)
    }, 300)
    return () => window.clearTimeout(timer)
  }, [search])

  const setFilter = useCallback((name, value) => {
    setFilters((current) => ({ ...current, [name]: value }))
    setPage(1)
  }, [])

  return { search, setSearch, q, filters, setFilter, page, setPage }
}

// Drop-down choices shared by the forms (packages, sections, icons).
export function useFormOptions() {
  const { data, error } = useApiQuery('/admin/options')
  return { options: data ?? { packages: [], contentSections: [], serviceIcons: [] }, error }
}

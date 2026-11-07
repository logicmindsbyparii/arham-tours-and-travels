import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api } from '../../lib/api.js'
import { fallbackSite } from './fallbackSite.js'

// Published website content from GET /public/site.
//
// The last successful answer is kept in this browser, so a package or
// destination deleted / unpublished in the admin panel never reappears, not
// even for a moment while the page loads or when the API is briefly
// unreachable. The built-in content (fallbackSite) is only used on a first
// visit before the API has ever answered.
const CACHE_KEY = 'arham:site:v1'

// Written by the admin panel after every change; website tabs open in the
// same browser see the storage event and reload at once (useSiteLoader).
export const SITE_CHANGED_KEY = 'arham:site:changed'

export function announceSiteChange() {
  try {
    window.localStorage.setItem(SITE_CHANGED_KEY, String(Date.now()))
  } catch {
    // Storage blocked: other tabs still refresh on focus and every 30 s.
  }
}

function readCache() {
  try {
    const cached = JSON.parse(window.localStorage.getItem(CACHE_KEY))
    if (!cached?.packages || !cached?.destinations) return null
    return {
      ...cached,
      visaCountries: Array.isArray(cached.visaCountries) && cached.visaCountries.length > 0 ? cached.visaCountries : fallbackSite.visaCountries,
    }
  } catch {
    return null
  }
}

function writeCache(json) {
  try {
    window.localStorage.setItem(CACHE_KEY, json)
  } catch {
    // Storage full or blocked (private mode): the site still works without it.
  }
}

export const fetchSite = createAsyncThunk(
  'site/fetch',
  async (_, { signal }) => {
    const { data } = await api.get('/public/site', { signal })
    return data
  },
  // Never two requests at once.
  { condition: (_, { getState }) => getState().site.status !== 'loading' },
)

const cached = typeof window === 'undefined' ? null : readCache()
// JSON of the content on screen, to skip updates that change nothing
// (including the first answer on a repeat visit, which usually matches the
// saved copy shown while it loaded).
let lastJson = cached ? JSON.stringify(cached) : ''

const siteSlice = createSlice({
  name: 'site',
  initialState: {
    data: cached ?? fallbackSite,
    source: cached ? 'cache' : 'bundled',
    status: 'idle',
    stale: false,
    fetchedAt: 0,
  },
  reducers: {
    // Called after every change in the admin panel, so the website reloads
    // its content the next time it is shown.
    markSiteStale: (state) => {
      state.stale = true
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSite.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchSite.fulfilled, (state, action) => {
        const data = action.payload
        state.status = 'ready'
        state.stale = false
        state.fetchedAt = Date.now()
        // The regular refresh usually brings back the same content. Keep the
        // current objects then, so nothing on the page re-renders.
        const json = JSON.stringify(data)
        if (state.source !== 'bundled' && json === lastJson) {
          state.source = 'api'
          return
        }
        lastJson = json
        // Business settings not saved yet in the admin: keep the built-in ones.
        state.data = {
          ...data,
          visaCountries: Array.isArray(data.visaCountries) && data.visaCountries.length > 0 ? data.visaCountries : fallbackSite.visaCountries,
          settings: data.settings ?? fallbackSite.settings,
          carRental: data.carRental ?? fallbackSite.carRental,
        }
        state.source = 'api'
        writeCache(json)
      })
      .addCase(fetchSite.rejected, (state, action) => {
        state.status = 'error'
        state.stale = false
        console.warn('Website content API unavailable; showing the last saved content.', action.error.message)
      })
  },
})

export const { markSiteStale } = siteSlice.actions

export const selectSiteState = (state) => state.site

export default siteSlice.reducer

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { api, setCsrfToken } from '../lib/api.js'

// Admin session state. The session itself lives in an HttpOnly cookie the
// browser sends automatically; the server checks it on every request. Here we
// only remember who is signed in and the CSRF token for write requests.

export const checkSession = createAsyncThunk('adminAuth/check', async () => {
  // /auth/session answers admin: null (not a 401) when nobody is signed in.
  const { data } = await api.get('/auth/session', { skipAuthRedirect: true })
  if (!data.admin) throw new Error('Not signed in')
  setCsrfToken(data.csrfToken)
  return data.admin
})

export const login = createAsyncThunk('adminAuth/login', async (credentials, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', credentials, { skipAuthRedirect: true })
    setCsrfToken(data.csrfToken)
    return data.admin
  } catch (error) {
    return rejectWithValue({ message: error.message, details: error.details, status: error.status })
  }
})

export const logout = createAsyncThunk('adminAuth/logout', async () => {
  try {
    await api.post('/auth/logout', undefined, { skipAuthRedirect: true })
  } finally {
    setCsrfToken('')
  }
})

const authSlice = createSlice({
  name: 'adminAuth',
  initialState: {
    // unknown: not checked yet; checking; authenticated; anonymous
    status: 'unknown',
    admin: null,
    notice: '',
  },
  reducers: {
    sessionExpired: (state, action) => {
      state.status = 'anonymous'
      state.admin = null
      state.notice = action.payload || 'Your session has ended. Please sign in again.'
      setCsrfToken('')
    },
    adminUpdated: (state, action) => {
      state.admin = action.payload
    },
    clearNotice: (state) => {
      state.notice = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(checkSession.pending, (state) => {
        state.status = 'checking'
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.admin = action.payload
      })
      .addCase(checkSession.rejected, (state) => {
        state.status = 'anonymous'
        state.admin = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'authenticated'
        state.admin = action.payload
        state.notice = ''
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'anonymous'
        state.admin = null
        state.notice = 'You have signed out.'
      })
      .addCase(logout.rejected, (state) => {
        // The cookie may still be valid on the server; the next request will tell.
        state.status = 'anonymous'
        state.admin = null
      })
  },
})

export const { sessionExpired, adminUpdated, clearNotice } = authSlice.actions

export const selectAdminAuth = (state) => state.adminAuth

export default authSlice.reducer

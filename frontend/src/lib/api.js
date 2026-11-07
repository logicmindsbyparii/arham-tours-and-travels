// The one HTTP client for the backend API. Every request:
// - goes to VITE_API_URL (e.g. http://localhost:5000/api/v1),
// - sends the admin session cookie (credentials: 'include'),
// - sends the CSRF token on writes once signed in,
// - turns failures into an ApiError with a message that can be shown as is.

const configured = import.meta.env.VITE_API_URL?.trim().replace(/\/$/, '')

// In development the API defaults to port 5000 on the same host name as the
// page (localhost or 127.0.0.1), so the browser treats them as one site and
// sends the admin session cookie.
export const API_URL =
  configured || (import.meta.env.DEV ? `${window.location.protocol}//${window.location.hostname}:5000/api/v1` : '')
export const API_ORIGIN = API_URL ? new URL(API_URL, window.location.origin).origin : ''

export class ApiError extends Error {
  constructor(message, { status = 0, details } = {}) {
    super(message)
    this.status = status
    this.details = details
  }
}

let csrfToken = ''
let onUnauthorized = null

export function setCsrfToken(token) {
  csrfToken = token || ''
}

// The admin app registers this to return to the sign-in page when a session ends.
export function setUnauthorizedHandler(handler) {
  onUnauthorized = handler
}

const WRITE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE'])

export async function request(method, path, { body, signal, query, skipAuthRedirect = false } = {}) {
  if (!API_URL) throw new ApiError('The website is not connected to the API. Set VITE_API_URL and rebuild.')

  const url = new URL(`${API_URL}${path}`)
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') url.searchParams.set(key, value)
    }
  }

  const headers = {}
  const isForm = body instanceof FormData
  if (body !== undefined && !isForm) headers['Content-Type'] = 'application/json'
  if (WRITE_METHODS.has(method) && csrfToken) headers['X-CSRF-Token'] = csrfToken

  let response
  try {
    response = await fetch(url, {
      method,
      headers,
      credentials: 'include',
      signal,
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
    })
  } catch (error) {
    if (error.name === 'AbortError') throw error
    throw new ApiError('Cannot reach the server. Check your internet connection and that the API is running.')
  }

  const json = await response.json().catch(() => null)
  if (response.ok && json?.success !== false) return json ?? { data: null }

  const message =
    json?.error?.message ||
    (response.status >= 500 ? 'The server had a problem. Please try again.' : `Request failed (${response.status})`)
  const error = new ApiError(message, { status: response.status, details: json?.error?.details })
  if (response.status === 401 && !skipAuthRedirect) onUnauthorized?.(error)
  throw error
}

export const api = {
  get: (path, options) => request('GET', path, options),
  post: (path, body, options) => request('POST', path, { ...options, body }),
  put: (path, body, options) => request('PUT', path, { ...options, body }),
  patch: (path, body, options) => request('PATCH', path, { ...options, body }),
  delete: (path, options) => request('DELETE', path, options),
}

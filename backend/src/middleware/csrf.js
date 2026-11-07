import crypto from 'node:crypto'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

// The CSRF token is an HMAC of the session id. The admin app receives it in the
// body of /auth/login and /auth/me (never in a cookie) and sends it back in the
// X-CSRF-Token header. Another site can make the browser send the session
// cookie, but it cannot read the token, so its forged requests are refused.
export function csrfTokenFor(jti) {
  return crypto.createHmac('sha256', env.csrfSecret).update(jti).digest('base64url')
}

function sameToken(a, b) {
  const left = Buffer.from(String(a))
  const right = Buffer.from(String(b))
  return left.length === right.length && crypto.timingSafeEqual(left, right)
}

// Browsers send Origin on cross-site and same-origin writes. A write coming
// from a page that is not one of the configured frontend origins is refused.
export function requireAllowedOrigin(req, _res, next) {
  if (SAFE_METHODS.has(req.method)) return next()
  const origin = req.get('origin')
  if (origin && !env.frontendOrigins.includes(origin)) {
    return next(ApiError.forbidden('Request origin is not allowed'))
  }
  next()
}

// Must run after requireAuth (needs req.session).
export function requireCsrf(req, _res, next) {
  if (SAFE_METHODS.has(req.method)) return next()
  const header = req.get('x-csrf-token')
  if (!header || !req.session || !sameToken(header, csrfTokenFor(req.session.jti))) {
    return next(ApiError.forbidden('Security token missing or invalid. Reload the page and try again.'))
  }
  next()
}

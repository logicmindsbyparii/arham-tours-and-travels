import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { Admin } from '../models/Admin.js'
import { Session } from '../models/Session.js'
import { ApiError } from '../utils/ApiError.js'
import { SESSION_COOKIE, clearSessionCookie } from '../services/authService.js'

// Verifies the session cookie on every admin request: a valid signature, an
// unexpired token, a session row that still exists (not signed out) and an
// active admin account. Sets req.admin and req.session.
export async function requireAuth(req, res, next) {
  const token = req.cookies?.[SESSION_COOKIE]
  if (!token) return next(ApiError.unauthorized())

  let payload
  try {
    payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'], issuer: 'arham-api', audience: 'arham-admin' })
  } catch {
    clearSessionCookie(res)
    return next(ApiError.unauthorized('Your session has expired. Please sign in again.'))
  }

  const session = await Session.findOne({ jti: payload.jti, admin: payload.sub })
  if (!session || session.expiresAt <= new Date()) {
    clearSessionCookie(res)
    return next(ApiError.unauthorized('Your session has ended. Please sign in again.'))
  }

  const admin = await Admin.findById(payload.sub)
  if (!admin || !admin.active) {
    await Session.deleteOne({ _id: session._id })
    clearSessionCookie(res)
    return next(ApiError.unauthorized('This account is not active.'))
  }

  req.admin = admin
  req.session = session
  next()
}

export function requireRole(...roles) {
  return (req, _res, next) => {
    if (!req.admin) return next(ApiError.unauthorized())
    if (!roles.includes(req.admin.role)) return next(ApiError.forbidden())
    next()
  }
}

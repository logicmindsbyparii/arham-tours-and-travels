import crypto from 'node:crypto'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { Admin } from '../models/Admin.js'
import { Session } from '../models/Session.js'
import { ApiError } from '../utils/ApiError.js'

export const SESSION_COOKIE = 'arham_admin_session'
export const BCRYPT_ROUNDS = 12

// Compared against when the email is unknown, so a wrong email takes as long
// as a wrong password and response times do not reveal which accounts exist.
const DUMMY_HASH = bcrypt.hashSync(crypto.randomBytes(16).toString('hex'), BCRYPT_ROUNDS)

export const hashPassword = (password) => bcrypt.hash(password, BCRYPT_ROUNDS)

function cookieOptions() {
  return {
    httpOnly: true,
    secure: env.cookie.secure,
    sameSite: env.cookie.sameSite,
    domain: env.cookie.domain,
    path: '/',
  }
}

export function setSessionCookie(res, token) {
  res.cookie(SESSION_COOKIE, token, { ...cookieOptions(), maxAge: env.sessionTtlHours * 60 * 60 * 1000 })
}

export function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, cookieOptions())
}

// Checks the credentials and opens a new session. Every failure gives the same
// message so it does not reveal whether the email exists.
export async function login(email, password, { ip, userAgent }) {
  const admin = await Admin.findOne({ email }).select('+passwordHash')
  const passwordOk = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH)
  if (!admin || !passwordOk || !admin.active) {
    throw ApiError.unauthorized('Incorrect email or password')
  }

  const jti = crypto.randomUUID()
  const expiresAt = new Date(Date.now() + env.sessionTtlHours * 60 * 60 * 1000)
  await Session.create({ admin: admin._id, jti, expiresAt, ip, userAgent: userAgent?.slice(0, 300) })

  admin.lastLoginAt = new Date()
  await admin.save()

  const token = jwt.sign({ sub: String(admin._id), jti }, env.jwtSecret, {
    algorithm: 'HS256',
    expiresIn: env.sessionTtlHours * 60 * 60,
    issuer: 'arham-api',
    audience: 'arham-admin',
  })

  return { admin, token, jti, expiresAt }
}

export async function endSession(sessionId) {
  await Session.deleteOne({ _id: sessionId })
}

// After a password change every other signed-in browser is signed out.
export async function endOtherSessions(adminId, keepSessionId) {
  await Session.deleteMany({ admin: adminId, _id: { $ne: keepSessionId } })
}

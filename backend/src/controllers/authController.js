import bcrypt from 'bcryptjs'
import { Admin } from '../models/Admin.js'
import { ApiError } from '../utils/ApiError.js'
import { ok } from '../utils/helpers.js'
import { csrfTokenFor } from '../middleware/csrf.js'
import { logActivity } from '../services/activityService.js'
import {
  clearSessionCookie,
  endOtherSessions,
  endSession,
  hashPassword,
  login as openSession,
  setSessionCookie,
} from '../services/authService.js'

const sessionInfo = (admin, jti, expiresAt) => ({
  admin,
  csrfToken: csrfTokenFor(jti),
  expiresAt,
})

export async function login(req, res) {
  const { email, password } = req.body
  const { admin, token, jti, expiresAt } = await openSession(email, password, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
  })
  setSessionCookie(res, token)
  await logActivity(req, { action: 'login', entityType: 'admin', entityId: admin._id, entityLabel: admin.email, admin })
  ok(res, sessionInfo(admin, jti, expiresAt), { message: 'Signed in' })
}

export async function me(req, res) {
  ok(res, sessionInfo(req.admin, req.session.jti, req.session.expiresAt))
}

export async function logout(req, res) {
  await endSession(req.session._id)
  clearSessionCookie(res)
  await logActivity(req, { action: 'logout', entityType: 'admin', entityId: req.admin._id, entityLabel: req.admin.email })
  ok(res, null, { message: 'Signed out' })
}

export async function getProfile(req, res) {
  ok(res, req.admin)
}

export async function updateProfile(req, res) {
  const { name, email } = req.body
  if (email !== req.admin.email && (await Admin.exists({ email, _id: { $ne: req.admin._id } }))) {
    throw ApiError.conflict('Another admin already uses that email', { email: 'This email is already in use' })
  }
  req.admin.set({ name, email })
  await req.admin.save()
  await logActivity(req, { action: 'update', entityType: 'profile', entityId: req.admin._id, entityLabel: email })
  ok(res, req.admin, { message: 'Profile saved' })
}

export async function changePassword(req, res) {
  const admin = await Admin.findById(req.admin._id).select('+passwordHash')
  if (!(await bcrypt.compare(req.body.currentPassword, admin.passwordHash))) {
    throw ApiError.unprocessable('Your current password is incorrect', { currentPassword: 'Incorrect password' })
  }
  admin.passwordHash = await hashPassword(req.body.newPassword)
  admin.passwordChangedAt = new Date()
  await admin.save()
  await endOtherSessions(admin._id, req.session._id)
  await logActivity(req, { action: 'password_change', entityType: 'profile', entityId: admin._id, entityLabel: admin.email })
  ok(res, null, { message: 'Password changed. Other devices have been signed out.' })
}

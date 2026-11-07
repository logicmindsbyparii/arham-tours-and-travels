import { ActivityLog } from '../models/ActivityLog.js'
import { logger } from '../utils/logger.js'

// Records an admin action. Logging must never break the action itself, so
// failures are only reported in the server log.
export async function logActivity(req, { action, entityType = '', entityId = '', entityLabel = '', admin = req.admin }) {
  try {
    await ActivityLog.create({
      admin: admin?._id ?? null,
      adminEmail: admin?.email ?? '',
      action,
      entityType,
      entityId: entityId ? String(entityId) : '',
      entityLabel: String(entityLabel ?? '').slice(0, 200),
      ip: req.ip ?? '',
    })
  } catch (error) {
    logger.warn('Could not write activity log:', error.message)
  }
}

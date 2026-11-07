import mongoose from 'mongoose'
import { cleanJson } from './plugins.js'

// Audit trail of admin actions. Never store passwords, tokens or cookies here.
const activityLogSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', default: null, index: true },
    adminEmail: { type: String, trim: true, maxlength: 254, default: '' },
    action: { type: String, required: true, trim: true, maxlength: 40, index: true },
    entityType: { type: String, trim: true, maxlength: 40, default: '', index: true },
    entityId: { type: String, trim: true, maxlength: 40, default: '' },
    entityLabel: { type: String, trim: true, maxlength: 200, default: '' },
    ip: { type: String, trim: true, maxlength: 64, default: '' },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
)

activityLogSchema.index({ createdAt: -1 })
cleanJson(activityLogSchema)

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema)

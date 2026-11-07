import mongoose from 'mongoose'
import { cleanJson } from './plugins.js'

export const ADMIN_ROLES = ['admin']

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    // bcrypt hash only; never selected unless asked for explicitly.
    passwordHash: { type: String, required: true, select: false },
    role: { type: String, enum: ADMIN_ROLES, default: 'admin' },
    active: { type: Boolean, default: true },
    lastLoginAt: Date,
    passwordChangedAt: Date,
  },
  { timestamps: true },
)

cleanJson(adminSchema)

export const Admin = mongoose.model('Admin', adminSchema)

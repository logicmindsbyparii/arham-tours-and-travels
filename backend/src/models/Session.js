import mongoose from 'mongoose'

// One row per signed-in browser. The JWT in the cookie carries the session id
// (jti); signing out or changing the password deletes the row, so a copied
// token stops working immediately instead of at its expiry time.
const sessionSchema = new mongoose.Schema(
  {
    admin: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true, index: true },
    jti: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true },
    ip: String,
    userAgent: { type: String, maxlength: 300 },
  },
  { timestamps: true },
)

// MongoDB removes expired sessions on its own.
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 })

export const Session = mongoose.model('Session', sessionSchema)

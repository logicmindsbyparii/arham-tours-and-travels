import dotenv from 'dotenv'
dotenv.config()
import { connectDatabase, disconnectDatabase } from '../src/config/db.js'
import { Admin } from '../src/models/Admin.js'
import { hashPassword } from '../src/services/authService.js'

const email = process.argv[2] || process.env.SEED_ADMIN_EMAIL || 'admin@example.com'
const newPass = process.argv[3] || 'Local-test-pass-2026'

try {
  await connectDatabase()
  const admin = await Admin.findOne({ email })
  if (!admin) {
    console.log(`Admin with email ${email} not found.`)
  } else {
    admin.passwordHash = await hashPassword(newPass)
    admin.passwordChangedAt = new Date()
    await admin.save()
    console.log(`SUCCESS: Password for ${email} has been reset to: ${newPass}`)
  }
} catch (err) {
  console.error('Error:', err.message)
} finally {
  await disconnectDatabase()
}


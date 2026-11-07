// Creates the first admin account from environment variables:
//   SEED_ADMIN_EMAIL=you@example.com SEED_ADMIN_PASSWORD='…' npm run seed:admin
// (or set them in backend/.env, then remove them after seeding).
//
// The password is hashed with bcrypt before it is stored. If an admin with
// that email already exists nothing is changed.
import { connectDatabase, disconnectDatabase } from '../src/config/db.js'
import { Admin } from '../src/models/Admin.js'
import { hashPassword } from '../src/services/authService.js'
import { email as emailRule } from '../src/validators/common.js'
import { newPassword } from '../src/validators/account.js'

const name = process.env.SEED_ADMIN_NAME?.trim() || 'Site Administrator'
const email = emailRule.safeParse(process.env.SEED_ADMIN_EMAIL ?? '')
const password = newPassword.safeParse(process.env.SEED_ADMIN_PASSWORD ?? '')

if (!email.success) {
  console.error('Set SEED_ADMIN_EMAIL to a valid email address.')
  process.exit(1)
}
if (!password.success) {
  console.error(`SEED_ADMIN_PASSWORD is not strong enough: ${password.error.issues[0].message}.`)
  process.exit(1)
}

try {
  await connectDatabase()
  if (await Admin.exists({ email: email.data })) {
    console.log(`An admin with the email ${email.data} already exists. Nothing was changed.`)
  } else {
    await Admin.create({ name, email: email.data, passwordHash: await hashPassword(password.data), role: 'admin' })
    console.log(`Admin account created for ${email.data}. Sign in at /admin/login.`)
    console.log('Remove SEED_ADMIN_PASSWORD from your environment / .env file now.')
  }
} catch (error) {
  console.error('Could not create the admin:', error.message)
  process.exitCode = 1
} finally {
  await disconnectDatabase()
}

// Try the API without installing MongoDB:
//   npm run dev:memory
// Starts a temporary in-memory MongoDB, imports the website content, creates
// the admin from SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD and starts the API.
// Everything is lost when it stops. For development and testing only.
import { MongoMemoryServer } from 'mongodb-memory-server'

if (process.env.NODE_ENV === 'production') {
  console.error('dev:memory is for development only.')
  process.exit(1)
}

const mongo = await MongoMemoryServer.create()
process.env.MONGODB_URI = mongo.getUri('arham_dev')

const { connectDatabase } = await import('../src/config/db.js')
const { Admin } = await import('../src/models/Admin.js')
const { hashPassword } = await import('../src/services/authService.js')
const { newPassword } = await import('../src/validators/account.js')
const { seedContent } = await import('./data/importContent.js')

await connectDatabase()
console.log('Imported content:', await seedContent())

const email = process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase()
const password = process.env.SEED_ADMIN_PASSWORD ?? ''
if (email && newPassword.safeParse(password).success) {
  await Admin.create({ name: process.env.SEED_ADMIN_NAME || 'Site Administrator', email, passwordHash: await hashPassword(password) })
  console.log(`Admin ${email} created in the temporary database.`)
} else {
  console.warn('Set SEED_ADMIN_EMAIL and a strong SEED_ADMIN_PASSWORD in .env to sign in to the admin panel.')
}

process.on('exit', () => mongo.stop())
await import('../src/server.js')

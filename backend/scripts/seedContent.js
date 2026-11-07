// Imports the website's existing packages, destinations, hero banners,
// services, FAQs, section text and business settings into MongoDB:
//   npm run seed:content
// Only missing records are created; admin edits are never overwritten.
import { connectDatabase, disconnectDatabase } from '../src/config/db.js'
import { seedContent } from './data/importContent.js'

try {
  await connectDatabase()
  const created = await seedContent()
  console.log('Content import finished. Created:', created)
} catch (error) {
  console.error('Content import failed:', error.message)
  process.exitCode = 1
} finally {
  await disconnectDatabase()
}

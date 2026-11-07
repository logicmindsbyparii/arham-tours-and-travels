// Imports visa countries from a JSON file into MongoDB as drafts (or published with --publish):
//   npm run import:visa -- <path-to-json-file> [--publish]
import fs from 'node:fs'
import path from 'node:path'
import { connectDatabase, disconnectDatabase } from '../src/config/db.js'
import { importVisaCountriesData } from '../src/services/visaImportService.js'
import { VisaCountry } from '../src/models/VisaCountry.js'

const args = process.argv.slice(2).filter((a) => a !== '--publish')
const shouldPublish = process.argv.includes('--publish')
const filePath = args[0]

if (!filePath) {
  console.error('Usage: npm run import:visa -- <path-to-json-file> [--publish]')
  process.exit(1)
}

const resolvedPath = path.resolve(process.cwd(), filePath)
if (!fs.existsSync(resolvedPath)) {
  console.error(`File not found: ${resolvedPath}`)
  process.exit(1)
}

try {
  const content = fs.readFileSync(resolvedPath, 'utf-8')
  const rows = JSON.parse(content)
  await connectDatabase()
  const results = await importVisaCountriesData(rows)

  if (shouldPublish) {
    const slugs = results.filter((r) => r.status === 'created' || r.status === 'updated').map((r) => r.slug)
    await VisaCountry.updateMany({ slug: { $in: slugs } }, { status: 'published', publishedAt: new Date() })
    console.log(`Published ${slugs.length} countries.`)
  }

  const created = results.filter((r) => r.status === 'created')
  const updated = results.filter((r) => r.status === 'updated')
  const failed = results.filter((r) => r.status === 'failed')

  console.log(`Import finished. Total: ${results.length}, Created: ${created.length}, Updated: ${updated.length}, Failed: ${failed.length}`)

  if (failed.length > 0) {
    console.error('Failed rows:')
    for (const f of failed) {
      console.error(` - [${f.slug}]:`, f.errors)
    }
  }
} catch (error) {
  console.error('Visa import failed:', error.message)
  process.exitCode = 1
} finally {
  await disconnectDatabase()
}

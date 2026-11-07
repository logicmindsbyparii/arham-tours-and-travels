import { connectDatabase, disconnectDatabase } from '../src/config/db.js'
import { Package } from '../src/models/Package.js'
import { Banner } from '../src/models/Banner.js'
import { internationalPackages, countryBanners } from './data/countryContent.js'

try {
  await connectDatabase()
  console.log('Connected to database.')

  // 1. Ensure all packages exist in MongoDB
  for (const pkg of internationalPackages) {
    const existing = await Package.findOne({ slug: pkg.slug })
    if (!existing) {
      await Package.create({ ...pkg, publishedAt: new Date() })
      console.log(`Created package: ${pkg.slug}`)
    } else {
      await Package.updateOne({ slug: pkg.slug }, { $set: pkg })
      console.log(`Updated package: ${pkg.slug}`)
    }
  }

  const packageDocs = await Package.find().select('slug _id')
  const packageMap = Object.fromEntries(packageDocs.map((p) => [p.slug, p._id]))

  // 2. Replace banners with country banners
  await Banner.deleteMany({})
  console.log('Cleared existing banners.')

  for (const [index, b] of countryBanners.entries()) {
    const pkgId = packageMap[b.packageSlug] ?? null
    await Banner.create({
      name: b.name,
      titleLine1: b.titleLine1,
      titleLine2: b.titleLine2,
      subtitle: b.subtitle,
      image: b.image,
      imageAlt: b.imageAlt,
      ctaLabel: b.ctaLabel,
      ctaLink: b.ctaLink,
      package: pkgId,
      accent: b.accent,
      active: true,
      sortOrder: index + 1,
    })
    console.log(`Created country banner: ${b.name} -> package ${b.packageSlug}`)
  }

  console.log('Country banners synchronization completed successfully!')
} catch (err) {
  console.error('Error syncing country banners:', err)
  process.exitCode = 1
} finally {
  await disconnectDatabase()
}

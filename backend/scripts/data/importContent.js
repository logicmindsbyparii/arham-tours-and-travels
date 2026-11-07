// Imports the website's existing content into MongoDB (npm run seed:content).
//
// Safe to run more than once: a record is only created when nothing with the
// same slug / key exists yet, so edits made in the admin panel are never
// overwritten. Hero banners are only created when there are none at all.
import { Package } from '../../src/models/Package.js'
import { Destination } from '../../src/models/Destination.js'
import { Banner } from '../../src/models/Banner.js'
import { Service } from '../../src/models/Service.js'
import { Faq } from '../../src/models/Faq.js'
import { SiteContent } from '../../src/models/SiteContent.js'
import { Settings } from '../../src/models/Settings.js'
import { VisaCountry } from '../../src/models/VisaCountry.js'
import * as initial from './initialContent.js'

export async function seedContent() {
  const created = { packages: 0, destinations: 0, banners: 0, services: 0, faqs: 0, content: 0, settings: 0, visaCountries: 0 }

  if (!(await Settings.exists({ key: 'business' }))) {
    await Settings.create({ key: 'business', ...initial.settings })
    created.settings++
  }

  for (const item of initial.packages) {
    if (await Package.exists({ slug: item.slug })) continue
    await Package.create({ ...item, publishedAt: new Date() })
    created.packages++
  }

  const packageIds = Object.fromEntries((await Package.find().select('slug')).map((pkg) => [pkg.slug, pkg._id]))

  for (const [index, place] of initial.destinations.entries()) {
    if (await Destination.exists({ slug: place.slug })) continue
    const { packageSlug, poster, ...fields } = place
    void poster
    await Destination.create({ ...fields, package: packageIds[packageSlug] ?? null, status: 'published', sortOrder: index + 1 })
    created.destinations++
  }

  // The hero slides used to be the destinations, so the first banners mirror them.
  if ((await Banner.countDocuments()) === 0) {
    for (const [index, place] of initial.destinations.entries()) {
      await Banner.create({
        name: place.name,
        titleLine1: place.poster[0],
        titleLine2: place.poster[1],
        subtitle: place.tagline,
        image: place.image,
        imageAlt: place.imageAlt,
        ctaLabel: 'Explore trips',
        ctaLink: '#packages',
        package: packageIds[place.packageSlug] ?? null,
        accent: place.accent,
        active: true,
        sortOrder: index + 1,
      })
      created.banners++
    }
  }

  for (const [index, service] of initial.services.entries()) {
    if (await Service.exists({ slug: service.slug })) continue
    await Service.create({ ...service, status: 'published', sortOrder: index + 1 })
    created.services++
  }

  for (const [page, questions] of Object.entries(initial.faqs)) {
    for (const [index, faq] of questions.entries()) {
      if (await Faq.exists({ page, question: faq.question })) continue
      await Faq.create({ ...faq, page, status: 'published', sortOrder: index + 1 })
      created.faqs++
    }
  }

  for (const section of initial.siteContent) {
    if (await SiteContent.exists({ key: section.key })) continue
    await SiteContent.create({ ...section, status: 'published' })
    created.content++
  }

  if (initial.visaCountries) {
    for (const [index, country] of initial.visaCountries.entries()) {
      if (await VisaCountry.exists({ slug: country.slug })) continue
      await VisaCountry.create({ ...country, status: 'draft', sortOrder: index + 1 })
      created.visaCountries++
    }
  }

  return created
}

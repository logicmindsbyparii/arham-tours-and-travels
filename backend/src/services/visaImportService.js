import { VisaCountry } from '../models/VisaCountry.js'
import { visaCountrySchema } from '../validators/content.js'
import { issuesToDetails } from '../middleware/validate.js'
import { slugify } from '../utils/helpers.js'
import { ApiError } from '../utils/ApiError.js'

export async function importVisaCountriesData(rows) {
  if (!Array.isArray(rows)) {
    throw ApiError.badRequest('Expected a JSON array of visa countries')
  }
  if (rows.length === 0) {
    return []
  }
  if (rows.length > 100) {
    throw ApiError.badRequest('Import batch cannot exceed 100 countries')
  }

  const results = []

  for (let index = 0; index < rows.length; index++) {
    const raw = rows[index]
    const parsed = visaCountrySchema.safeParse(raw ?? {})

    if (!parsed.success) {
      const fallbackSlug = raw?.slug || (raw?.name ? slugify(raw.name) : `row-${index + 1}`)
      results.push({
        slug: fallbackSlug,
        status: 'failed',
        errors: issuesToDetails(parsed.error.issues),
      })
      continue
    }

    const data = { ...parsed.data }
    const slug = data.slug || slugify(data.name)
    if (!slug) {
      results.push({
        slug: `row-${index + 1}`,
        status: 'failed',
        errors: { slug: 'Enter a valid country name or slug' },
      })
      continue
    }

    // Imported records are ALWAYS forced to status "draft"
    data.slug = slug
    data.status = 'draft'

    const existing = await VisaCountry.findOne({ slug })
    if (existing) {
      existing.set(data)
      existing.status = 'draft'
      await existing.save()
      results.push({ slug, status: 'updated' })
    } else {
      await VisaCountry.create(data)
      results.push({ slug, status: 'created' })
    }
  }

  return results
}


import { crudController } from './crudFactory.js'
import { ApiError } from '../utils/ApiError.js'
import { ok } from '../utils/helpers.js'
import { logActivity } from '../services/activityService.js'
import { importVisaCountriesData } from '../services/visaImportService.js'
import { Package, PACKAGE_CATEGORIES } from '../models/Package.js'
import { Destination } from '../models/Destination.js'
import { Banner } from '../models/Banner.js'
import { Service } from '../models/Service.js'
import { Testimonial } from '../models/Testimonial.js'
import { Faq, FAQ_PAGES } from '../models/Faq.js'
import { SiteContent, CONTENT_SECTIONS } from '../models/SiteContent.js'
import { VisaCountry } from '../models/VisaCountry.js'
import { Inquiry, INQUIRY_STATUSES } from '../models/Inquiry.js'
import { STATUSES } from '../models/plugins.js'

const ordered = { order: { sortOrder: 1, createdAt: 1 }, recent: { updatedAt: -1 }, name: { title: 1 } }

// Destinations and banners may link to a package; make sure it exists.
async function checkLinkedPackage(body) {
  if (body.package && !(await Package.exists({ _id: body.package }))) {
    throw ApiError.unprocessable('Some fields need attention', { package: 'That package no longer exists' })
  }
}

export const packages = crudController(Package, {
  entityType: 'package',
  labelField: 'title',
  searchFields: ['title', 'region', 'slug', 'places'],
  filters: { status: STATUSES, category: PACKAGE_CATEGORIES, featured: ['true', 'false'] },
  sorts: {
    recent: { updatedAt: -1 },
    order: { sortOrder: 1, createdAt: 1 },
    title: { title: 1 },
    'price-low': { price: 1 },
    'price-high': { price: -1 },
  },
  slugFrom: 'title',
  // A deleted package is unlinked from destinations and banners that showed it.
  afterDelete: async (doc) => {
    await Promise.all([
      Destination.updateMany({ package: doc._id }, { package: null }),
      Banner.updateMany({ package: doc._id }, { package: null }),
    ])
  },
})

export const destinations = crudController(Destination, {
  entityType: 'destination',
  labelField: 'name',
  searchFields: ['name', 'slug', 'tagline'],
  filters: { status: STATUSES, featured: ['true', 'false'] },
  sorts: { order: { sortOrder: 1, createdAt: 1 }, recent: { updatedAt: -1 }, name: { name: 1 } },
  slugFrom: 'name',
  populate: { path: 'package', select: 'title slug status' },
  beforeSave: checkLinkedPackage,
})

export const banners = crudController(Banner, {
  entityType: 'banner',
  labelField: 'name',
  searchFields: ['name', 'titleLine1', 'titleLine2', 'subtitle'],
  filters: { active: ['true', 'false'] },
  sorts: { order: { sortOrder: 1, createdAt: 1 }, recent: { updatedAt: -1 }, name: { name: 1 } },
  populate: { path: 'package', select: 'title slug status' },
  beforeSave: checkLinkedPackage,
})

export const services = crudController(Service, {
  entityType: 'service',
  labelField: 'title',
  searchFields: ['title', 'summary', 'slug'],
  filters: { status: STATUSES },
  sorts: ordered,
  slugFrom: 'title',
})

export const testimonials = crudController(Testimonial, {
  entityType: 'testimonial',
  labelField: 'name',
  searchFields: ['name', 'trip', 'quote', 'source'],
  filters: { status: STATUSES },
  sorts: { order: { sortOrder: 1, createdAt: 1 }, recent: { updatedAt: -1 }, name: { name: 1 } },
})

export const faqs = crudController(Faq, {
  entityType: 'faq',
  labelField: 'question',
  searchFields: ['question', 'answer'],
  // ?faqPage= because ?page= is the page number of the list.
  filters: { status: STATUSES, faqPage: { field: 'page', values: FAQ_PAGES } },
  sorts: { order: { page: 1, sortOrder: 1, createdAt: 1 }, recent: { updatedAt: -1 } },
})

export const siteContent = crudController(SiteContent, {
  entityType: 'content',
  labelField: 'key',
  searchFields: ['key', 'title', 'intro', 'body'],
  filters: { status: STATUSES, key: Object.keys(CONTENT_SECTIONS) },
  sorts: { key: { key: 1 }, recent: { updatedAt: -1 } },
})

export const visaCountries = crudController(VisaCountry, {
  entityType: 'visa country',
  labelField: 'name',
  searchFields: ['name', 'slug', 'tagline'],
  filters: { status: STATUSES },
  sorts: { order: { sortOrder: 1, createdAt: 1 }, recent: { updatedAt: -1 }, name: { name: 1 } },
  slugFrom: 'name',
})

export async function importVisaCountries(req, res) {
  const rows = Array.isArray(req.body)
    ? req.body
    : Array.isArray(req.body?.items)
      ? req.body.items
      : Array.isArray(req.body?.countries)
        ? req.body.countries
        : req.body
  const results = await importVisaCountriesData(rows)
  const successCount = results.filter((r) => r.status === 'created' || r.status === 'updated').length
  if (successCount > 0) {
    await logActivity(req, {
      action: 'import',
      entityType: 'visa country',
      entityLabel: `${successCount} visa ${successCount === 1 ? 'country' : 'countries'} imported`,
    })
  }
  ok(res, results, { message: `${successCount} records processed` })
}

export const inquiries = crudController(Inquiry, {
  entityType: 'inquiry',
  labelField: 'name',
  searchFields: ['name', 'phone', 'email', 'service', 'destination'],
  filters: { status: INQUIRY_STATUSES },
  sorts: {
    recent: { createdAt: -1 },
    updated: { updatedAt: -1 },
    name: { name: 1 },
  },
})

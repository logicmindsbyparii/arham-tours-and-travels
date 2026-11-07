import fs from 'node:fs/promises'
import path from 'node:path'
import { Package } from '../models/Package.js'
import { Destination } from '../models/Destination.js'
import { Banner } from '../models/Banner.js'
import { Service } from '../models/Service.js'
import { Testimonial } from '../models/Testimonial.js'
import { Faq } from '../models/Faq.js'
import { SiteContent, CONTENT_SECTIONS } from '../models/SiteContent.js'
import { Settings } from '../models/Settings.js'
import { ActivityLog } from '../models/ActivityLog.js'
import { VisaCountry } from '../models/VisaCountry.js'
import { Inquiry } from '../models/Inquiry.js'
import { CarRentalRate } from '../models/CarRentalRate.js'
import { defaultCarRates } from '../services/carRentalDefaults.js'
import { SERVICE_ICONS } from '../models/Service.js'
import { ApiError } from '../utils/ApiError.js'
import { escapeRegex, ok, paginationMeta, readPagination } from '../utils/helpers.js'
import { logActivity } from '../services/activityService.js'
import { IMAGE_TYPES, hasImageSignature, uploadRoot } from '../middleware/upload.js'

// Counts and recent changes, all read from the database.
export async function dashboard(_req, res) {
  const count = (Model, filter = {}) => Model.countDocuments(filter)
  const [
    packagesTotal,
    packagesPublished,
    destinationsTotal,
    destinationsPublished,
    bannersTotal,
    bannersActive,
    servicesTotal,
    servicesPublished,
    testimonialsTotal,
    testimonialsPublished,
    faqsTotal,
    faqsPublished,
    contentTotal,
    visaCountriesTotal,
    visaCountriesPublished,
    inquiriesTotal,
    inquiriesNew,
    inquiriesInProgress,
    recentInquiries,
    byCategory,
    recentPackages,
    recentActivity,
    settings,
  ] = await Promise.all([
    count(Package),
    count(Package, { status: 'published' }),
    count(Destination),
    count(Destination, { status: 'published' }),
    count(Banner),
    count(Banner, { active: true }),
    count(Service),
    count(Service, { status: 'published' }),
    count(Testimonial),
    count(Testimonial, { status: 'published' }),
    count(Faq),
    count(Faq, { status: 'published' }),
    count(SiteContent),
    count(VisaCountry),
    count(VisaCountry, { status: 'published' }),
    count(Inquiry),
    count(Inquiry, { status: 'new' }),
    count(Inquiry, { status: 'in_progress' }),
    Inquiry.find().sort({ createdAt: -1 }).limit(5),
    Package.aggregate([{ $group: { _id: { category: '$category', status: '$status' }, count: { $sum: 1 } } }]),
    Package.find().sort({ updatedAt: -1 }).limit(5).select('title slug status category updatedAt price currency'),
    ActivityLog.find().sort({ createdAt: -1 }).limit(8),
    Settings.exists({ key: 'business' }),
  ])

  const categories = {}
  for (const row of byCategory) {
    const entry = (categories[row._id.category] ??= { published: 0, draft: 0 })
    entry[row._id.status] = row.count
  }

  ok(res, {
    counts: {
      packages: { total: packagesTotal, published: packagesPublished, draft: packagesTotal - packagesPublished },
      destinations: { total: destinationsTotal, published: destinationsPublished },
      banners: { total: bannersTotal, active: bannersActive },
      services: { total: servicesTotal, published: servicesPublished },
      testimonials: { total: testimonialsTotal, published: testimonialsPublished },
      faqs: { total: faqsTotal, published: faqsPublished },
      content: { total: contentTotal },
      visaCountries: { total: visaCountriesTotal, published: visaCountriesPublished },
      inquiries: { total: inquiriesTotal, new: inquiriesNew, in_progress: inquiriesInProgress },
    },
    packagesByCategory: categories,
    recentPackages,
    recentInquiries,
    recentActivity,
    settingsConfigured: Boolean(settings),
  })
}

// Choices for the admin forms' drop-downs.
export async function formOptions(_req, res) {
  const packages = await Package.find().sort({ title: 1 }).select('title slug status')
  ok(res, {
    packages: packages.map((pkg) => ({ id: String(pkg._id), title: pkg.title, slug: pkg.slug, status: pkg.status })),
    contentSections: Object.entries(CONTENT_SECTIONS).map(([key, label]) => ({ key, label })),
    serviceIcons: SERVICE_ICONS,
  })
}

export async function getSettings(_req, res) {
  ok(res, await Settings.findOne({ key: 'business' }))
}

export async function saveSettings(req, res) {
  const settings = await Settings.findOneAndUpdate(
    { key: 'business' },
    { $set: req.body },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  )
  await logActivity(req, { action: 'update', entityType: 'settings', entityId: settings._id, entityLabel: 'Business settings' })
  ok(res, settings, { message: 'Settings saved' })
}

export async function getCarRentalRates(_req, res) {
  let rates = await CarRentalRate.findOne({ key: 'rates' })
  if (!rates) {
    rates = await CarRentalRate.create(defaultCarRates)
  }
  ok(res, rates)
}

export async function saveCarRentalRates(req, res) {
  const allowed = [
    'note',
    'outstationFixedFares',
    'localDuty',
    'extraCharges',
    'termsAndConditions',
    'tempoBusVehicles',
    'tempoBusFixedRoutes',
  ]
  const update = {}
  for (const field of allowed) {
    if (req.body[field] !== undefined) update[field] = req.body[field]
  }

  const rates = await CarRentalRate.findOneAndUpdate(
    { key: 'rates' },
    { $set: update },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
  )

  await logActivity(req, {
    action: 'update',
    entityType: 'car_rental',
    entityLabel: 'Car rental rates and routes',
  })

  ok(res, rates, { message: 'Car rental rates saved successfully' })
}

const LOG_ACTIONS = ['login', 'logout', 'create', 'update', 'delete', 'publish', 'unpublish', 'activate', 'deactivate', 'password_change', 'upload', 'import']

export async function activityLogs(req, res) {
  const { page, limit, skip } = readPagination(req.query, { defaultLimit: 20 })
  const query = {}
  if (req.query.action && req.query.action !== 'all') {
    if (!LOG_ACTIONS.includes(req.query.action)) throw ApiError.badRequest('Unknown action filter')
    query.action = req.query.action
  }
  if (typeof req.query.entityType === 'string' && /^[a-z _-]{1,40}$/.test(req.query.entityType)) {
    query.entityType = req.query.entityType
  }
  const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 100) : ''
  if (q) {
    const pattern = new RegExp(escapeRegex(q), 'i')
    query.$or = [{ entityLabel: pattern }, { adminEmail: pattern }]
  }
  const [items, total] = await Promise.all([
    ActivityLog.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
    ActivityLog.countDocuments(query),
  ])
  ok(res, items, { meta: { ...paginationMeta({ page, limit }, total), actions: LOG_ACTIONS } })
}

export async function uploadImage(req, res) {
  if (!req.file) throw ApiError.badRequest('Choose an image to upload')
  if (!(await hasImageSignature(req.file.path, req.file.mimetype))) {
    await fs.unlink(req.file.path).catch(() => {})
    throw ApiError.badRequest('That file is not a valid JPG, PNG or WebP image')
  }
  const url = `/uploads/${req.file.filename}`
  await logActivity(req, { action: 'upload', entityType: 'image', entityLabel: req.file.filename })
  ok(res, { url, size: req.file.size, type: req.file.mimetype }, { status: 201, message: 'Image uploaded' })
}

// Newest uploaded images first, for the image picker.
export async function listUploads(_req, res) {
  const extensions = new Set(Object.values(IMAGE_TYPES))
  const names = (await fs.readdir(uploadRoot)).filter((name) => extensions.has(path.extname(name).toLowerCase()))
  const files = await Promise.all(
    names.map(async (name) => {
      const stats = await fs.stat(path.join(uploadRoot, name))
      return { url: `/uploads/${name}`, size: stats.size, uploadedAt: stats.mtime }
    }),
  )
  files.sort((a, b) => b.uploadedAt - a.uploadedAt)
  ok(res, files.slice(0, 200))
}

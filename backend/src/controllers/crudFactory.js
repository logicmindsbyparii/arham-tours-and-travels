import { ApiError } from '../utils/ApiError.js'
import { escapeRegex, ok, paginationMeta, readPagination, slugify } from '../utils/helpers.js'
import { logActivity } from '../services/activityService.js'

// Builds list / get / create / update / remove / setStatus handlers for one
// model. Request bodies have already been validated and whitelisted by the
// route's zod schema.
//
// options:
//   entityType     name used in activity logs, e.g. "package"
//   labelField     field shown in logs and messages, e.g. "title"
//   searchFields   fields matched by ?q=
//   filters        { queryParam: allowedValues[] } for exact-match filters
//   sorts          { sortParam: mongo sort } (first is the default)
//   slugFrom       field to build the slug from when none is given
//   populate       path(s) to populate on list/get
//   beforeSave     async (body, existingDoc?) hook for cross-record checks
//   afterDelete    async (doc) hook, e.g. to unlink references
export function crudController(Model, options) {
  const {
    entityType,
    labelField,
    searchFields = [labelField],
    filters = {},
    sorts = { recent: { updatedAt: -1 } },
    slugFrom,
    populate,
    beforeSave,
    afterDelete,
  } = options
  const label = (doc) => doc?.[labelField] ?? ''

  async function ensureUniqueSlug(body, currentId) {
    if (!slugFrom) return
    body.slug = body.slug || slugify(body[slugFrom])
    if (!body.slug) throw ApiError.unprocessable('Some fields need attention', { slug: 'Enter a slug' })
    const clash = await Model.exists({ slug: body.slug, ...(currentId && { _id: { $ne: currentId } }) })
    if (clash) {
      throw ApiError.conflict('That slug is already used by another record', { slug: 'This slug is already in use' })
    }
  }

  function markPublished(body, existing) {
    if (body.status === 'published' && existing?.status !== 'published') body.publishedAt = new Date()
  }

  return {
    async list(req, res) {
      const { page, limit, skip } = readPagination(req.query)
      const query = {}

      const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 100) : ''
      if (q) {
        const pattern = new RegExp(escapeRegex(q), 'i')
        query.$or = searchFields.map((field) => ({ [field]: pattern }))
      }
      for (const [param, rule] of Object.entries(filters)) {
        // rule: allowed values (field = param), or { field, values } when the
        // query parameter needs another name (e.g. a field called "page").
        const { field = param, values: allowed } = Array.isArray(rule) ? { values: rule } : rule
        const value = req.query[param]
        if (value === undefined || value === '' || value === 'all') continue
        if (!allowed.includes(String(value))) throw ApiError.badRequest(`Unknown ${param} filter`)
        query[field] = allowed.every((item) => item === 'true' || item === 'false') ? value === 'true' : value
      }

      const sortKey = Object.hasOwn(sorts, req.query.sort) ? req.query.sort : Object.keys(sorts)[0]
      const [items, total] = await Promise.all([
        Model.find(query)
          .sort(sorts[sortKey])
          .skip(skip)
          .limit(limit)
          .populate(populate ?? [])
          .exec(),
        Model.countDocuments(query),
      ])
      ok(res, items, { meta: paginationMeta({ page, limit }, total) })
    },

    async get(req, res) {
      const doc = await Model.findById(req.params.id).populate(populate ?? [])
      if (!doc) throw ApiError.notFound(`That ${entityType} no longer exists`)
      ok(res, doc)
    },

    async create(req, res) {
      const body = { ...req.body }
      await ensureUniqueSlug(body)
      await beforeSave?.(body)
      markPublished(body)
      const doc = await Model.create(body)
      await logActivity(req, { action: 'create', entityType, entityId: doc._id, entityLabel: label(doc) })
      ok(res, doc, { status: 201, message: `${capitalize(entityType)} created` })
    },

    async update(req, res) {
      const doc = await Model.findById(req.params.id)
      if (!doc) throw ApiError.notFound(`That ${entityType} no longer exists`)
      const body = { ...req.body }
      await ensureUniqueSlug(body, doc._id)
      await beforeSave?.(body, doc)
      markPublished(body, doc)
      doc.set(body)
      await doc.save()
      await logActivity(req, { action: 'update', entityType, entityId: doc._id, entityLabel: label(doc) })
      ok(res, doc, { message: `${capitalize(entityType)} saved` })
    },

    async remove(req, res) {
      const doc = await Model.findByIdAndDelete(req.params.id)
      if (!doc) throw ApiError.notFound(`That ${entityType} no longer exists`)
      await afterDelete?.(doc)
      await logActivity(req, { action: 'delete', entityType, entityId: doc._id, entityLabel: label(doc) })
      ok(res, { id: String(doc._id) }, { message: `${capitalize(entityType)} deleted` })
    },

    // PATCH { status: "published" | "draft" }
    async setStatus(req, res) {
      const doc = await Model.findById(req.params.id)
      if (!doc) throw ApiError.notFound(`That ${entityType} no longer exists`)
      const update = { status: req.body.status }
      markPublished(update, doc)
      doc.set(update)
      await doc.save()
      const action = req.body.status === 'published' ? 'publish' : 'unpublish'
      await logActivity(req, { action, entityType, entityId: doc._id, entityLabel: label(doc) })
      ok(res, doc, { message: req.body.status === 'published' ? 'Published' : 'Moved to drafts' })
    },

    // PATCH { active: true | false } (banners)
    async setActive(req, res) {
      const doc = await Model.findById(req.params.id)
      if (!doc) throw ApiError.notFound(`That ${entityType} no longer exists`)
      doc.active = req.body.active
      await doc.save()
      await logActivity(req, {
        action: req.body.active ? 'activate' : 'deactivate',
        entityType,
        entityId: doc._id,
        entityLabel: label(doc),
      })
      ok(res, doc, { message: req.body.active ? 'Activated' : 'Deactivated' })
    },
  }
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

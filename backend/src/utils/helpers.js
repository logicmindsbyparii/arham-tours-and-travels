// "Vietnam Group Departure (7N)" -> "vietnam-group-departure-7n"
export function slugify(value) {
  return String(value)
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/, '')
}

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

// Reads ?page and ?limit with safe bounds.
export function readPagination(query, { defaultLimit = 10, maxLimit = 100 } = {}) {
  const page = Math.min(10000, Math.max(1, Number.parseInt(query.page, 10) || 1))
  const limit = Math.min(maxLimit, Math.max(1, Number.parseInt(query.limit, 10) || defaultLimit))
  return { page, limit, skip: (page - 1) * limit }
}

export function paginationMeta({ page, limit }, total) {
  return { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) }
}

// Escapes user text for use inside a RegExp (search boxes).
export function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Every JSON response shares one envelope:
//   success: { success: true, data, meta?, message? }
//   failure: { success: false, error: { message, details? } }
export function ok(res, data, { status = 200, meta, message } = {}) {
  const body = { success: true, data }
  if (meta) body.meta = meta
  if (message) body.message = message
  return res.status(status).json(body)
}

// Shared JSON output for every model: `id` instead of `_id`, no `__v`, and
// never a password hash, whatever the query selected.
export function cleanJson(schema) {
  schema.set('toJSON', {
    virtuals: false,
    versionKey: false,
    transform(_doc, ret) {
      ret.id = String(ret._id)
      delete ret._id
      delete ret.passwordHash
      return ret
    },
  })
}

export const STATUSES = ['draft', 'published']

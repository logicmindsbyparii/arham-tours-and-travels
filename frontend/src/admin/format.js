// Date and value formatting used across the admin panel (Indian English).

export const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : '—'

export const formatDay = (value) =>
  value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

export const formatMoney = (amount, currency = 'INR') =>
  new Intl.NumberFormat(currency === 'INR' ? 'en-IN' : 'en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount ?? 0)

// Copies the values of a record that a form edits, with defaults for missing ones.
export function pickFields(record, defaults) {
  const values = {}
  for (const [key, fallback] of Object.entries(defaults)) {
    const value = record?.[key]
    values[key] = value === undefined || value === null ? fallback : value
  }
  return values
}

// The error for a field, or the first error of its parts ("itinerary.0.title" belongs to "itinerary").
export function errorFor(errors, name) {
  if (!errors) return undefined
  if (errors[name]) return errors[name]
  return Object.entries(errors).find(([key]) => key.startsWith(`${name}.`))?.[1]
}

// Activity log action names as shown to people.
export const ACTION_LABELS = {
  login: 'Signed in',
  logout: 'Signed out',
  create: 'Created',
  update: 'Updated',
  delete: 'Deleted',
  publish: 'Published',
  unpublish: 'Unpublished',
  activate: 'Activated',
  deactivate: 'Deactivated',
  password_change: 'Password changed',
  upload: 'Uploaded',
}

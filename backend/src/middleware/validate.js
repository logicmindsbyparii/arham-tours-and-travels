import mongoose from 'mongoose'
import { ApiError } from '../utils/ApiError.js'

// Turns zod issues into { "field.path": "message" } for the admin forms.
export function issuesToDetails(issues) {
  const details = {}
  for (const issue of issues) {
    const key = issue.path.join('.') || '_'
    if (!details[key]) details[key] = issue.message
  }
  return details
}

// Replaces req.body with the parsed, whitelisted data, or answers 422.
export function validateBody(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body ?? {})
    if (!result.success) {
      return next(ApiError.unprocessable('Some fields need attention', issuesToDetails(result.error.issues)))
    }
    req.body = result.data
    next()
  }
}

// Rejects malformed :id values before they reach a query.
export function validateIdParam(req, _res, next) {
  if (!mongoose.isValidObjectId(req.params.id)) return next(ApiError.notFound('No record with that id'))
  next()
}

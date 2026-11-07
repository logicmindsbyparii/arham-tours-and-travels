import mongoose from 'mongoose'
import multer from 'multer'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import { logger } from '../utils/logger.js'

export function notFound(req, _res, next) {
  next(ApiError.notFound(`No API route for ${req.method} ${req.originalUrl.split('?')[0]}`))
}

// Turns every error into the standard JSON envelope. Internal details and
// stack traces are logged on the server, never sent to the client.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, _next) {
  let error = err

  if (err instanceof ApiError) {
    error = err
  } else if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.fromEntries(Object.entries(err.errors).map(([field, issue]) => [field, issue.message]))
    error = ApiError.unprocessable('Some fields need attention', details)
  } else if (err instanceof mongoose.Error.CastError) {
    error = ApiError.badRequest(`Invalid value for ${err.path}`)
  } else if (err?.code === 11000) {
    const field = Object.keys(err.keyPattern ?? err.keyValue ?? {})[0] ?? 'field'
    error = ApiError.conflict(`That ${field} is already in use`, { [field]: 'This value is already in use' })
  } else if (err instanceof multer.MulterError) {
    error =
      err.code === 'LIMIT_FILE_SIZE'
        ? new ApiError(413, `The image is too large (max ${Math.round(env.maxUploadBytes / 1024 / 1024)} MB)`)
        : ApiError.badRequest('Upload one image in the "image" field')
  } else if (err?.type === 'entity.parse.failed') {
    error = ApiError.badRequest('The request body is not valid JSON')
  } else if (err?.type === 'entity.too.large') {
    error = new ApiError(413, 'The request is too large')
  } else {
    logger.error(`${req.method} ${req.originalUrl}`, err)
    error = new ApiError(500, 'Something went wrong on the server. Please try again.')
  }

  const body = { success: false, error: { message: error.message } }
  if (error.details) body.error.details = error.details
  res.status(error.status).json(body)
}

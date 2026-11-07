// An error with an HTTP status whose message is safe to show to the client.
export class ApiError extends Error {
  constructor(status, message, details) {
    super(message)
    this.status = status
    this.details = details
  }

  static badRequest(message = 'Bad request', details) {
    return new ApiError(400, message, details)
  }

  static unauthorized(message = 'Please sign in to continue') {
    return new ApiError(401, message)
  }

  static forbidden(message = 'You do not have permission to do that') {
    return new ApiError(403, message)
  }

  static notFound(message = 'Not found') {
    return new ApiError(404, message)
  }

  static conflict(message = 'Conflict', details) {
    return new ApiError(409, message, details)
  }

  static unprocessable(message = 'Some fields need attention', details) {
    return new ApiError(422, message, details)
  }
}

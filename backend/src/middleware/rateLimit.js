import rateLimit from 'express-rate-limit'

const message = (text) => ({ success: false, error: { message: text } })

// Failed sign-ins per IP: 10 per 15 minutes. Successful ones are not counted.
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: message('Too many sign-in attempts. Please wait 15 minutes and try again.'),
})

// Password changes and uploads.
export const sensitiveLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: message('Too many requests. Please try again later.'),
})

// Everything else under /api.
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 300,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: message('Too many requests. Please slow down.'),
})

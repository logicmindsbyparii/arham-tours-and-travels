import 'dotenv/config'

// Reads and validates the environment once at startup. Anything missing or
// unsafe stops the server with a message that names the variable but never
// prints its value.
const errors = []

function read(name, { required = false, fallback } = {}) {
  const value = process.env[name]?.trim()
  if (value) return value
  if (required) errors.push(`${name} is required`)
  return fallback
}

function readInt(name, fallback, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  const raw = read(name)
  if (raw === undefined) return fallback
  const value = Number(raw)
  if (!Number.isInteger(value) || value < min || value > max) {
    errors.push(`${name} must be a whole number between ${min} and ${max}`)
    return fallback
  }
  return value
}

function readBool(name, fallback) {
  const raw = read(name)
  if (raw === undefined) return fallback
  const lower = raw.toLowerCase()
  if (lower !== 'true' && lower !== 'false') errors.push(`${name} must be true or false`)
  return lower === 'true'
}

const nodeEnv = read('NODE_ENV', { fallback: 'development' })
const isProduction = nodeEnv === 'production'

const jwtSecret = read('JWT_SECRET', { required: true })
const csrfSecret = read('CSRF_SECRET', { required: true })
for (const [name, secret] of [
  ['JWT_SECRET', jwtSecret],
  ['CSRF_SECRET', csrfSecret],
]) {
  if (secret && (secret.length < 32 || secret.startsWith('replace-with'))) {
    errors.push(`${name} must be a random string of at least 32 characters`)
  }
}
if (jwtSecret && jwtSecret === csrfSecret) errors.push('JWT_SECRET and CSRF_SECRET must be different')

const frontendOrigins = (read('FRONTEND_ORIGIN', { required: true }) ?? '')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean)
for (const origin of frontendOrigins) {
  let valid = false
  try {
    valid = new URL(origin).origin === origin
  } catch {
    valid = false
  }
  if (!valid) errors.push('FRONTEND_ORIGIN contains an invalid origin (expected e.g. https://example.com)')
}

// In development, http://localhost:5173 and http://127.0.0.1:5173 are the
// same machine; accept whichever one the browser happens to use.
if (!isProduction) {
  for (const origin of [...frontendOrigins]) {
    const twin = origin.includes('//localhost')
      ? origin.replace('//localhost', '//127.0.0.1')
      : origin.replace('//127.0.0.1', '//localhost')
    if (!frontendOrigins.includes(twin)) frontendOrigins.push(twin)
  }
}

const cookieSameSite =read('COOKIE_SAMESITE', { fallback: 'lax' }).toLowerCase()
if (!['lax', 'strict', 'none'].includes(cookieSameSite)) errors.push('COOKIE_SAMESITE must be lax, strict or none')
const cookieSecure = readBool('COOKIE_SECURE', isProduction)
if (cookieSameSite === 'none' && !cookieSecure) errors.push('COOKIE_SAMESITE=none requires COOKIE_SECURE=true')
if (isProduction && !cookieSecure) errors.push('COOKIE_SECURE must be true in production')

export const env = {
  nodeEnv,
  isProduction,
  isTest: nodeEnv === 'test',
  port: readInt('PORT', 5000, { min: 1, max: 65535 }),
  mongoUri: read('MONGODB_URI', { required: true }),
  jwtSecret,
  csrfSecret,
  sessionTtlHours: readInt('SESSION_TTL_HOURS', 8, { min: 1, max: 24 * 7 }),
  frontendOrigins,
  cookie: {
    secure: cookieSecure,
    sameSite: cookieSameSite,
    domain: read('COOKIE_DOMAIN') || undefined,
  },
  trustProxy: readInt('TRUST_PROXY', 0, { min: 0, max: 10 }),
  uploadDir: read('UPLOAD_DIR', { fallback: 'uploads' }),
  maxUploadBytes: readInt('MAX_UPLOAD_MB', 5, { min: 1, max: 20 }) * 1024 * 1024,
}

if (errors.length > 0) {
  console.error('Invalid environment configuration:\n' + errors.map((message) => `  - ${message}`).join('\n'))
  console.error('See backend/.env.example for every setting.')
  process.exit(1)
}

import { Router } from 'express'
import mongoose from 'mongoose'
import { requireAuth, requireRole } from '../middleware/auth.js'
import { requireCsrf } from '../middleware/csrf.js'
import { loginLimiter, sensitiveLimiter } from '../middleware/rateLimit.js'
import { imageUpload } from '../middleware/upload.js'
import { validateBody, validateIdParam } from '../middleware/validate.js'
import * as auth from '../controllers/authController.js'
import * as admin from '../controllers/adminControllers.js'
import * as content from '../controllers/contentControllers.js'
import * as publicApi from '../controllers/publicController.js'
import { loginSchema, passwordChangeSchema, profileSchema, settingsSchema } from '../validators/account.js'
import {
  activeChangeSchema,
  bannerSchema,
  destinationSchema,
  faqSchema,
  inquirySchema,
  inquiryStatusSchema,
  packageSchema,
  publicInquirySchema,
  serviceSchema,
  siteContentSchema,
  statusChangeSchema,
  testimonialSchema,
  visaCountrySchema,
} from '../validators/content.js'
import { Inquiry } from '../models/Inquiry.js'
import { ApiError } from '../utils/ApiError.js'
import { ok } from '../utils/helpers.js'

export const apiRouter = Router()

// ---- Health ---------------------------------------------------------------
apiRouter.get('/health', (_req, res) => {
  const database = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  res.status(database === 'connected' ? 200 : 503).json({
    success: database === 'connected',
    data: { status: database === 'connected' ? 'ok' : 'degraded', database, uptime: Math.round(process.uptime()) },
  })
})

// ---- Public (no sign-in; published content only) ---------------------------
const publicRouter = Router()
publicRouter.get('/site', publicApi.site)
publicRouter.get('/packages', publicApi.packages)
publicRouter.get('/packages/:slug', publicApi.packageBySlug)
publicRouter.get('/destinations', publicApi.destinations)
publicRouter.get('/banners', publicApi.banners)
publicRouter.get('/services', publicApi.services)
publicRouter.get('/testimonials', publicApi.testimonials)
publicRouter.get('/faqs', publicApi.faqs)
publicRouter.get('/content', publicApi.content)
publicRouter.get('/settings', publicApi.settings)
publicRouter.get('/car-rental', publicApi.carRental)
publicRouter.get('/visa-countries', publicApi.visaCountries)
publicRouter.get('/visa-countries/:slug', publicApi.visaCountryBySlug)
publicRouter.post('/inquiries', validateBody(publicInquirySchema), publicApi.createInquiry)
apiRouter.use('/public', publicRouter)

// ---- Auth -----------------------------------------------------------------
// There is deliberately no registration endpoint: admins are created with
// `npm run seed:admin` on the server.
const authRouter = Router()
authRouter.post('/login', loginLimiter, validateBody(loginSchema), auth.login)
authRouter.get('/me', requireAuth, auth.me)
// Same check for the admin app's start-up: "not signed in" is a normal
// answer there (200 with admin: null), so the browser console shows no 401.
authRouter.get('/session', (req, res, next) =>
  requireAuth(req, res, (error) => {
    if (error?.status === 401) return res.json({ success: true, data: { admin: null } })
    if (error) return next(error)
    return auth.me(req, res)
  }),
)
authRouter.post('/logout', requireAuth, requireCsrf, auth.logout)
apiRouter.use('/auth', authRouter)

// ---- Admin (signed in, admin role, CSRF token on every write) ---------------
const adminRouter = Router()
adminRouter.use(requireAuth, requireRole('admin'), requireCsrf)

adminRouter.get('/dashboard', admin.dashboard)
adminRouter.get('/options', admin.formOptions)

// Standard CRUD routes for one content type.
function resource(path, controller, schema, { statusRoute = true, activeRoute = false } = {}) {
  const router = Router()
  router.get('/', controller.list)
  router.post('/', validateBody(schema), controller.create)
  router.get('/:id', validateIdParam, controller.get)
  router.put('/:id', validateIdParam, validateBody(schema), controller.update)
  router.delete('/:id', validateIdParam, controller.remove)
  if (statusRoute) router.patch('/:id/status', validateIdParam, validateBody(statusChangeSchema), controller.setStatus)
  if (activeRoute) router.patch('/:id/active', validateIdParam, validateBody(activeChangeSchema), controller.setActive)
  adminRouter.use(path, router)
}

resource('/packages', content.packages, packageSchema)
resource('/destinations', content.destinations, destinationSchema)
resource('/banners', content.banners, bannerSchema, { statusRoute: false, activeRoute: true })
resource('/services', content.services, serviceSchema)
resource('/testimonials', content.testimonials, testimonialSchema)
resource('/faqs', content.faqs, faqSchema)
resource('/content', content.siteContent, siteContentSchema)
resource('/visa-countries', content.visaCountries, visaCountrySchema)
adminRouter.post('/visa-countries/import', content.importVisaCountries)
resource('/inquiries', content.inquiries, inquirySchema, { statusRoute: false })
adminRouter.patch('/inquiries/:id/status', validateIdParam, validateBody(inquiryStatusSchema), async (req, res) => {
  const doc = await Inquiry.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true })
  if (!doc) throw ApiError.notFound('Inquiry not found')
  ok(res, doc)
})

adminRouter.get('/settings', admin.getSettings)
adminRouter.put('/settings', validateBody(settingsSchema), admin.saveSettings)

adminRouter.get('/car-rental', admin.getCarRentalRates)
adminRouter.put('/car-rental', admin.saveCarRentalRates)

adminRouter.get('/profile', auth.getProfile)
adminRouter.put('/profile', validateBody(profileSchema), auth.updateProfile)
adminRouter.put('/profile/password', sensitiveLimiter, validateBody(passwordChangeSchema), auth.changePassword)

adminRouter.get('/activity-logs', admin.activityLogs)

adminRouter.get('/uploads', admin.listUploads)
adminRouter.post('/uploads', sensitiveLimiter, imageUpload, admin.uploadImage)

apiRouter.post('/visa-countries/import', requireAuth, requireRole('admin'), requireCsrf, content.importVisaCountries)
apiRouter.use('/admin', adminRouter)

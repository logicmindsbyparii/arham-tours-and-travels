import express from 'express'
import helmet from 'helmet'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { env } from './config/env.js'
import { apiRouter } from './routes/index.js'
import { apiLimiter } from './middleware/rateLimit.js'
import { requireAllowedOrigin } from './middleware/csrf.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { uploadRoot } from './middleware/upload.js'

export function createApp() {
  const app = express()

  app.disable('x-powered-by')
  if (env.trustProxy) app.set('trust proxy', env.trustProxy)

  app.use(helmet())
  app.use(
    cors({
      // Only the configured website origins may call the API with cookies.
      // Requests without an Origin (curl, server-to-server) are not browsers
      // and carry no admin cookie unless someone has it, so they pass through.
      origin: (origin, done) => done(null, !origin || env.frontendOrigins.includes(origin)),
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'X-CSRF-Token'],
      maxAge: 600,
    }),
  )
  if (!env.isTest) app.use(morgan(env.isProduction ? 'combined' : 'dev'))
  app.use(express.json({ limit: '200kb' }))
  app.use(cookieParser())

  // Uploaded images, readable by the website on another origin.
  app.use(
    '/uploads',
    express.static(uploadRoot, {
      index: false,
      dotfiles: 'deny',
      maxAge: '30d',
      immutable: true,
      setHeaders: (res) => {
        res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')
        res.setHeader('Content-Security-Policy', "default-src 'none'")
      },
    }),
  )

  app.use('/api', apiLimiter)
  app.use('/api', requireAllowedOrigin)
  app.use('/api/v1', apiRouter)

  app.use(notFound)
  app.use(errorHandler)
  return app
}

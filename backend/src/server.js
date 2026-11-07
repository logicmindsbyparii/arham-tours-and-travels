import { env } from './config/env.js'
import { connectDatabase, disconnectDatabase } from './config/db.js'
import { createApp } from './app.js'
import { logger } from './utils/logger.js'

async function start() {
  try {
    await connectDatabase()
  } catch (error) {
    logger.error(`Could not connect to MongoDB: ${error.message}`)
    logger.error('Check MONGODB_URI in backend/.env and that MongoDB is running.')
    process.exit(1)
  }

  const server = createApp().listen(env.port, () => {
    logger.info(`API listening on http://localhost:${env.port}/api/v1 (${env.nodeEnv})`)
  })

  server.on('error', (error) => {
    logger.error(error.code === 'EADDRINUSE' ? `Port ${env.port} is already in use. Set PORT in backend/.env.` : error)
    process.exit(1)
  })

  // Finish in-flight requests, then close the database connection.
  let closing = false
  const shutdown = (signal) => {
    if (closing) return
    closing = true
    logger.info(`${signal} received, shutting down`)
    server.close(async () => {
      await disconnectDatabase()
      process.exit(0)
    })
    setTimeout(() => process.exit(1), 10000).unref()
  }
  process.on('SIGINT', () => shutdown('SIGINT'))
  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('unhandledRejection', (reason) => logger.error('Unhandled promise rejection', reason))
}

start()

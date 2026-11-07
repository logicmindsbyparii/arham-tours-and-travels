import mongoose from 'mongoose'
import { env } from './env.js'
import { logger } from '../utils/logger.js'

mongoose.set('strictQuery', true)

export async function connectDatabase(uri = env.mongoUri) {
  mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'))
  mongoose.connection.on('reconnected', () => logger.info('MongoDB reconnected'))
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  logger.info(`MongoDB connected (database: ${mongoose.connection.name})`)
}

export async function disconnectDatabase() {
  await mongoose.disconnect()
}

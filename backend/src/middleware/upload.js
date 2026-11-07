import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import multer from 'multer'
import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'

export const uploadRoot = path.resolve(env.uploadDir)
fs.mkdirSync(uploadRoot, { recursive: true })

// Only raster images. SVG is refused because it can carry scripts.
export const IMAGE_TYPES = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
}

// The stored name is random; the client's file name is never used on disk.
const storage = multer.diskStorage({
  destination: uploadRoot,
  filename: (_req, file, done) => done(null, `${Date.now()}-${crypto.randomBytes(8).toString('hex')}${IMAGE_TYPES[file.mimetype]}`),
})

export const imageUpload = multer({
  storage,
  limits: { fileSize: env.maxUploadBytes, files: 1, fields: 5 },
  fileFilter: (_req, file, done) => {
    if (!IMAGE_TYPES[file.mimetype]) return done(ApiError.badRequest('Upload a JPG, PNG or WebP image'))
    done(null, true)
  },
}).single('image')

// The declared type is only a claim; check the file's first bytes too.
export async function hasImageSignature(filePath, mimetype) {
  const handle = await fs.promises.open(filePath, 'r')
  try {
    const { buffer } = await handle.read(Buffer.alloc(12), 0, 12, 0)
    if (mimetype === 'image/jpeg') return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff
    if (mimetype === 'image/png') return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    if (mimetype === 'image/webp') return buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP'
    return false
  } finally {
    await handle.close()
  }
}

import { ApiError } from '../utils/ApiError.js'
import { SLUG_PATTERN, ok } from '../utils/helpers.js'
import * as publicService from '../services/publicService.js'
import { Inquiry } from '../models/Inquiry.js'

// Read-only endpoints for the website. They only ever return published or
// active records (see services/publicService.js).

export async function site(_req, res) {
  ok(res, await publicService.getSiteBundle())
}

export async function packages(_req, res) {
  ok(res, await publicService.listPublicPackages())
}

export async function packageBySlug(req, res) {
  const slug = String(req.params.slug).toLowerCase()
  const item = SLUG_PATTERN.test(slug) ? await publicService.getPublicPackage(slug) : null
  if (!item) throw ApiError.notFound('Package not found')
  ok(res, item)
}

export async function destinations(_req, res) {
  ok(res, await publicService.listPublicDestinations())
}

export async function banners(_req, res) {
  ok(res, await publicService.listPublicBanners())
}

export async function services(_req, res) {
  ok(res, await publicService.listPublicServices())
}

export async function testimonials(_req, res) {
  ok(res, await publicService.listPublicTestimonials())
}

export async function faqs(_req, res) {
  ok(res, await publicService.listPublicFaqs())
}

export async function content(_req, res) {
  ok(res, await publicService.listPublicContent())
}

export async function settings(_req, res) {
  ok(res, await publicService.getPublicSettings())
}

export async function visaCountries(_req, res) {
  ok(res, await publicService.listPublicVisaCountries())
}

export async function visaCountryBySlug(req, res) {
  const slug = String(req.params.slug).toLowerCase()
  const item = SLUG_PATTERN.test(slug) ? await publicService.getPublicVisaCountry(slug) : null
  if (!item) throw ApiError.notFound('Visa country not found')
  ok(res, item)
}

export async function carRental(_req, res) {
  ok(res, await publicService.getPublicCarRental())
}

export async function createInquiry(req, res) {
  const item = await Inquiry.create(req.body)
  res.status(201).json({ success: true, data: item })
}

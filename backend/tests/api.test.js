// End-to-end API tests against a throwaway in-memory MongoDB:
//   npm test
// The first run downloads a MongoDB binary for mongodb-memory-server.
import { after, before, describe, test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { MongoMemoryServer } from 'mongodb-memory-server'

const ORIGIN = 'http://localhost:5173'
const ADMIN = { email: 'owner@example.com', password: 'Correct-horse-42' }

let mongo
let server
let base
let models
let uploadDir

before(async () => {
  mongo = await MongoMemoryServer.create()
  uploadDir = await fs.mkdtemp(path.join(os.tmpdir(), 'arham-uploads-'))
  Object.assign(process.env, {
    NODE_ENV: 'test',
    MONGODB_URI: mongo.getUri('arham_test'),
    JWT_SECRET: 'test-jwt-secret-0123456789-abcdefghijklmnop',
    CSRF_SECRET: 'test-csrf-secret-0123456789-abcdefghijklmno',
    FRONTEND_ORIGIN: ORIGIN,
    COOKIE_SECURE: 'false',
    COOKIE_SAMESITE: 'lax',
    UPLOAD_DIR: uploadDir,
  })

  const { connectDatabase } = await import('../src/config/db.js')
  const { createApp } = await import('../src/app.js')
  const { hashPassword } = await import('../src/services/authService.js')
  const { seedContent } = await import('../scripts/data/importContent.js')
  models = {
    Admin: (await import('../src/models/Admin.js')).Admin,
    Session: (await import('../src/models/Session.js')).Session,
  }

  await connectDatabase()
  await models.Admin.create({ name: 'Owner', email: ADMIN.email, passwordHash: await hashPassword(ADMIN.password) })
  await seedContent()

  server = createApp().listen(0)
  await new Promise((resolve) => server.once('listening', resolve))
  base = `http://127.0.0.1:${server.address().port}`
})

after(async () => {
  server?.close()
  const mongoose = (await import('mongoose')).default
  await mongoose.disconnect()
  await mongo?.stop()
  await fs.rm(uploadDir, { recursive: true, force: true })
})

// Small client that keeps the session cookie and CSRF token like a browser tab.
function client() {
  const state = { cookie: '', csrf: '' }
  async function call(method, url, { body, csrf = true, origin = ORIGIN, raw } = {}) {
    const headers = { Origin: origin }
    if (state.cookie) headers.Cookie = state.cookie
    if (csrf && state.csrf) headers['X-CSRF-Token'] = state.csrf
    if (body !== undefined && !raw) headers['Content-Type'] = 'application/json'
    const res = await fetch(`${base}/api/v1${url}`, {
      method,
      headers,
      body: raw ?? (body === undefined ? undefined : JSON.stringify(body)),
    })
    const setCookie = res.headers.getSetCookie()
    for (const line of setCookie) {
      const [pair] = line.split(';')
      if (pair.startsWith('arham_admin_session=')) state.cookie = pair.endsWith('=') ? '' : pair
    }
    const json = await res.json().catch(() => null)
    return { status: res.status, json, setCookie }
  }
  return {
    state,
    call,
    async login(credentials = ADMIN) {
      const res = await call('POST', '/auth/login', { body: credentials })
      if (res.status === 200) state.csrf = res.json.data.csrfToken
      return res
    },
  }
}

const packageInput = (overrides = {}) => ({
  title: 'Kerala Backwaters Test',
  region: 'Kerala',
  category: 'domestic',
  nights: 3,
  days: 4,
  price: 25000,
  currency: 'INR',
  priceBasis: 'per person',
  description: 'Houseboat nights on the backwaters.',
  inclusions: ['Houseboat stay', ''],
  exclusions: ['Flights'],
  itinerary: [{ day: 1, title: 'Arrive in Kochi', description: 'Transfer to the hotel.' }],
  image: 'asset:goa-beach',
  status: 'draft',
  ...overrides,
})

describe('public API', () => {
  test('health check reports the database', async () => {
    const res = await fetch(`${base}/api/v1/health`)
    assert.equal(res.status, 200)
    assert.equal((await res.json()).data.database, 'connected')
  })

  test('site bundle contains the imported content', async () => {
    const { status, json } = await client().call('GET', '/public/site')
    assert.equal(status, 200)
    const site = json.data
    assert.equal(site.packages.length, 3)
    assert.equal(site.destinations.length, 6)
    assert.equal(site.banners.length, 6)
    assert.equal(site.services.length, 4)
    assert.equal(site.testimonials.length, 0)
    assert.equal(site.faqs.contact.length, 3)
    assert.equal(site.settings.whatsappNumber, '919824100369')
    assert.equal(site.packages[0].id, 'vietnam-phu-quoc-7n')
    assert.equal(site.destinations[0].package.id, 'vietnam-phu-quoc-7n')
    assert.equal(site.content['home.about'].eyebrow, 'About us')
    assert.equal(site.packages[0].status, undefined, 'status flags are not exposed')
  })

  test('unknown package slug is a 404', async () => {
    const { status } = await client().call('GET', '/public/packages/does-not-exist')
    assert.equal(status, 404)
  })
})

describe('authentication', () => {
  test('admin APIs reject requests without a session', async () => {
    const c = client()
    for (const url of ['/admin/dashboard', '/admin/packages', '/admin/settings', '/admin/activity-logs', '/auth/me']) {
      assert.equal((await c.call('GET', url)).status, 401, url)
    }
    assert.equal((await c.call('POST', '/admin/packages', { body: packageInput() })).status, 401)
  })

  test('session check answers 200 both signed out and signed in', async () => {
    const c = client()
    const out = await c.call('GET', '/auth/session')
    assert.equal(out.status, 200)
    assert.equal(out.json.data.admin, null)
    c.state.cookie = 'arham_admin_session=not-a-real-token'
    const bad = await c.call('GET', '/auth/session')
    assert.equal(bad.status, 200)
    assert.equal(bad.json.data.admin, null)
    c.state.cookie = ''
    await c.login()
    const inside = await c.call('GET', '/auth/session')
    assert.equal(inside.status, 200)
    assert.equal(inside.json.data.admin.email, ADMIN.email)
    assert.ok(inside.json.data.csrfToken)
  })

  test('wrong password and unknown email get the same answer', async () => {
    const wrong = await client().login({ email: ADMIN.email, password: 'nope-nope-1' })
    const unknown = await client().login({ email: 'nobody@example.com', password: 'nope-nope-1' })
    assert.equal(wrong.status, 401)
    assert.equal(unknown.status, 401)
    assert.equal(wrong.json.error.message, unknown.json.error.message)
  })

  test('login sets an HttpOnly cookie and never returns the hash', async () => {
    const c = client()
    const res = await c.login()
    assert.equal(res.status, 200)
    const cookie = res.setCookie.find((line) => line.startsWith('arham_admin_session='))
    assert.match(cookie, /HttpOnly/i)
    assert.match(cookie, /SameSite=Lax/i)
    assert.ok(res.json.data.csrfToken)
    assert.equal(res.json.data.admin.passwordHash, undefined)
    assert.equal(JSON.stringify(res.json).includes('$2'), false)

    const me = await c.call('GET', '/auth/me')
    assert.equal(me.status, 200)
    assert.equal(me.json.data.admin.email, ADMIN.email)
  })

  test('passwords are stored as bcrypt hashes', async () => {
    const admin = await models.Admin.findOne({ email: ADMIN.email }).select('+passwordHash')
    assert.notEqual(admin.passwordHash, ADMIN.password)
    assert.match(admin.passwordHash, /^\$2[aby]\$12\$/)
  })

  test('writes need the CSRF token and an allowed origin', async () => {
    const c = client()
    await c.login()
    const noToken = await c.call('POST', '/admin/faqs', {
      body: { question: 'Q?', answer: 'A.', page: 'contact' },
      csrf: false,
    })
    assert.equal(noToken.status, 403)
    const badOrigin = await c.call('POST', '/admin/faqs', {
      body: { question: 'Q?', answer: 'A.', page: 'contact' },
      origin: 'https://evil.example',
    })
    assert.equal(badOrigin.status, 403)
  })

  test('logout ends the session on the server', async () => {
    const c = client()
    await c.login()
    const stolenCookie = c.state.cookie
    assert.equal((await c.call('POST', '/auth/logout')).status, 200)
    c.state.cookie = stolenCookie
    assert.equal((await c.call('GET', '/auth/me')).status, 401)
  })
})

describe('packages CRUD and publishing', () => {
  const c = client()
  let id

  before(() => c.login())

  test('validation errors come back per field', async () => {
    const res = await c.call('POST', '/admin/packages', { body: packageInput({ title: '', price: -5, image: 'javascript:alert(1)' }) })
    assert.equal(res.status, 422)
    assert.ok(res.json.error.details.title)
    assert.ok(res.json.error.details.price)
    assert.ok(res.json.error.details.image)
  })

  test('create a draft (slug generated, unknown fields ignored)', async () => {
    const res = await c.call('POST', '/admin/packages', { body: packageInput({ _id: 'x', createdAt: '2000-01-01' }) })
    assert.equal(res.status, 201)
    id = res.json.data.id
    assert.equal(res.json.data.slug, 'kerala-backwaters-test')
    assert.deepEqual(res.json.data.inclusions, ['Houseboat stay'])
    assert.notEqual(res.json.data.createdAt.slice(0, 4), '2000')
  })

  test('drafts are hidden from the public API', async () => {
    const list = await client().call('GET', '/public/packages')
    assert.equal(list.json.data.some((item) => item.id === 'kerala-backwaters-test'), false)
    assert.equal((await client().call('GET', '/public/packages/kerala-backwaters-test')).status, 404)
  })

  test('duplicate slugs are refused', async () => {
    const res = await c.call('POST', '/admin/packages', { body: packageInput() })
    assert.equal(res.status, 409)
    assert.ok(res.json.error.details.slug)
  })

  test('list supports search, filters and pagination', async () => {
    const res = await c.call('GET', '/admin/packages?q=kerala&status=draft&category=domestic&page=1&limit=5')
    assert.equal(res.status, 200)
    assert.equal(res.json.data.length, 1)
    assert.equal(res.json.meta.total, 1)
    const page2 = await c.call('GET', '/admin/packages?limit=2&page=2')
    assert.equal(page2.json.meta.pages, 2)
    assert.equal(page2.json.data.length, 2)
    assert.equal((await c.call('GET', '/admin/packages?status=bogus')).status, 400)
  })

  test('publish makes it public, unpublish hides it again', async () => {
    assert.equal((await c.call('PATCH', `/admin/packages/${id}/status`, { body: { status: 'published' } })).status, 200)
    const detail = await client().call('GET', '/public/packages/kerala-backwaters-test')
    assert.equal(detail.status, 200)
    assert.equal(detail.json.data.itinerary[0].title, 'Arrive in Kochi')

    assert.equal((await c.call('PATCH', `/admin/packages/${id}/status`, { body: { status: 'draft' } })).status, 200)
    assert.equal((await client().call('GET', '/public/packages/kerala-backwaters-test')).status, 404)
  })

  test('update persists', async () => {
    const res = await c.call('PUT', `/admin/packages/${id}`, { body: packageInput({ price: 27999, status: 'published' }) })
    assert.equal(res.status, 200)
    const fresh = await c.call('GET', `/admin/packages/${id}`)
    assert.equal(fresh.json.data.price, 27999)
    const site = await client().call('GET', '/public/site')
    assert.equal(site.json.data.packages.find((item) => item.id === 'kerala-backwaters-test').price, 27999)
  })

  test('invalid and missing ids are 404s', async () => {
    assert.equal((await c.call('GET', '/admin/packages/not-an-id')).status, 404)
    assert.equal((await c.call('GET', '/admin/packages/64b7f0f0f0f0f0f0f0f0f0f0')).status, 404)
  })

  test('delete removes it everywhere and unlinks destinations', async () => {
    const dest = await c.call('POST', '/admin/destinations', {
      body: { name: 'Alleppey', tagline: 'Backwaters.', image: 'asset:goa-beach', package: id, status: 'published' },
    })
    assert.equal(dest.status, 201)
    assert.equal((await c.call('DELETE', `/admin/packages/${id}`)).status, 200)
    assert.equal((await c.call('GET', `/admin/packages/${id}`)).status, 404)
    const destAfter = await c.call('GET', `/admin/destinations/${dest.json.data.id}`)
    assert.equal(destAfter.json.data.package, null)
    assert.equal((await client().call('GET', '/public/packages/kerala-backwaters-test')).status, 404)
  })
})

describe('visa countries CRUD, publishing and bulk import', () => {
  const c = client()
  before(() => c.login())

  let id
  const countryInput = (overrides = {}) => ({
    name: 'Testland Alpha',
    tagline: 'Tourist visa support for Testland.',
    flag: '🏳️',
    processingTime: 'Usually 5–7 working days',
    stayDuration: 'Up to 30 days',
    validity: '90 days',
    entryType: 'Single entry',
    documentGroups: [
      {
        title: 'Common documents',
        items: ['Passport with 6 months validity', 'Photographs (4.5 x 3.5 cm)', 'Bank statement for last 6 months'],
      },
      {
        title: 'If you are employed',
        items: ['Leave letter from employer', 'Salary slips for 3 months'],
      },
    ],
    charges: [
      {
        visaType: 'Tourist single entry',
        currency: 'INR',
        embassyFee: 2500,
        serviceFee: 1500,
        processingTime: '5 working days',
        note: 'Non-refundable fee',
      },
    ],
    chargesNote: 'Fees change with embassy rates.',
    notes: 'Requirements change by embassy; we confirm the exact list when you enquire.',
    status: 'draft',
    sortOrder: 10,
    ...overrides,
  })

  test('validation errors come back per field', async () => {
    const res = await c.call('POST', '/admin/visa-countries', { body: {} })
    assert.equal(res.status, 422)
    assert.equal(typeof res.json.error.details.name, 'string')

    const badSlug = await c.call('POST', '/admin/visa-countries', { body: countryInput({ slug: 'Not A Slug!' }) })
    assert.equal(badSlug.status, 422)
    assert.equal(typeof badSlug.json.error.details.slug, 'string')

    const badFee = await c.call('POST', '/admin/visa-countries', {
      body: countryInput({
        charges: [{ visaType: 'Tourist', embassyFee: -100, serviceFee: 500 }],
      }),
    })
    assert.equal(badFee.status, 422)
    assert.ok(badFee.json.error.details['charges.0.embassyFee'])
  })

  test('create a draft (slug generated, document groups stored)', async () => {
    const res = await c.call('POST', '/admin/visa-countries', { body: countryInput() })
    assert.equal(res.status, 201)
    assert.equal(res.json.data.slug, 'testland-alpha')
    assert.equal(res.json.data.documentGroups.length, 2)
    assert.equal(res.json.data.documentGroups[0].items.length, 3)
    assert.equal(res.json.data.charges.length, 1)
    id = res.json.data.id
  })

  test('drafts are hidden from /public/visa-countries and /public/site', async () => {
    const publicList = await client().call('GET', '/public/visa-countries')
    assert.equal(publicList.status, 200)
    assert.equal(publicList.json.data.some((country) => country.id === 'testland-alpha'), false)

    const site = await client().call('GET', '/public/site')
    assert.equal(site.status, 200)
    assert.equal(site.json.data.visaCountries.some((country) => country.id === 'testland-alpha'), false)

    const single = await client().call('GET', '/public/visa-countries/testland-alpha')
    assert.equal(single.status, 404)
  })

  test('duplicate slugs are refused', async () => {
    const dup = await c.call('POST', '/admin/visa-countries', { body: countryInput({ name: 'Testland Alpha' }) })
    assert.equal(dup.status, 409)
  })

  test('list supports search, filters and pagination', async () => {
    const search = await c.call('GET', '/admin/visa-countries?q=Testland')
    assert.equal(search.status, 200)
    assert.ok(search.json.data.some((item) => item.id === id))

    const filtered = await c.call('GET', '/admin/visa-countries?status=draft')
    assert.equal(filtered.status, 200)
    assert.ok(filtered.json.data.some((item) => item.id === id))

    const paged = await c.call('GET', '/admin/visa-countries?page=1&limit=2')
    assert.equal(paged.status, 200)
    assert.ok(paged.json.data.length >= 1)
    assert.ok(paged.json.meta.pages >= 1)
  })

  test('publish makes it visible, unpublish hides it again', async () => {
    const pub = await c.call('PATCH', `/admin/visa-countries/${id}/status`, { body: { status: 'published' } })
    assert.equal(pub.status, 200)

    const publicList = await client().call('GET', '/public/visa-countries')
    const item = publicList.json.data.find((c) => c.id === 'testland-alpha')
    assert.ok(item, 'Should appear in /public/visa-countries')
    assert.equal(item.name, 'Testland Alpha')
    assert.equal(item.flag, '🏳️')
    assert.equal(item.documentGroups.length, 2)
    assert.equal(item.charges.length, 1)
    assert.equal(item.charges[0].embassyFee, 2500)
    assert.equal(item.charges[0].serviceFee, 1500)
    assert.equal(item.charges[0].total, 4000)
    assert.equal(item.chargesNote, 'Fees change with embassy rates.')
    assert.equal(item.status, undefined)
    assert.equal(item._id, undefined)

    const single = await client().call('GET', '/public/visa-countries/testland-alpha')
    assert.equal(single.status, 200)
    assert.equal(single.json.data.id, 'testland-alpha')
    assert.equal(single.json.data.name, 'Testland Alpha')

    const site = await client().call('GET', '/public/site')
    assert.ok(site.json.data.visaCountries.some((c) => c.id === 'testland-alpha'))

    await c.call('PATCH', `/admin/visa-countries/${id}/status`, { body: { status: 'draft' } })
    assert.equal((await client().call('GET', '/public/visa-countries/testland-alpha')).status, 404)
  })

  test('update persists', async () => {
    const res = await c.call('PUT', `/admin/visa-countries/${id}`, {
      body: countryInput({ tagline: 'Updated tagline for Testland.', status: 'published' }),
    })
    assert.equal(res.status, 200)
    const read = await c.call('GET', `/admin/visa-countries/${id}`)
    assert.equal(read.json.data.tagline, 'Updated tagline for Testland.')

    const site = await client().call('GET', '/public/site')
    const match = site.json.data.visaCountries.find((c) => c.id === 'testland-alpha')
    assert.ok(match)
    assert.equal(match.tagline, 'Updated tagline for Testland.')
  })

  test('delete removes it everywhere', async () => {
    assert.equal((await c.call('DELETE', `/admin/visa-countries/${id}`)).status, 200)
    assert.equal((await c.call('GET', `/admin/visa-countries/${id}`)).status, 404)
    assert.equal((await client().call('GET', '/public/visa-countries/testland-alpha')).status, 404)
  })

  test('bulk import handles valid rows, per-field errors and upserts by slug', async () => {
    // 1. Valid import of draft countries
    const batch = [
      countryInput({
        name: 'Testland Beta',
        slug: 'testland-beta',
        status: 'published', // must be forced to draft!
      }),
      countryInput({
        name: 'Testland Gamma',
        slug: 'testland-gamma',
      }),
    ]
    const importRes = await c.call('POST', '/admin/visa-countries/import', { body: batch })
    assert.equal(importRes.status, 200)
    assert.equal(importRes.json.data.length, 2)
    assert.equal(importRes.json.data[0].status, 'created')
    assert.equal(importRes.json.data[0].slug, 'testland-beta')
    assert.equal(importRes.json.data[1].status, 'created')
    assert.equal(importRes.json.data[1].slug, 'testland-gamma')

    // Verify imported rows stay hidden as drafts
    const publicList = await client().call('GET', '/public/visa-countries')
    assert.equal(publicList.json.data.some((c) => c.id === 'testland-beta'), false)

    // 2. Invalid row reports charges.0.embassyFee
    const invalidBatch = [
      countryInput({
        name: 'Testland Delta',
        slug: 'testland-delta',
        charges: [{ visaType: 'Tourist', embassyFee: -200, serviceFee: 100 }],
      }),
    ]
    const invalidRes = await c.call('POST', '/admin/visa-countries/import', { body: invalidBatch })
    assert.equal(invalidRes.status, 200)
    assert.equal(invalidRes.json.data[0].status, 'failed')
    assert.ok(invalidRes.json.data[0].errors['charges.0.embassyFee'])

    // 3. Re-import updates instead of duplicating
    const updateBatch = [
      countryInput({
        name: 'Testland Beta Updated',
        slug: 'testland-beta',
        tagline: 'Brand new tagline for Beta.',
      }),
    ]
    const updateRes = await c.call('POST', '/admin/visa-countries/import', { body: updateBatch })
    assert.equal(updateRes.status, 200)
    assert.equal(updateRes.json.data[0].status, 'updated')

    const read = await c.call('GET', '/admin/visa-countries?q=testland-beta')
    const betaItem = read.json.data.find((c) => c.slug === 'testland-beta')
    assert.ok(betaItem)
    assert.equal(betaItem.tagline, 'Brand new tagline for Beta.')
    assert.equal(betaItem.status, 'draft')

    // Clean up test records
    await c.call('DELETE', `/admin/visa-countries/${betaItem.id}`)
    const gammaList = await c.call('GET', '/admin/visa-countries?q=testland-gamma')
    const gammaItem = gammaList.json.data.find((c) => c.slug === 'testland-gamma')
    if (gammaItem) await c.call('DELETE', `/admin/visa-countries/${gammaItem.id}`)
  })
})

describe('other modules', () => {
  const c = client()
  before(() => c.login())

  const cases = [
    ['destinations', { name: 'Munnar', tagline: 'Tea hills.', image: 'asset:hero-peaks', status: 'published' }, { tagline: 'Tea gardens.' }],
    ['banners', { name: 'Munnar slide', titleLine1: 'Munnar', titleLine2: 'Hills', subtitle: 'Tea country.', image: 'asset:hero-peaks', ctaLink: '/packages' }, { subtitle: 'Green hills.' }],
    ['services', { title: 'Travel Insurance', summary: 'Cover for your trip.', icon: 'ShieldCheck', status: 'published' }, { summary: 'Trip cover.' }],
    ['testimonials', { name: 'Test Customer', quote: 'Test quote.', rating: 5, status: 'draft' }, { quote: 'Updated quote.' }],
    ['faqs', { question: 'Test question?', answer: 'Test answer.', page: 'services', status: 'published' }, { answer: 'New answer.' }],
  ]

  for (const [resource, input, change] of cases) {
    test(`${resource}: create, read, update, delete`, async () => {
      const created = await c.call('POST', `/admin/${resource}`, { body: input })
      assert.equal(created.status, 201, JSON.stringify(created.json))
      const recordId = created.json.data.id
      const updated = await c.call('PUT', `/admin/${resource}/${recordId}`, { body: { ...input, ...change } })
      assert.equal(updated.status, 200, JSON.stringify(updated.json))
      const read = await c.call('GET', `/admin/${resource}/${recordId}`)
      for (const [field, value] of Object.entries(change)) assert.equal(read.json.data[field], value)
      const list = await c.call('GET', `/admin/${resource}?limit=100`)
      assert.ok(list.json.data.some((item) => item.id === recordId))
      assert.equal((await c.call('DELETE', `/admin/${resource}/${recordId}`)).status, 200)
      assert.equal((await c.call('GET', `/admin/${resource}/${recordId}`)).status, 404)
    })
  }

  test('FAQ list filters by page without clashing with pagination', async () => {
    const res = await c.call('GET', '/admin/faqs?faqPage=contact&page=1&limit=10&status=all')
    assert.equal(res.status, 200, JSON.stringify(res.json))
    assert.ok(res.json.data.length > 0)
    assert.ok(res.json.data.every((faq) => faq.page === 'contact'))
    assert.equal((await c.call('GET', '/admin/faqs?page=1&limit=10')).status, 200)
  })

  test('banners reject unsafe CTA links and toggle active', async () => {
    const bad = await c.call('POST', '/admin/banners', {
      body: { name: 'x', titleLine1: 'X', subtitle: 'x', image: 'asset:goa-beach', ctaLink: 'javascript:alert(1)' },
    })
    assert.equal(bad.status, 422)
    const list = await c.call('GET', '/admin/banners?limit=1&sort=order')
    const banner = list.json.data[0]
    assert.equal((await c.call('PATCH', `/admin/banners/${banner.id}/active`, { body: { active: false } })).status, 200)
    const site = await client().call('GET', '/public/site')
    assert.equal(site.json.data.banners.some((item) => item.id === banner.id), false)
    await c.call('PATCH', `/admin/banners/${banner.id}/active`, { body: { active: true } })
  })

  test('draft testimonials stay private until published', async () => {
    const created = await c.call('POST', '/admin/testimonials', { body: { name: 'Private', quote: 'Hidden.' } })
    let site = await client().call('GET', '/public/site')
    assert.equal(site.json.data.testimonials.length, 0)
    await c.call('PATCH', `/admin/testimonials/${created.json.data.id}/status`, { body: { status: 'published' } })
    site = await client().call('GET', '/public/site')
    assert.equal(site.json.data.testimonials.length, 1)
    await c.call('DELETE', `/admin/testimonials/${created.json.data.id}`)
  })

  test('website content: update a section, duplicate keys refused', async () => {
    const list = await c.call('GET', '/admin/content?key=home.about')
    const section = list.json.data[0]
    const res = await c.call('PUT', `/admin/content/${section.id}`, { body: { ...section, title: 'Your trip,' } })
    assert.equal(res.status, 200)
    const site = await client().call('GET', '/public/site')
    assert.equal(site.json.data.content['home.about'].title, 'Your trip,')
    const dup = await c.call('POST', '/admin/content', { body: { key: 'home.about', title: 'x' } })
    assert.equal(dup.status, 409)
  })

  test('settings validate and save', async () => {
    const current = (await c.call('GET', '/admin/settings')).json.data
    const bad = await c.call('PUT', '/admin/settings', { body: { ...current, whatsappNumber: 'abc', socialLinks: [{ label: 'X', url: 'javascript:1' }] } })
    assert.equal(bad.status, 422)
    assert.ok(bad.json.error.details.whatsappNumber)
    const good = await c.call('PUT', '/admin/settings', { body: { ...current, whatsappNumber: '+91 98241 00369' } })
    assert.equal(good.status, 200)
    assert.equal(good.json.data.whatsappNumber, '919824100369')
  })

  test('dashboard returns real counts', async () => {
    const res = await c.call('GET', '/admin/dashboard')
    assert.equal(res.status, 200)
    assert.equal(res.json.data.counts.packages.total, 3)
    assert.equal(res.json.data.counts.services.total, 4)
    assert.ok(typeof res.json.data.counts.visaCountries?.total === 'number')
    assert.ok(res.json.data.recentActivity.length > 0)
  })

  test('activity log records actions without secrets', async () => {
    const res = await c.call('GET', '/admin/activity-logs?limit=100')
    const actions = new Set(res.json.data.map((entry) => entry.action))
    for (const action of ['login', 'logout', 'create', 'update', 'delete', 'publish', 'unpublish']) assert.ok(actions.has(action), action)
    assert.equal(JSON.stringify(res.json).includes(ADMIN.password), false)
    const filtered = await c.call('GET', '/admin/activity-logs?action=publish')
    assert.ok(filtered.json.data.every((entry) => entry.action === 'publish'))
  })
})

describe('uploads', () => {
  const c = client()
  before(() => c.login())

  const PNG = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64',
  )

  async function upload(bytes, type, name) {
    const form = new FormData()
    form.append('image', new Blob([bytes], { type }), name)
    return c.call('POST', '/admin/uploads', { raw: form })
  }

  test('a real PNG is stored and served', async () => {
    const res = await upload(PNG, 'image/png', 'pixel.png')
    assert.equal(res.status, 201, JSON.stringify(res.json))
    assert.match(res.json.data.url, /^\/uploads\/[\w-]+\.png$/)
    const file = await fetch(`${base}${res.json.data.url}`)
    assert.equal(file.status, 200)
    assert.equal(file.headers.get('cross-origin-resource-policy'), 'cross-origin')
  })

  test('a disguised or unsupported file is refused', async () => {
    assert.equal((await upload(Buffer.from('<svg onload=alert(1)>'), 'image/png', 'x.png')).status, 400)
    assert.equal((await upload(Buffer.from('<svg/>'), 'image/svg+xml', 'x.svg')).status, 400)
  })
})

describe('profile and password', () => {
  test('profile update and password change sign out other devices', async () => {
    const laptop = client()
    const phone = client()
    await laptop.login()
    await phone.login()

    const profile = await laptop.call('PUT', '/admin/profile', { body: { name: 'Owner Renamed', email: ADMIN.email } })
    assert.equal(profile.status, 200)
    assert.equal(profile.json.data.name, 'Owner Renamed')

    const wrong = await laptop.call('PUT', '/admin/profile/password', {
      body: { currentPassword: 'wrong-pass-1', newPassword: 'New-password-77', confirmPassword: 'New-password-77' },
    })
    assert.equal(wrong.status, 422)
    const weak = await laptop.call('PUT', '/admin/profile/password', {
      body: { currentPassword: ADMIN.password, newPassword: 'short', confirmPassword: 'short' },
    })
    assert.equal(weak.status, 422)

    const changed = await laptop.call('PUT', '/admin/profile/password', {
      body: { currentPassword: ADMIN.password, newPassword: 'New-password-77', confirmPassword: 'New-password-77' },
    })
    assert.equal(changed.status, 200)
    assert.equal((await laptop.call('GET', '/auth/me')).status, 200, 'current device stays signed in')
    assert.equal((await phone.call('GET', '/auth/me')).status, 401, 'other device is signed out')
    assert.equal((await client().login()).status, 401, 'old password no longer works')
    assert.equal((await client().login({ email: ADMIN.email, password: 'New-password-77' })).status, 200)
  })
})

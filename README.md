# Arham Tours & Travels

Public travel website plus a secure admin panel for managing its content.

```
arham-toursandtravels/
├── frontend/   React 19 + Vite 8 + Tailwind CSS 4 + Redux Toolkit
│   └── src/
│       ├── admin/          Admin panel (/admin/*), loaded only by admins
│       ├── features/site/  Loads published content from the API
│       ├── lib/api.js      The one HTTP client (cookies + CSRF header)
│       └── …               The public website (unchanged design)
└── backend/    Node.js + Express 5 + MongoDB (Mongoose 8)
    ├── src/
    │   ├── config/        Environment validation, database connection
    │   ├── controllers/   Request handlers (shared CRUD factory)
    │   ├── middleware/    Auth, CSRF, validation, rate limits, uploads, errors
    │   ├── models/        Mongoose schemas
    │   ├── routes/        /api/v1 routes (public, auth, admin)
    │   ├── services/      Auth sessions, activity log, public serialisation
    │   ├── validators/    zod schemas (whitelist every writable field)
    │   ├── app.js         Express app
    │   └── server.js      Start-up and graceful shutdown
    ├── scripts/           seedAdmin, seedContent, devMemoryServer, checkSyntax
    └── tests/             API integration tests
```

## How it works

- **Visitors** browse without any account. They contact the business by
  WhatsApp (`wa.me` links with a pre-filled, URL-encoded message that names the
  package) or by phone (`tel:` links). There is no customer login or sign-up.
- **The website** loads everything it shows from `GET /api/v1/public/site`.
  That endpoint returns only **published** packages, destinations, services,
  testimonials, FAQs and website sections, and only **active** hero banners.
- **The admin panel** (`/admin`) edits the same database, and the database
  is the only source of truth. Whatever you **edit, delete, unpublish or
  deactivate** shows on the website: unpublished/deleted packages,
  destinations, services, testimonials and FAQs disappear; an unpublished or
  deleted *Website content* section is hidden (a page banner, a section
  heading, or the whole About section); with no active hero banner the hero is
  hidden. Open website tabs in the same browser update at once; other tabs
  and devices within 30 seconds or when the tab is focused; new visits always
  get the current data. The content bundled with the website is only shown
  to a first-time visitor if the API cannot be reached at all.

## Requirements

- Node.js **20.19+ or 22.12+** (tested with Node 22.17.0, npm 10.9.2)
- MongoDB 6+ (local install or MongoDB Atlas)

## 1. Install

```bash
cd backend  && npm ci
cd ../frontend && npm ci
```

## 2. Configure

### Backend (`backend/.env`)

```bash
cd backend
cp .env.example .env
```

Fill in:

| Variable | Purpose |
| --- | --- |
| `MONGODB_URI` | e.g. `mongodb://127.0.0.1:27017/arham_tours` or an Atlas `mongodb+srv://…` URI |
| `JWT_SECRET`, `CSRF_SECRET` | Two **different** random strings, 32+ characters. Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
| `FRONTEND_ORIGIN` | Website origin(s) allowed to call the API, comma-separated. Dev: `http://localhost:5173` |
| `SESSION_TTL_HOURS` | Admin session length (default 8) |
| `COOKIE_SECURE` / `COOKIE_SAMESITE` / `COOKIE_DOMAIN` | Session cookie settings (see Production) |
| `TRUST_PROXY` | `1` behind a reverse proxy / load balancer |
| `UPLOAD_DIR`, `MAX_UPLOAD_MB` | Where uploaded images are stored (default `uploads/`, 5 MB) |
| `SEED_ADMIN_*` | Used once by `npm run seed:admin` |

The server refuses to start, with a clear message, if a required variable is
missing or unsafe (short secrets, `COOKIE_SECURE=false` in production, …).

### Frontend (`frontend/.env`)

```bash
cd frontend
cp .env.example .env     # VITE_API_URL=http://localhost:5000/api/v1
```

Only the API address goes here. Never put secrets in `VITE_*` variables:
they are visible to every visitor.

## 3. Create the first admin (securely)

There is **no registration page or endpoint**. Create the admin on the server:

```bash
cd backend
# set SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD in .env (or the shell), then:
npm run seed:admin
```

- The password must be 10+ characters with a letter and a number.
- It is hashed with bcrypt (cost 12) before it is stored; it is never logged.
- Running it again for an existing email changes nothing.
- **Remove `SEED_ADMIN_PASSWORD` from `.env` afterwards.** Change the
  password later under *My profile* in the admin panel.

## 4. Import the existing website content (once)

```bash
cd backend
npm run seed:content
```

Imports the current packages, destinations, hero slides, services, FAQs,
section text and business details, all published. It only creates what is
missing, so it never overwrites admin edits. No testimonials are imported:
the site never had real reviews, and none are invented.

## 5. Run

```bash
# terminal 1
cd backend && npm run dev        # API: http://localhost:5000/api/v1

# terminal 2
cd frontend && npm run dev       # Website: http://localhost:5173
                                 # Admin:   http://localhost:5173/admin/login
```

**No MongoDB installed yet?** `cd backend && npm run dev:memory` starts the
API on a temporary in-memory database, imports the content and creates the
admin from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`. All data is lost when
it stops; use it for trying things out only.

### Other commands

```bash
cd frontend
npm run build      # production build into dist/ (+ per-page SEO HTML, sitemap)
npm run preview    # serve the build at http://localhost:4173
npm run lint

cd backend
npm start          # production start
npm test           # API integration tests (in-memory MongoDB; first run downloads it)
npm run check      # syntax check of every backend file
```

## Admin panel

| Route | What it manages |
| --- | --- |
| `/admin/login` | Sign in (email + password, show/hide, rate limited) |
| `/admin/dashboard` | Live counts, recent packages, recent activity, quick actions |
| `/admin/packages`, `/new`, `/edit/:id` | Packages: full form (pricing, itinerary, inclusions/exclusions, highlights, dates, images, gallery, flyer, SEO), preview, publish/unpublish, delete |
| `/admin/destinations` | Destinations, linked to a package |
| `/admin/banners` | Home page hero slides (order, active, CTA) |
| `/admin/content` | Headings, text and images of website sections |
| `/admin/services` | Travel services |
| `/admin/testimonials` | Real customer reviews (section appears once one is published) |
| `/admin/faqs` | FAQ per page |
| `/admin/settings` | Business name, WhatsApp number and default message, phones, email, address, social links, logo, home SEO |
| `/admin/profile` | Name/email, password change (signs out other devices) |
| `/admin/activity-logs` | Who did what, when |

Every list has search, filters, sorting and pagination. Deleting always asks
for confirmation. Success messages appear only after the server confirms.

The admin uses its own light theme (`admin-*` colours in
`frontend/src/styles/global.css`); the public site's colours are untouched.

## WhatsApp and phone

Set them under **Business settings** in the admin:

- *WhatsApp number*: country code + number, digits only (`919824100369`).
  Spaces and `+` are removed automatically.
- *Phone numbers*: how each is shown (`+91 98241 00369`) and its digits; the
  site renders `tel:+<digits>` links.

> The WhatsApp number imported from the old site (98241 00369) is the listed
> phone number; arhamtours.in did not confirm it is on WhatsApp. Check it with
> the *Test WhatsApp link* button.

## Images

- The website's original photos stay bundled with the frontend and are
  referenced as `asset:<name>` (see `frontend/src/data/imageAssets.js`).
- New images uploaded in the admin are checked (JPG, PNG or WebP only, by
  type **and** file signature; max `MAX_UPLOAD_MB`), given a random name and
  stored on disk in `backend/uploads/`, served at `/uploads/<file>`. No image
  data is stored in MongoDB.
- Any `https://` image URL can also be pasted.
- **Production:** keep `backend/uploads/` on persistent storage (a mounted
  volume) and back it up. On hosts with ephemeral disks, switch to a cloud
  store (e.g. S3 or Cloudinary) by replacing `middleware/upload.js` and
  `uploadImage` in `controllers/adminControllers.js`; nothing else depends on
  where files live.

## Security summary

- Passwords: bcrypt (cost 12); hashes never leave the server.
- Sessions: JWT (HS256) in an **HttpOnly** cookie, backed by a session row in
  MongoDB. Logout deletes the row, so a copied cookie stops working at once.
  A password change signs out all other devices. Sessions expire after
  `SESSION_TTL_HOURS`.
- CSRF: every admin write needs an `X-CSRF-Token` header (HMAC of the
  session id, delivered in the response body, never in a cookie) and an
  allowed `Origin`.
- CORS limited to `FRONTEND_ORIGIN`; Helmet security headers; rate limits on
  sign-in (10 failures / 15 min / IP), password changes and uploads, and the
  whole API.
- Input: zod schemas whitelist each field (no mass assignment), validate
  ObjectIds, slugs, phone numbers, URLs and image references, and reject
  `javascript:` links. React escapes all text; the admin never renders HTML.
- Errors: one JSON format; stack traces are logged, never returned.
- Activity log: sign-ins, sign-outs, creates, updates, deletes, publish and
  unpublish, settings, uploads and password changes. Never passwords or
  tokens.

## Troubleshooting

| Problem | Fix |
| --- | --- |
| `Could not connect to MongoDB` | Start MongoDB, or check `MONGODB_URI`. Atlas: allow your IP under *Network Access*. |
| `Invalid environment configuration` | The message names the variable; see `backend/.env.example`. |
| Admin login works but every page says *session ended* | The cookie is not being sent. Website and API must match `FRONTEND_ORIGIN` exactly (scheme + host + port). For different domains use HTTPS with `COOKIE_SECURE=true` and `COOKIE_SAMESITE=none`. |
| CORS error in the browser console | Add the website's exact origin to `FRONTEND_ORIGIN` and restart the API. |
| *Security token missing or invalid* | Reload the admin page (the CSRF token is fetched on load). |
| `Port 5000 is already in use` | Set `PORT` in `backend/.env` and update `VITE_API_URL`. |
| Website still shows old content | It refreshes when you return to the tab; or reload. Check `GET /api/v1/public/site`. |
| Uploaded images do not show | Check `UPLOAD_DIR` exists and is writable, and that `VITE_API_URL` points at the API. |

## Production deployment

1. Serve both over **HTTPS**. Set `NODE_ENV=production`, `COOKIE_SECURE=true`.
2. Same site (e.g. `example.com` + `api.example.com`): keep
   `COOKIE_SAMESITE=lax`. Different sites: `COOKIE_SAMESITE=none`.
3. `FRONTEND_ORIGIN=https://www.example.com` (all real origins).
4. Behind a proxy, set `TRUST_PROXY=1`.
5. Build the frontend with the production `VITE_API_URL`, and serve
   `frontend/dist` with a fallback to `index.html` for unknown paths
   (needed for `/admin/*` and other client routes). Update `SITE_URL` in
   `frontend/src/config/business.js` if the domain changes.
6. Run the API with a process manager (e.g. `pm2 start src/server.js`) and
   persistent storage for `uploads/`. Back up MongoDB.
7. Run `npm run seed:admin` once, then remove `SEED_ADMIN_PASSWORD`.

Build-time SEO tags and `sitemap.xml` (`frontend/scripts/prerender.js`) still
use `frontend/src/config/business.js`; the home page title and description
set in the admin apply while the page runs.

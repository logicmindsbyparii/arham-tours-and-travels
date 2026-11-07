# Arham Tours & Travels website

> Content is now managed in the admin panel and served by the API in
> `../backend`. See the root **README.md** for setup. The `src/data` files
> below are the built-in copy used to seed the database and as a fallback.

A multi-page travel website (Home, Packages, Destinations, Services, Car Rental,
About, Contact) built with React 19, Vite 8, Tailwind CSS 4,
Redux Toolkit and Framer Motion.

## Requirements

- Node.js 20.19+ or 22.12+ (tested with Node 22.17.0 and npm 10.9.2)

## Run it

```bash
npm ci          # install the exact versions in package-lock.json
npm run dev     # development server at http://localhost:5173
npm run build   # production build into dist/, then scripts/prerender.js writes
                # per-page HTML (SEO tags), sitemap.xml and robots.txt
npm run preview # serve the production build at http://localhost:4173
npm run lint    # ESLint
```

## Where things live

```
src/
  app/store.js                 Redux store (slider + inquiry slices)
  config/business.js           Contact details, address, WhatsApp number  <- edit here
  data/                        All content: packages, destinations, services, testimonials, navigation
  assets/images/               Destination and service photos (local WebP)
  assets/flyers/               Official package flyers from arhamtours.in
  components/layout/           Header, Footer, floating WhatsApp button
  components/ui/               Button, Container, SectionHeading, Logo, Reveal, SmartImage, Tabs
  features/slider/             Hero slider state
  features/inquiry/            Enquiry form, validation, WhatsApp link builder, useEnquire hook
  features/packages/           Tour packages section (Featured / Domestic / International)
  features/destinations/       Destination gallery (pinned horizontal scroll on desktop)
  features/services/           Flights, visas, hotels, cruises
  features/car-rental/         Car rental quote request
  features/testimonials/       Reviews (hidden until real reviews are added)
  sections/                    Hero, About, Contact
  hooks/useMediaQuery.js
  styles/global.css            Tailwind theme tokens and base styles
```

## Content sources and things to confirm before launch

All business content comes from https://arhamtours.in/ (checked October 2026):
contact details from its Contact page and packages from the flyers on its
Tour Package page.

- **WhatsApp number**: the site publishes no WhatsApp link. `WHATSAPP_NUMBER`
  in `src/config/business.js` is set to the listed phone number 98241 00369.
  Confirm that it is on WhatsApp.
- **Package dates**: the published departure dates have passed, so cards say
  "ask for the next dates". Add new dates in `src/data/packages.js`.
- **Services**: arhamtours.in has no service pages for flights, visas, hotels,
  cruises or car rental. The descriptions in `src/data/services.js` are kept
  general. Confirm them with the business.
- **Reviews**: the reviews on arhamtours.in are template placeholders, so none
  are shown. Add real reviews to `src/data/testimonials.js` and the section
  and menu link appear automatically.
- **Social media**: the live site links only to placeholder pages. Add real
  profile URLs to `SOCIAL_LINKS` in `src/config/business.js`.

## How the enquiry form works

The form validates in the browser, then opens WhatsApp with the enquiry
filled in. The visitor presses send in WhatsApp. An email link is offered as
an alternative. Enquiries are not stored: nothing is saved or emailed by the
website itself.

## Photography

Destination and service photos are from Unsplash (Unsplash Licence) and
stored locally in `src/assets/images`.

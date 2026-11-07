// Runs after `vite build`. For every page in src/config/seo.js it writes
// dist/<page>/index.html with that page's title, description, canonical link,
// social preview tags and structured data already in the HTML, so search
// engines and WhatsApp/Facebook link previews get them without running
// JavaScript. Opening /about directly is also served by dist/about/index.html.
// It then writes dist/sitemap.xml and dist/robots.txt.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { SITE_URL } from '../src/config/business.js'
import { PAGES, breadcrumbJsonLd, organizationJsonLd, pageUrl } from '../src/config/seo.js'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const SEO_BLOCK = /<!-- seo:start[\s\S]*?<!-- seo:end -->/

const escapeHtml = (value) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
// Keeps "</script>" inside JSON from closing the script tag.
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`

function headFor(path, ogImage) {
  const { title, description } = PAGES[path]
  const url = pageUrl(path)
  return [
    `<title>${escapeHtml(title)}</title>`,
    `<meta name="description" content="${escapeHtml(description)}" />`,
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:title" content="${escapeHtml(title)}" />`,
    `<meta property="og:description" content="${escapeHtml(description)}" />`,
    `<meta property="og:url" content="${url}" />`,
    ogImage && `<meta property="og:image" content="${SITE_URL}/${ogImage}" />`,
    jsonLd(organizationJsonLd()),
    path !== '/' && jsonLd(breadcrumbJsonLd(path)),
  ]
    .filter(Boolean)
    .join('\n    ')
}

const template = await readFile(join(dist, 'index.html'), 'utf8')
if (!SEO_BLOCK.test(template)) throw new Error('index.html is missing the <!-- seo:start --> ... <!-- seo:end --> block')

// The hero photo of the home page doubles as the link-preview image.
const assets = await readdir(join(dist, 'assets'))
const ogImage = assets.find((name) => name.startsWith('ha-long-bay-hero'))
const ogImagePath = ogImage && `assets/${ogImage}`

for (const path of Object.keys(PAGES)) {
  const file = path === '/' ? join(dist, 'index.html') : join(dist, path.slice(1), 'index.html')
  await mkdir(dirname(file), { recursive: true })
  await writeFile(file, template.replace(SEO_BLOCK, headFor(path, ogImagePath)))
}

const today = new Date().toISOString().slice(0, 10)
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${Object.keys(PAGES)
  .map(
    (path) =>
      `  <url><loc>${pageUrl(path)}</loc><lastmod>${today}</lastmod><priority>${path === '/' ? '1.0' : '0.8'}</priority></url>`,
  )
  .join('\n')}
</urlset>
`
await writeFile(join(dist, 'sitemap.xml'), sitemap)
await writeFile(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)

console.log(`prerender: wrote ${Object.keys(PAGES).length} pages, sitemap.xml and robots.txt`)

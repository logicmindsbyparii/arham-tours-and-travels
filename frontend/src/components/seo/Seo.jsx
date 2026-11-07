import { useEffect, useMemo } from 'react'
import { PAGES, pageUrl } from '../../config/seo.js'
import { useBusiness } from '../../features/site/useSite.js'

// Finds the head tag matching selector, creating it with attrs if it is missing.
function headTag(tagName, selector, attrs) {
  let tag = document.head.querySelector(selector)
  if (!tag) {
    tag = document.createElement(tagName)
    Object.entries(attrs).forEach(([name, value]) => tag.setAttribute(name, value))
    document.head.appendChild(tag)
  }
  return tag
}

const setMeta = (attr, key, content) =>
  headTag('meta', `meta[${attr}="${key}"]`, { [attr]: key }).setAttribute('content', content)

// Keeps the <title>, description, canonical link and social preview tags in
// step with the current page (see config/seo.js). Every page renders one at
// the top. Business and breadcrumb structured data are written into each
// page's HTML at build time (scripts/prerender.js). The home page title and
// description can be overridden under Settings in the admin panel.
function Seo({ path, title, description }) {
  const { seoTitle, seoDescription } = useBusiness()
  const page = useMemo(() => {
    const base = PAGES[path] || {}
    return {
      title: title || (path === '/' ? (seoTitle || base.title) : base.title) || 'Arham Tours & Travels',
      description: description || (path === '/' ? (seoDescription || base.description) : base.description) || '',
    }
  }, [path, seoTitle, seoDescription, title, description])

  useEffect(() => {
    const url = pageUrl(path)
    document.title = page.title
    setMeta('name', 'description', page.description)
    setMeta('property', 'og:title', page.title)
    setMeta('property', 'og:description', page.description)
    setMeta('property', 'og:url', url)
    headTag('link', 'link[rel="canonical"]', { rel: 'canonical' }).setAttribute('href', url)
  }, [path, page])

  return null
}

export function JsonLd({ data }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}

export default Seo

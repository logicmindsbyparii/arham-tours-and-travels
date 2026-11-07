// Common search aliases for popular countries
export const COUNTRY_ALIASES = {
  usa: ['usa', 'us', 'america', 'united states', 'united states of america', 'united state', 'states', 'u.s.a', 'u.s.'],
  uae: ['uae', 'dubai', 'abu dhabi', 'sharjah', 'emirates', 'united arab emirates', 'u.a.e.'],
  'united-kingdom': ['uk', 'britain', 'great britain', 'england', 'london', 'united kingdom', 'u.k.'],
  'schengen-area': ['schengen', 'europe', 'france', 'germany', 'italy', 'switzerland', 'spain', 'netherlands', 'austria', 'greece', 'paris'],
  indonesia: ['indonesia', 'bali', 'jakarta'],
  singapore: ['singapore', 'sg'],
  malaysia: ['malaysia', 'kuala lumpur', 'kl'],
  thailand: ['thailand', 'bangkok', 'phuket', 'thai'],
  vietnam: ['vietnam', 'hanoi', 'da nang', 'phu quoc', 'saigon', 'ho chi minh'],
  'saudi-arabia': ['saudi', 'saudi arabia', 'ksa', 'mecca', 'medina', 'riyadh', 'jeddah'],
  turkey: ['turkey', 'turkiye', 'istanbul'],
  egypt: ['egypt', 'cairo'],
  japan: ['japan', 'tokyo'],
  'south-korea': ['korea', 'south korea', 'seoul'],
  china: ['china', 'beijing', 'shanghai'],
  'hong-kong': ['hong kong', 'hk'],
  australia: ['australia', 'sydney', 'melbourne'],
  'new-zealand': ['new zealand', 'nz', 'auckland'],
  canada: ['canada', 'toronto', 'vancouver'],
  russia: ['russia', 'moscow', 'russian federation'],
}

export const POPULAR_SLUGS = [
  'uae',
  'thailand',
  'singapore',
  'usa',
  'united-kingdom',
  'schengen-area',
  'vietnam',
  'malaysia',
  'indonesia',
]

export function safeFormatPrice(price, currency = 'INR') {
  const num = typeof price === 'number' && !isNaN(price) ? price : 0
  const cur = (currency || 'INR').trim().toUpperCase()
  try {
    return new Intl.NumberFormat(cur === 'INR' ? 'en-IN' : 'en-US', {
      style: 'currency',
      currency: cur,
      maximumFractionDigits: 0,
    }).format(num)
  } catch {
    return `${cur} ${num}`
  }
}

export function findBestMatch(text, countries = []) {
  const q = (text ?? '').trim().toLowerCase()
  if (!q) return null

  // 1. Check aliases first (e.g. "usa" -> USA, "dubai" -> UAE)
  for (const [slug, keywords] of Object.entries(COUNTRY_ALIASES)) {
    if (keywords.some((kw) => kw === q || q === kw || (q.length >= 3 && kw.includes(q)))) {
      const match = countries.find((c) => (c.id || c.slug) === slug)
      if (match) return match
    }
  }

  // 2. Exact match on name or id/slug
  const exact = countries.find(
    (c) =>
      c.name?.toLowerCase() === q ||
      (c.id && c.id.toLowerCase() === q) ||
      (c.slug && c.slug.toLowerCase() === q),
  )
  if (exact) return exact

  // 3. Name starts with query
  const startsWith = countries.find((c) => c.name?.toLowerCase().startsWith(q))
  if (startsWith) return startsWith

  // 4. Name or id/slug contains query
  const contains = countries.find(
    (c) =>
      c.name?.toLowerCase().includes(q) ||
      (c.id && c.id.toLowerCase().includes(q)) ||
      (c.slug && c.slug.toLowerCase() === q),
  )
  return contains || null
}

export function buildChecklistMessage(country) {
  if (!country) return ''
  const lines = [
    `*${country.name} Visa Document Checklist & Charges*`,
    country.tagline ? `${country.tagline}` : '',
    '',
    country.processingTime ? `⏱ Processing Time: ${country.processingTime}` : '',
    country.stayDuration ? `🗓 Stay: ${country.stayDuration}` : '',
    country.validity ? `📅 Validity: ${country.validity}` : '',
    country.entryType ? `🚪 Entry: ${country.entryType}` : '',
  ]

  if (country.charges?.length > 0) {
    lines.push('', '*Visa Charges:*')
    for (const c of country.charges) {
      const cur = c.currency || 'INR'
      const totalFormatted = safeFormatPrice(c.total, cur)
      const embassyFormatted = safeFormatPrice(c.embassyFee, cur)
      const serviceFormatted = safeFormatPrice(c.serviceFee, cur)
      lines.push(`• *${c.visaType}*: ${totalFormatted} (Embassy: ${embassyFormatted} + Service: ${serviceFormatted})`)
      if (c.processingTime) lines.push(`  Time: ${c.processingTime}`)
      if (c.note) lines.push(`  Note: ${c.note}`)
    }
    if (country.chargesNote) {
      lines.push(`_Note: ${country.chargesNote}_`)
    }
  }

  lines.push('', '*Required Documents:*')

  for (const group of country.documentGroups ?? []) {
    lines.push(`\n📁 *${group.title}*`)
    for (const item of group.items ?? []) {
      lines.push(`• ${item}`)
    }
  }

  if (country.notes) {
    lines.push('\n*Important Notes:*')
    lines.push(country.notes)
  }

  lines.push('\n_General guidance. Final requirements and fees are decided by the embassy and confirmed by our team when you enquire._')

  return lines.filter((l) => l !== undefined).join('\n')
}

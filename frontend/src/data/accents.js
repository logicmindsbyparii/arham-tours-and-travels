// The three accent colours each destination can take on (see destinations.js).
// solid: fills behind white text (passes WCAG AA).
// soft: small text, icons and lines on photos.
// deep: text on white paper.
export const ACCENTS = {
  ember: { solid: '#dc2626', soft: '#f87171', deep: '#b91c1c' },
  azure: { solid: '#2563eb', soft: '#93c5fd', deep: '#1d4ed8' },
  jade: { solid: '#15803d', soft: '#86efac', deep: '#166534' },
}

// Package categories: international trips take the blue accent, domestic the green.
export const CATEGORY_TONES = {
  international: { text: 'text-sky-deep', soft: 'bg-sky/10', solid: 'bg-sky' },
  domestic: { text: 'text-leaf-deep', soft: 'bg-leaf/10', solid: 'bg-leaf' },
}

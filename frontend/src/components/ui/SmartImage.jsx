import { useState } from 'react'

// An <img> that falls back to a designed placeholder when there is no image
// or the file fails to load, so a broken image icon never appears. A failed
// load is retried once (a dropped request on a flaky connection) before giving up.
// Images load eagerly: lazy loading can stall inside the 3D/parallax motion wrappers.
function SmartImage({ src, alt = '', label, className = '', imgClassName = '', ...imgProps }) {
  const [errors, setErrors] = useState({ src, count: 0 })
  const attempt = errors.src === src ? errors.count : 0
  const failed = attempt > 1

  if (!src || failed) {
    return (
      <div
        role={alt ? 'img' : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : 'true'}
        className={`relative overflow-hidden bg-[radial-gradient(circle_at_30%_20%,#1d3d6e_0%,#0c1d38_55%,#08142a_100%)] ${className}`}
      >
        <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <g fill="none" stroke="#f4f1ea" strokeOpacity="0.08">
            {[60, 110, 160, 210].map((r) => (
              <circle key={r} cx="320" cy="60" r={r} />
            ))}
          </g>
          <path d="M20 260 C 120 220, 200 120, 340 70" fill="none" stroke="#60a5fa" strokeWidth="2" className="route-line" />
        </svg>
        {label && (
          <span className="absolute bottom-5 left-5 font-display text-4xl italic text-paper/85">{label}</span>
        )}
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={attempt === 1 && !src.startsWith('data:') ? `${src}${src.includes('?') ? '&' : '?'}retry=1` : src}
        alt={alt}
        decoding="async"
        onError={() => setErrors({ src, count: attempt + 1 })}
        className={`h-full w-full object-cover ${imgClassName}`}
        {...imgProps}
      />
    </div>
  )
}

export default SmartImage

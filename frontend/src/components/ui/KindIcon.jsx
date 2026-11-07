import { Earth, LayoutGrid } from 'lucide-react'

// Small marker in front of a menu sub-link: a grid for "all", an IN tag for
// domestic trips and a globe for international ones.
function KindIcon({ kind, className = '' }) {
  if (kind === 'domestic') {
    return (
      <span
        aria-hidden="true"
        className={`inline-flex h-5 min-w-5 items-center justify-center rounded bg-leaf/10 px-1 text-[0.6rem] font-bold tracking-wider text-leaf-deep ${className}`}
      >
        IN
      </span>
    )
  }
  const Icon = kind === 'international' ? Earth : LayoutGrid
  const tone = kind === 'international' ? 'text-sky-deep' : 'text-ember-deep'
  return <Icon size={17} aria-hidden="true" className={`${tone} ${className}`} />
}

export default KindIcon

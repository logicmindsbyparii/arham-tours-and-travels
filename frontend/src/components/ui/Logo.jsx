import logo from '../../assets/brand/arham-logo.webp'
import logoLight from '../../assets/brand/arham-logo-light.webp'
import { useBusiness } from '../../features/site/useSite.js'

// The official Arham Holiday Designer LLP logo on a transparent background.
// onDark swaps in the version with white lettering (the round mark keeps its
// colours) for photos and the navy footer, where the red text would sink in.
// It contains no <a>: wrap it in a link where needed (Header, Footer).
// A logo uploaded under Settings in the admin panel replaces both versions.
function Logo({ onDark = false, className = '' }) {
  const business = useBusiness()
  const builtIn = onDark ? logoLight : logo
  return (
    <span className={`inline-flex items-center ${className}`}>
      <img
        src={business.logo || builtIn}
        alt={business.legalName}
        width="247"
        height="42"
        className={`h-8 w-auto sm:h-[42px] ${onDark ? 'drop-shadow-[0_1px_3px_rgb(15_23_42/0.45)]' : ''}`}
      />
    </span>
  )
}

export default Logo

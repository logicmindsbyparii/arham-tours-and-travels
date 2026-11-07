import { motion } from 'framer-motion'
import { useTilt } from '../../hooks/useTilt.js'

// Soft light that follows the pointer across a tilted card.
export function TiltGlare({ tilt, className = '' }) {
  return (
    <motion.span
      aria-hidden="true"
      style={{ background: tilt.glare, opacity: tilt.hover }}
      className={`pointer-events-none absolute inset-0 z-20 mix-blend-soft-light ${className}`}
    />
  )
}

function Tilt({ as = 'div', max = 7, glare = true, className = '', style, children, ...props }) {
  const tilt = useTilt(max)
  const MotionTag = motion[as]

  return (
    <MotionTag
      {...props}
      {...tilt.handlers}
      style={{ ...tilt.style, ...style }}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      {glare && <TiltGlare tilt={tilt} />}
    </MotionTag>
  )
}

export default Tilt

import { motion } from 'framer-motion'

// Fades and lifts its children into view once, when scrolled to, tipping
// forward slightly in 3D as they arrive.
// MotionConfig reducedMotion="user" (in App.jsx) removes the movement for
// visitors who prefer reduced motion, leaving only the fade.
function Reveal({ as = 'div', delay = 0, y = 28, className = '', children, ...props }) {
  const MotionTag = motion[as]

  return (
    <MotionTag
      initial={{ opacity: 0, y, rotateX: 9, transformPerspective: 1200 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
      {...props}
    >
      {children}
    </MotionTag>
  )
}

export default Reveal

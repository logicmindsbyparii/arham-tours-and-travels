import { motion } from 'framer-motion'

const word = {
  hidden: { opacity: 0, rotateX: -85, y: '0.35em' },
  shown: { opacity: 1, rotateX: 0, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } },
}

// Words flip up into place in 3D, one after another, when scrolled into view.
// Screen readers get the plain text through aria-label.
function SplitHeading({ as = 'h2', text, accent, accentClassName = '', className = '', ...props }) {
  const MotionTag = motion[as]
  const words = [
    ...text.split(' ').map((value) => ({ value, accent: false })),
    ...(accent ? accent.split(' ').map((value) => ({ value, accent: true })) : []),
  ]

  return (
    <MotionTag
      aria-label={accent ? `${text} ${accent}` : text}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: 0.07 }}
      className={`perspective-[900px] ${className}`}
      {...props}
    >
      {words.map((item, index) => (
        <span key={index} aria-hidden="true">
          <motion.span
            variants={word}
            className={`inline-block origin-bottom ${item.accent ? `italic ${accentClassName}` : ''}`}
          >
            {item.value}
          </motion.span>{' '}
        </span>
      ))}
    </MotionTag>
  )
}

export default SplitHeading

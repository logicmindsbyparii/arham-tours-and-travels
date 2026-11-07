import { useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

const SPRING = { stiffness: 160, damping: 18, mass: 0.6 }

// Pointer-driven 3D tilt for cards. Mouse only, so touch scrolling never
// fights it, and switched off for visitors who prefer reduced motion.
export function useTilt(max = 7) {
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0.5)
  const pointerY = useMotionValue(0.5)
  const hover = useSpring(0, SPRING)

  const rotateX = useSpring(useTransform(pointerY, [0, 1], [max, -max]), SPRING)
  const rotateY = useSpring(useTransform(pointerX, [0, 1], [-max, max]), SPRING)
  const glareX = useTransform(pointerX, [0, 1], [0, 100])
  const glareY = useTransform(pointerY, [0, 1], [0, 100])
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgb(255 246 235 / 0.22), transparent 55%)`

  const onPointerMove = (event) => {
    if (reduceMotion || event.pointerType !== 'mouse') return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set((event.clientX - bounds.left) / bounds.width)
    pointerY.set((event.clientY - bounds.top) / bounds.height)
    hover.set(1)
  }

  const onPointerLeave = () => {
    pointerX.set(0.5)
    pointerY.set(0.5)
    hover.set(0)
  }

  return {
    style: { rotateX, rotateY, transformPerspective: 1100 },
    handlers: { onPointerMove, onPointerLeave },
    glare,
    hover,
  }
}

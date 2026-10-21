import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import type { PointerEvent, ReactNode } from 'react'

/** Gently pulls its child toward the pointer — used on primary calls to action. */
export function Magnetic({ children, strength = 0.28, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.3 })
  const move = (e: PointerEvent<HTMLSpanElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  const reset = () => {
    x.set(0)
    y.set(0)
  }
  return (
    <motion.span className={className || 'inline-flex'} style={{ x: sx, y: sy }} onPointerMove={move} onPointerLeave={reset}>
      {children}
    </motion.span>
  )
}

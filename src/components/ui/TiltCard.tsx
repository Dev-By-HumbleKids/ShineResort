import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import type { ReactNode, PointerEvent } from 'react'

/** Perspective tilt with a moving light sheen. Disabled for touch & reduced motion. */
export function TiltCard({ children, className = '', max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion()
  const x = useMotionValue(0.5)
  const y = useMotionValue(0.5)
  const sx = useSpring(x, { stiffness: 160, damping: 18 })
  const sy = useSpring(y, { stiffness: 160, damping: 18 })
  const rotateY = useTransform(sx, [0, 1], [-max, max])
  const rotateX = useTransform(sy, [0, 1], [max, -max])
  const sheen = useTransform(
    [sx, sy],
    ([a, b]: number[]) => `radial-gradient(600px circle at ${a * 100}% ${b * 100}%, rgba(255,255,255,.22), transparent 45%)`,
  )

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width)
    y.set((e.clientY - r.top) / r.height)
  }
  const reset = () => {
    x.set(0.5)
    y.set(0.5)
  }

  return (
    <div style={{ perspective: 1200 }} className={className}>
      <motion.div
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative h-full will-change-transform"
      >
        {children}
        {!reduce && <motion.div aria-hidden style={{ background: sheen }} className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light" />}
      </motion.div>
    </div>
  )
}

import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * The pointer itself is a magnifying glass (see index.css). This adds a small
 * label beside the lens over elements with a `data-cursor` attribute
 * (e.g. "View", "Drag", "Explore"). Fine pointers only.
 */
export function Cursor() {
  const [enabled] = useState(
    () => window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 600, damping: 40, mass: 0.3 })
  const sy = useSpring(y, { stiffness: 600, damping: 40, mass: 0.3 })
  const [label, setLabel] = useState('')

  useEffect(() => {
    if (!enabled) return
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      const el = (e.target as Element | null)?.closest?.('[data-cursor]') as HTMLElement | null
      const next = el?.dataset.cursor ?? ''
      setLabel((l) => (l === next ? l : next))
    }
    const leave = () => setLabel('')
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  return (
    <motion.div aria-hidden className="pointer-events-none fixed left-0 top-0 z-[150]" style={{ x: sx, y: sy }}>
      <AnimatePresence>
        {label && (
          <motion.span
            key={label}
            initial={{ opacity: 0, scale: 0.6, x: 18, y: -34 }}
            animate={{ opacity: 1, scale: 1, x: 22, y: -38 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="absolute left-0 top-0 whitespace-nowrap rounded-full bg-midnight/90 px-3 py-1.5 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-pearl shadow-lg ring-1 ring-gold/50 backdrop-blur"
          >
            {label}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

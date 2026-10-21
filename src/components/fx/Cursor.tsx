import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

/**
 * Decorative follower ring for fine pointers. The native cursor is kept for
 * accessibility; the ring grows over interactive elements and shows a label
 * from the nearest `data-cursor` attribute (e.g. "View", "Drag").
 */
export function Cursor() {
  const [enabled] = useState(
    () => window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })
  const [state, setState] = useState<{ hover: boolean; label: string; visible: boolean }>({ hover: false, label: '', visible: false })

  useEffect(() => {
    if (!enabled) return
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      const t = e.target as Element | null
      const labelled = t?.closest?.('[data-cursor]') as HTMLElement | null
      const interactive = !!t?.closest?.('a,button,[role=tab],label,select,input,textarea,summary')
      const label = labelled?.dataset.cursor ?? ''
      setState((s) => (s.hover === (interactive || !!label) && s.label === label && s.visible ? s : { hover: interactive || !!label, label, visible: true }))
    }
    const leave = () => setState((s) => ({ ...s, visible: false }))
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', leave)
    }
  }, [enabled, x, y])

  if (!enabled) return null
  const big = !!state.label
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[150] mix-blend-difference"
      style={{ x: sx, y: sy, opacity: state.visible ? 1 : 0 }}
    >
      <motion.div
        className="grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-pearl text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-pearl"
        animate={{
          width: big ? 84 : state.hover ? 44 : 22,
          height: big ? 84 : state.hover ? 44 : 22,
          backgroundColor: big ? 'rgba(247,244,237,1)' : 'rgba(247,244,237,0)',
          color: big ? '#000' : '#F7F4ED',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      >
        {big && state.label}
      </motion.div>
    </motion.div>
  )
}

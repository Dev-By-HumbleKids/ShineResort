import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const ease = [0.76, 0, 0.24, 1] as const

/**
 * Once-per-visit opening: a lantern glow, the wordmark drawn in, then the
 * curtain lifts like a tide. Skipped for reduced motion and repeat visits.
 */
export function Intro() {
  const [show, setShow] = useState(() => {
    try {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
      return sessionStorage.getItem('shine.intro') !== '1'
    } catch {
      return false
    }
  })

  useEffect(() => {
    if (!show) return
    try {
      sessionStorage.setItem('shine.intro', '1')
    } catch {
      /* ignore */
    }
    document.documentElement.style.overflow = 'hidden'
    const t = setTimeout(() => setShow(false), 2300)
    return () => {
      clearTimeout(t)
      document.documentElement.style.overflow = ''
    }
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] grid place-items-center overflow-hidden bg-midnight text-pearl"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1.1, ease }}
          aria-hidden
          onClick={() => setShow(false)}
        >
          <motion.div
            className="absolute size-[60vmin] rounded-full bg-[radial-gradient(circle,rgb(199_166_106/0.45),transparent_65%)]"
            initial={{ scale: 0.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          />
          <div className="relative flex flex-col items-center">
            <motion.span
              className="mb-6 block size-2 rounded-full bg-gold shadow-[0_0_30px_10px_rgb(199_166_106/0.6)]"
              initial={{ scale: 0 }}
              animate={{ scale: [0, 1.4, 1] }}
              transition={{ duration: 0.9, delay: 0.1 }}
            />
            <div className="flex overflow-hidden font-serif text-6xl tracking-[0.4em] pl-[0.4em] md:text-8xl">
              {'SHINE'.split('').map((c, i) => (
                <motion.span key={i} initial={{ y: '110%' }} animate={{ y: '0%' }} transition={{ duration: 1, ease, delay: 0.35 + i * 0.07 }}>
                  {c}
                </motion.span>
              ))}
            </div>
            <motion.span
              className="mt-6 block h-px w-48 origin-left bg-gold/70"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, ease, delay: 0.7 }}
            />
            <motion.p
              className="mt-5 text-[0.65rem] uppercase tracking-[0.5em] text-pearl/70"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.8 }}
            >
              Ngwe Saung · Myanmar
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

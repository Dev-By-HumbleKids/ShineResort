import { AnimatePresence, motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme()
  const night = theme === 'night'
  return (
    <button
      onClick={toggle}
      className={`relative grid size-11 place-items-center overflow-hidden rounded-full border border-current/25 transition hover:border-current ${className}`}
      aria-label={night ? 'Switch to day theme' : 'Switch to night theme'}
      title={night ? 'Sunlit shore' : 'Lantern-lit night'}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={theme}
          initial={{ y: 18, opacity: 0, rotate: -40 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -18, opacity: 0, rotate: 40 }}
          transition={{ duration: 0.4 }}
        >
          {night ? <Moon className="size-[18px]" /> : <Sun className="size-[18px]" />}
        </motion.span>
      </AnimatePresence>
    </button>
  )
}

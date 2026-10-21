import { AnimatePresence, motion } from 'framer-motion'
import { CalendarCheck, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { lockScroll } from '../../lib/scroll'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'

export const navItems = [
  { to: '/stay', label: 'Stay' },
  { to: '/experiences', label: 'Experiences' },
  { to: '/dining', label: 'Dining' },
  { to: '/wellness', label: 'Wellness' },
  { to: '/story', label: 'Our Story' },
  { to: '/gallery', label: 'Gallery' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    let last = window.scrollY
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 40)
        setHidden(y > 500 && y > last + 4)
        if (y < last - 4) setHidden(false)
        last = y
        ticking = false
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setOpen(false), [pathname])
  useEffect(() => {
    lockScroll(open)
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  const solid = scrolled && !open

  return (
    <>
      <a href="#main" className="sr-only z-[100] rounded bg-gold px-4 py-2 text-midnight focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <motion.header
        animate={{ y: hidden && !open ? '-100%' : '0%' }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,color,box-shadow] duration-500 ${
          solid ? 'bg-bg/85 text-ink shadow-[0_1px_0_var(--line)] backdrop-blur-xl' : 'text-pearl'
        }`}
      >
        <div className="container-x flex h-20 items-center justify-between gap-6">
          <Link to="/" aria-label="SHINE home" className="shrink-0">
            <Logo />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-8 text-[0.72rem] font-semibold uppercase tracking-[0.2em]">
              {navItems.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} className="link-underline pb-1">
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <Link
              to="/reservations"
              className="hidden size-11 place-items-center rounded-full border border-current/25 transition hover:border-current md:grid"
              aria-label="Manage my reservations"
              title="My reservations"
            >
              <CalendarCheck className="size-[18px]" />
            </Link>
            <Link to="/book" className="btn btn-gold hidden sm:inline-flex">
              Book Your Stay
            </Link>
            <button
              className="grid size-11 place-items-center rounded-full border border-current/25 lg:hidden"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-0 z-40 flex flex-col bg-midnight text-pearl lg:hidden"
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <nav aria-label="Mobile" className="container-x flex flex-1 flex-col justify-center pt-20">
              <ul className="space-y-1">
                {[...navItems, { to: '/reservations', label: 'My Reservations' }].map((n, i) => (
                  <motion.li key={n.to} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.05 }}>
                    <NavLink
                      to={n.to}
                      className={({ isActive }) => `block py-2 font-serif text-4xl sm:text-5xl ${isActive ? 'text-gold italic' : ''}`}
                    >
                      {n.label}
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
              <Link to="/book" className="btn btn-gold mt-10 self-start">
                Book Your Stay
              </Link>
            </nav>
            <p className="container-x pb-8 text-xs tracking-[0.2em] text-pearl/60 uppercase">Ngwe Saung · Ayeyarwady · Myanmar</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

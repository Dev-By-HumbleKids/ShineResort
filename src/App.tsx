import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { lazy, Suspense, useEffect, useRef } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Cursor } from './components/fx/Cursor'
import { Intro } from './components/fx/Intro'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { initSmoothScroll, scrollToEl, scrollToTop } from './lib/scroll'
import Home from './pages/Home'

const Stay = lazy(() => import('./pages/Stay'))
const RoomDetail = lazy(() => import('./pages/RoomDetail'))
const Experiences = lazy(() => import('./pages/Experiences'))
const Dining = lazy(() => import('./pages/Dining'))
const Wellness = lazy(() => import('./pages/Wellness'))
const Story = lazy(() => import('./pages/Story'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Book = lazy(() => import('./pages/Book'))
const Reservations = lazy(() => import('./pages/Reservations'))
const NotFound = lazy(() => import('./pages/NotFound'))

const titles: Record<string, string> = {
  '/': 'SHINE — Luxury Beach Resort · Ngwe Saung, Myanmar',
  '/stay': 'Villas & Suites — SHINE',
  '/experiences': 'Experiences — SHINE',
  '/dining': 'Dining — SHINE',
  '/wellness': 'Lumina Spa & Wellness — SHINE',
  '/story': 'Our Story — SHINE',
  '/gallery': 'Gallery — SHINE',
  '/book': 'Book Your Stay — SHINE',
  '/reservations': 'My Reservations — SHINE',
}

function PageFallback() {
  return (
    <div className="grid min-h-svh place-items-center bg-midnight text-pearl" role="status">
      <span className="eyebrow animate-pulse text-gold">Arriving…</span>
    </div>
  )
}

const tide = [0.76, 0, 0.24, 1] as const

/** A midnight "tide" that rises over the old page and draws back from the new one. */
function PageCurtain() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] grid place-items-center bg-midnight text-pearl"
      initial={{ y: '0%' }}
      animate={{ y: '-100%', transition: { duration: 0.8, ease: tide, delay: 0.1 } }}
      exit={{ y: ['100%', '0%'], transition: { duration: 0.6, ease: tide } }}
    >
      <span className="font-serif text-4xl tracking-[0.42em] pl-[0.42em] text-pearl/90">SHINE</span>
      <span className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-teal/60 to-transparent" />
    </motion.div>
  )
}

export default function App() {
  const location = useLocation()
  // Experience detail dialogs live on top of the Experiences page, so they share its key.
  const pageKey = location.pathname.startsWith('/experiences') ? '/experiences' : location.pathname

  useEffect(() => initSmoothScroll(), [])

  useEffect(() => {
    const base = '/' + (location.pathname.split('/')[1] ?? '')
    if (!location.pathname.match(/^\/(stay|experiences)\/.+/)) document.title = titles[base] ?? titles['/']
  }, [location.pathname])

  // In-page anchors (same page). Page changes scroll once the curtain has covered the old page.
  const prevKey = useRef(pageKey)
  const hashRef = useRef(location.hash)
  hashRef.current = location.hash
  useEffect(() => {
    if (prevKey.current !== pageKey) {
      prevKey.current = pageKey
      return
    }
    if (!location.hash) return
    const t = setTimeout(() => scrollToEl(document.getElementById(location.hash.slice(1))), 450)
    return () => clearTimeout(t)
  }, [pageKey, location.hash])

  const onPageSwap = () => {
    scrollToTop()
    const h = hashRef.current
    if (!h) return
    // scroll once the curtain lifts, then again after lazy content (e.g. search results) settles
    const go = () => scrollToEl(document.getElementById(h.slice(1)))
    setTimeout(go, 700)
    setTimeout(go, 1500)
  }

  return (
    <MotionConfig reducedMotion="user">
      <Intro />
      <Cursor />
      <Header />
      <AnimatePresence mode="wait" initial={false} onExitComplete={onPageSwap}>
        <motion.main id="main" key={pageKey} exit={{ opacity: 1 }} transition={{ duration: 0.6 }}>
          <PageCurtain />
          <Suspense fallback={<PageFallback />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/stay" element={<Stay />} />
              <Route path="/stay/:id" element={<RoomDetail />} />
              <Route path="/experiences" element={<Experiences />} />
              <Route path="/experiences/:id" element={<Experiences />} />
              <Route path="/dining" element={<Dining />} />
              <Route path="/wellness" element={<Wellness />} />
              <Route path="/story" element={<Story />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/book" element={<Book />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </MotionConfig>
  )
}

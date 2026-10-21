import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
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

export default function App() {
  const location = useLocation()
  // Experience detail dialogs live on top of the Experiences page, so they share its key.
  const pageKey = location.pathname.startsWith('/experiences') ? '/experiences' : location.pathname

  useEffect(() => initSmoothScroll(), [])

  useEffect(() => {
    const base = '/' + (location.pathname.split('/')[1] ?? '')
    if (!location.pathname.match(/^\/(stay|experiences)\/.+/)) document.title = titles[base] ?? titles['/']
  }, [location.pathname])

  useEffect(() => {
    if (location.hash) {
      const t = setTimeout(() => scrollToEl(document.getElementById(location.hash.slice(1))), 450)
      return () => clearTimeout(t)
    }
    scrollToTop()
  }, [pageKey, location.hash])

  return (
    <MotionConfig reducedMotion="user">
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          id="main"
          key={pageKey}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45 }}
        >
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

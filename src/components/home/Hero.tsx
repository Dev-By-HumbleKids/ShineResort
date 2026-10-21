import { AnimatePresence, motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, Clock3, Pause, Play, Sunset, Waves } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { img, type ImageKey } from '../../data/images'
import { seasonFor } from '../../lib/availability'
import { today } from '../../lib/dates'
import { localTime, sunTimes } from '../../lib/sun'
import { StaySearch } from '../booking/StaySearch'
import { Magnetic } from '../fx/Magnetic'
import { Img } from '../ui/Img'

const ease = [0.22, 1, 0.36, 1] as const
const SLIDE_MS = 7000

const slides: { image: ImageKey; caption: string; alt: string }[] = [
  { image: 'villaLoungeDusk', caption: 'The Lantern Pavilion · dusk', alt: 'Open-air pavilion lounge glowing at dusk above the sea' },
  { image: 'palmReflection', caption: 'Golden hour on the lagoon', alt: 'Palms reflected in still lagoon water at sunset' },
  { image: 'gardenPoolVilla', caption: 'Tropical Garden Villa', alt: 'Private villa pool framed by a tropical garden' },
  { image: 'villaDusk', caption: 'Beach cabanas · blue hour', alt: 'Resort cabanas and pool glowing at blue hour' },
]

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  // autoplay only while visible, never for reduced motion
  useEffect(() => {
    if (reduce || paused) return
    const t = setTimeout(() => {
      if (document.visibilityState === 'visible') setIndex((i) => (i + 1) % slides.length)
    }, SLIDE_MS)
    return () => clearTimeout(t)
  }, [index, reduce, paused])

  // warm the cache for the next slide
  useEffect(() => {
    const next = new Image()
    next.src = img(slides[(index + 1) % slides.length].image, 2000)
  }, [index])

  const s = slides[index]

  return (
    <>
      <section
        ref={ref}
        className="grain relative flex min-h-[100svh] items-end overflow-hidden bg-midnight text-pearl"
        aria-roledescription="carousel"
        aria-label="Welcome to SHINE"
      >
        <motion.div style={{ y: imgY }} className="absolute inset-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={s.image}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.8, ease }}
            >
              <Img name={s.image} alt={s.alt} priority={index === 0} sizes="100vw" width={2000} className="img-cover animate-[kenburns_14s_ease-out_both]" />
            </motion.div>
          </AnimatePresence>
        </motion.div>

        {/* light: golden glare + layered gradients for legibility */}
        <div aria-hidden className="pointer-events-none absolute -right-[20%] -top-[30%] size-[90vmax] animate-[glare_16s_ease-in-out_infinite_alternate] rounded-full bg-[radial-gradient(circle,rgb(255_214_150/0.28),transparent_60%)] mix-blend-screen" />
        <div className="absolute inset-0 bg-linear-to-b from-midnight/60 via-midnight/5 to-midnight/90" />
        <div className="absolute inset-0 bg-linear-to-r from-midnight/65 via-midnight/15 to-transparent" />

        <motion.div style={{ y: textY, opacity: fade }} className="container-x relative pb-48 pt-32 md:pb-52">
          <motion.p
            className="eyebrow mb-6 flex items-center gap-3 text-gold"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.3 }}
          >
            <span className="h-px w-10 bg-current" aria-hidden />
            Luxury Beach Resort · Ngwe Saung, Myanmar
          </motion.p>

          <h1 className="sr-only">SHINE — Luxury Beach Resort, Ngwe Saung, Myanmar</h1>
          <div aria-hidden className="relative flex font-serif text-[22vw] font-medium leading-[0.8] tracking-[0.06em] sm:text-[18vw] lg:text-[13.5rem]">
            {'SHINE'.split('').map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="inline-block bg-linear-to-b from-pearl via-pearl to-[#f3dfb8] bg-clip-text text-transparent"
                  initial={{ y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.4, ease, delay: 0.45 + i * 0.08 }}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
            <motion.span
              className="absolute -right-2 top-[12%] size-3 rounded-full bg-gold shadow-[0_0_24px_8px_rgb(199_166_106/0.55)] md:size-4"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 1.3, duration: 0.8 }}
            />
          </div>

          <div className="mt-6 grid gap-8 md:mt-10 md:grid-cols-[1.1fr_1fr] md:items-end">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease, delay: 1 }}>
              <p className="font-serif text-3xl italic leading-tight text-pearl md:text-[2.6rem]">“Where the Ocean Meets Extraordinary.”</p>
              <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-pearl/80">
                Fifty-one villas and pavilions among the palms of Ngwe Saung — oceanfront living, warm Myanmar hospitality and island adventures that
                begin at our own jetty.
              </p>
            </motion.div>
            <motion.div
              className="flex flex-wrap gap-3 md:justify-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease, delay: 1.15 }}
            >
              <Magnetic>
                <Link to="/stay" className="btn btn-gold" data-cursor="Stay">
                  Explore Our Villas <ArrowRight className="size-4" aria-hidden />
                </Link>
              </Magnetic>
              <Magnetic>
                <Link to="/experiences" className="btn btn-ghost-light backdrop-blur-sm">
                  Discover Experiences
                </Link>
              </Magnetic>
            </motion.div>
          </div>
        </motion.div>

        {/* slide controls */}
        <div className="container-x absolute inset-x-0 bottom-28 z-10 flex items-end justify-between gap-6 md:bottom-24">
          <div className="flex items-center gap-4">
            {!reduce && (
              <button
                onClick={() => setPaused((p) => !p)}
                className="grid size-9 place-items-center rounded-full border border-pearl/30 text-pearl/90 transition hover:border-pearl"
                aria-label={paused ? 'Play slideshow' : 'Pause slideshow'}
              >
                {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
              </button>
            )}
            <p className="font-serif text-lg tabular-nums text-pearl/90" aria-live="polite">
              <span className="text-gold">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-pearl/40"> / {String(slides.length).padStart(2, '0')}</span>
            </p>
            <div className="hidden gap-1.5 sm:flex">
              {slides.map((sl, i) => (
                <button
                  key={sl.image}
                  onClick={() => setIndex(i)}
                  className="group relative h-6 w-10 py-2.5"
                  aria-label={`Show slide ${i + 1}: ${sl.caption}`}
                  aria-current={i === index}
                >
                  <span className="block h-px w-full overflow-hidden bg-pearl/30">
                    {i === index && !paused && (
                      <motion.span
                        key={index}
                        className="block h-full bg-gold"
                        initial={{ width: reduce ? '100%' : '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: SLIDE_MS / 1000, ease: 'linear' }}
                      />
                    )}
                  </span>
                </button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={s.caption}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="hidden text-xs uppercase tracking-[0.2em] text-pearl/70 lg:block"
              >
                {s.caption}
              </motion.p>
            </AnimatePresence>
          </div>
          <LiveStrip />
        </div>
      </section>

      <div className="container-x relative z-20 -mt-20 md:-mt-14">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, ease, delay: 1.3 }}>
          <StaySearch />
          <p className="mt-3 text-center text-xs text-muted">Demonstration availability only — no real inventory is checked.</p>
        </motion.div>
      </div>
    </>
  )
}

/** Local time & today's sunset in Ngwe Saung — real calculations, not marketing claims. */
function LiveStrip() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 30_000)
    return () => clearInterval(t)
  }, [])
  const sun = useMemo(() => sunTimes(now), [now])
  const season = seasonFor(today())
  return (
    <ul className="hidden items-center divide-x divide-pearl/20 rounded-full border border-pearl/20 bg-midnight/30 px-2 py-2 text-xs text-pearl/85 backdrop-blur-md md:flex" aria-label="Ngwe Saung today">
      <li className="flex items-center gap-2 px-3">
        <Clock3 className="size-3.5 text-gold" aria-hidden /> {localTime(now)} local
      </li>
      <li className="flex items-center gap-2 px-3">
        <Sunset className="size-3.5 text-gold" aria-hidden /> Sunset {sun.sunset}
      </li>
      <li className="flex items-center gap-2 px-3">
        <Waves className="size-3.5 text-gold" aria-hidden /> {season.label}
      </li>
    </ul>
  )
}

import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { StaySearch } from '../booking/StaySearch'
import { Img } from '../ui/Img'

const ease = [0.22, 1, 0.36, 1] as const

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const textY = useTransform(scrollYProgress, [0, 1], ['0%', '40%'])
  const fade = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <>
      <section ref={ref} className="grain relative flex min-h-[100svh] items-end overflow-hidden bg-midnight text-pearl" aria-label="Welcome to SHINE">
        <motion.div style={{ y: imgY }} className="absolute inset-0">
          <Img
            name="heroSunsetPool"
            alt="SHINE's infinity pool framed by palms at golden hour, Ngwe Saung"
            priority
            sizes="100vw"
            width={2000}
            className="img-cover animate-[kenburns_18s_ease-out_both]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-linear-to-b from-midnight/55 via-midnight/10 to-midnight/85" />
        <div className="absolute inset-0 bg-linear-to-r from-midnight/50 to-transparent md:via-transparent" />

        <motion.div style={{ y: textY, opacity: fade }} className="container-x relative pb-44 pt-32 md:pb-48">
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
          <div aria-hidden className="flex font-serif text-[22vw] font-medium leading-[0.8] tracking-[0.06em] sm:text-[18vw] lg:text-[13.5rem]">
            {'SHINE'.split('').map((ch, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="inline-block"
                  initial={{ y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ duration: 1.4, ease, delay: 0.45 + i * 0.08 }}
                >
                  {ch}
                </motion.span>
              </span>
            ))}
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
              <Link to="/stay" className="btn btn-gold">
                Explore Our Villas <ArrowRight className="size-4" aria-hidden />
              </Link>
              <Link to="/experiences" className="btn btn-ghost-light">
                Discover Experiences
              </Link>
            </motion.div>
          </div>
        </motion.div>

        <div className="absolute bottom-28 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-pearl/70 md:flex" aria-hidden>
          <span className="text-[0.6rem] uppercase tracking-[0.4em]">Scroll</span>
          <span className="relative h-12 w-px overflow-hidden bg-pearl/25">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scroll-cue_2s_ease-in-out_infinite] bg-gold" />
          </span>
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

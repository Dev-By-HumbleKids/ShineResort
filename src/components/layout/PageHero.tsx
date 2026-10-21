import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import { useRef, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { ImageKey } from '../../data/images'
import { WaveEdge } from '../fx/Decor'
import { Img } from '../ui/Img'
import { SplitHeading } from '../ui/Reveal'

/** Cinematic banner used at the top of each inner page. */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  children,
  edge = 'var(--bg)',
}: {
  eyebrow: string
  title: string
  intro?: ReactNode
  image: ImageKey
  children?: ReactNode
  /** colour of the section that follows, for the wave edge */
  edge?: string
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const { pathname } = useLocation()
  const crumbs = pathname.split('/').filter(Boolean)

  return (
    <section ref={ref} className="grain relative flex min-h-[78svh] items-end overflow-hidden bg-midnight text-pearl">
      <motion.div style={{ y }} className="absolute inset-0">
        <Img name={image} alt="" priority className="img-cover animate-[kenburns_14s_ease-out_both]" />
      </motion.div>
      <div className="absolute inset-0 bg-linear-to-t from-midnight via-midnight/45 to-midnight/40" />
      <div className="absolute inset-0 bg-linear-to-r from-midnight/55 via-midnight/10 to-transparent" />
      <div aria-hidden className="pointer-events-none absolute -right-[15%] -top-[25%] size-[70vmax] animate-[glare_18s_ease-in-out_infinite_alternate] rounded-full bg-[radial-gradient(circle,rgb(255_214_150/0.18),transparent_60%)] mix-blend-screen" />
      <motion.div style={{ opacity: fade }} className="container-x relative pb-24 pt-36 md:pb-32">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-pearl/60">
            <li>
              <Link to="/" className="link-underline hover:text-pearl">
                Home
              </Link>
            </li>
            {crumbs.map((c, i) => (
              <li key={c} className="flex items-center gap-1.5">
                <ChevronRight className="size-3" aria-hidden />
                {i === crumbs.length - 1 ? (
                  <span aria-current="page" className="text-pearl/90">{c.replace(/-/g, ' ')}</span>
                ) : (
                  <Link to={'/' + crumbs.slice(0, i + 1).join('/')} className="link-underline hover:text-pearl">
                    {c.replace(/-/g, ' ')}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <motion.p
          className="eyebrow mb-6 flex items-center gap-3 text-gold"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <span className="h-px w-8 bg-current" aria-hidden />
          {eyebrow}
        </motion.p>
        <SplitHeading as="h1" immediate text={title} delay={0.3} className="max-w-5xl text-balance text-5xl leading-[0.98] sm:text-6xl md:text-7xl lg:text-8xl" />
        {intro && (
          <motion.p
            className="mt-7 max-w-xl text-base leading-relaxed text-pearl/80 md:text-lg"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            {intro}
          </motion.p>
        )}
        {children}
      </motion.div>
      <WaveEdge color={edge} className="absolute inset-x-0 -bottom-px" />
    </section>
  )
}

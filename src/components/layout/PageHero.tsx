import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import type { ImageKey } from '../../data/images'
import { Img } from '../ui/Img'
import { SplitHeading } from '../ui/Reveal'

/** Cinematic banner used at the top of each inner page. */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  children,
}: {
  eyebrow: string
  title: string
  intro?: ReactNode
  image: ImageKey
  children?: ReactNode
}) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])

  return (
    <section ref={ref} className="grain relative flex min-h-[78svh] items-end overflow-hidden bg-midnight text-pearl">
      <motion.div style={{ y }} className="absolute inset-0">
        <Img name={image} alt="" priority className="img-cover animate-[kenburns_14s_ease-out_both]" />
      </motion.div>
      <div className="absolute inset-0 bg-linear-to-t from-midnight via-midnight/35 to-midnight/25" />
      <div className="container-x relative pb-16 pt-36 md:pb-24">
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
      </div>
    </section>
  )
}

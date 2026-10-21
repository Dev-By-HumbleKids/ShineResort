import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

const ease = [0.22, 1, 0.36, 1] as const

type Props = HTMLMotionProps<'div'> & { delay?: number; y?: number; children: ReactNode }

/** Fades and lifts content into view once. */
export function Reveal({ delay = 0, y = 32, children, ...rest }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, ease, delay }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Splits a headline into words that rise from a mask, staggered. */
export function SplitHeading({
  text,
  as: Tag = 'h2',
  className = '',
  delay = 0,
  immediate = false,
}: {
  text: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
  delay?: number
  immediate?: boolean
}) {
  const words = text.split(' ')
  const animate = { y: '0%', opacity: 1 }
  return (
    <Tag className={className} aria-label={text}>
      {words.map((w, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.12em] align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%', opacity: 0 }}
            {...(immediate ? { animate } : { whileInView: animate, viewport: { once: true } })}
            transition={{ duration: 1.1, ease, delay: delay + i * 0.06 }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </Tag>
  )
}

/** Image that is revealed by a sliding mask. */
export function MaskReveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      initial={{ clipPath: 'inset(12% 8% 12% 8%)', opacity: 0.4 }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.4, ease, delay }}
    >
      {children}
    </motion.div>
  )
}

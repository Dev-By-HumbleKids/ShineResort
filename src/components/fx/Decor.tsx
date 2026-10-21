import { animate, useInView, useReducedMotion } from 'framer-motion'
import { Fragment, useEffect, useRef, useState } from 'react'

/** Counts up to a number when scrolled into view, keeping any suffix/prefix. */
export function CountUp({ value, className = '' }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  const reduce = useReducedMotion()
  const match = value.match(/^(\D*)([\d.]+)(.*)$/)
  const target = match ? Number(match[2]) : 0
  const numeric = !!match
  const [n, setN] = useState(reduce || !match ? target : 0)

  useEffect(() => {
    if (!inView || reduce || !numeric) return
    const c = animate(0, target, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(v) })
    return () => c.stop()
  }, [inView, reduce, target, numeric])

  if (!match) return <span className={className}>{value}</span>
  return (
    <span ref={ref} className={`tabular-nums ${className}`} aria-label={value}>
      <span aria-hidden>
        {match[1]}
        {Math.round(n)}
        {match[3]}
      </span>
    </span>
  )
}

/** Slow editorial marquee; pauses on hover and for reduced motion. */
export function Marquee({ items, className = '' }: { items: string[]; className?: string }) {
  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((t, i) => (
        <Fragment key={i}>
          <span className="whitespace-nowrap px-8 font-serif text-5xl italic md:text-7xl">{t}</span>
          <svg viewBox="0 0 24 24" className="size-6 shrink-0 text-gold md:size-8" aria-hidden>
            <path d="M12 0l2.4 9.6L24 12l-9.6 2.4L12 24l-2.4-9.6L0 12l9.6-2.4z" fill="currentColor" />
          </svg>
        </Fragment>
      ))}
    </div>
  )
  return (
    <div className={`group overflow-hidden py-10 ${className}`} aria-label={items.join(', ')} role="marquee">
      <div className="flex w-max animate-[marquee_45s_linear_infinite] group-hover:[animation-play-state:paused] motion-reduce:animate-none" aria-hidden>
        {row}
        {row}
      </div>
    </div>
  )
}

/** Animated wave edge that blends one section into the next. */
export function WaveEdge({ color, flip = false, className = '' }: { color: string; flip?: boolean; className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none relative h-16 overflow-hidden md:h-24 ${flip ? 'rotate-180' : ''} ${className}`}>
      {[0, 1].map((i) => (
        <svg
          key={i}
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          className={`absolute bottom-0 h-full w-[200%] ${i ? 'motion-safe:animate-[marquee_22s_linear_infinite]' : 'motion-safe:animate-[marquee_30s_linear_infinite]'} ${i ? 'opacity-50' : ''}`}
          style={{ color, animationDirection: i ? 'reverse' : 'normal' }}
        >
          <path
            fill="currentColor"
            d={
              i
                ? 'M0 60 C 180 30 360 90 540 60 S 900 30 1080 60 S 1260 90 1440 60 V100 H0Z'
                : 'M0 70 C 240 40 480 100 720 70 S 1200 40 1440 70 V100 H0Z'
            }
            transform="scale(0.5 1)"
          />
          <path
            fill="currentColor"
            d={
              i
                ? 'M0 60 C 180 30 360 90 540 60 S 900 30 1080 60 S 1260 90 1440 60 V100 H0Z'
                : 'M0 70 C 240 40 480 100 720 70 S 1200 40 1440 70 V100 H0Z'
            }
            transform="translate(720 0) scale(0.5 1)"
          />
        </svg>
      ))}
    </div>
  )
}

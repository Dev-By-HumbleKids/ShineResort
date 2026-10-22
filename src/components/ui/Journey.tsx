import { motion } from 'framer-motion'
import type { JourneyStep } from '../../data/journeys'
import { Img } from './Img'

/** Vertical, photo-led timeline: "what happens, and when". */
export function JourneyTimeline({ steps, title = 'Your journey' }: { steps: JourneyStep[]; title?: string }) {
  return (
    <section aria-label={title}>
      <h3 className="text-3xl">{title}</h3>
      <ol className="relative mt-6 space-y-5 before:absolute before:bottom-6 before:left-[1.15rem] before:top-6 before:w-px before:bg-linear-to-b before:from-gold before:via-gold/50 before:to-transparent sm:before:left-[1.4rem]">
        {steps.map((s, i) => (
          <motion.li
            key={s.title}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid grid-cols-[2.3rem_1fr] gap-4 sm:grid-cols-[2.8rem_1fr]"
          >
            <span className="relative z-10 mt-2 grid size-9 place-items-center rounded-full border-2 border-gold bg-bg font-serif text-base text-accent sm:size-11 sm:text-lg">{i + 1}</span>
            <div className="group grid overflow-hidden rounded-2xl border border-line bg-card sm:grid-cols-[10rem_1fr]">
              <div className="relative aspect-[16/9] overflow-hidden sm:aspect-auto">
                <Img name={s.image} alt={s.title} width={500} sizes="(min-width:640px) 160px, 80vw" className="img-cover group-hover:scale-110" />
              </div>
              <div className="p-4">
                <span className="inline-block rounded-full bg-gold/15 px-2.5 py-0.5 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-accent">{s.time}</span>
                <p className="mt-2 font-serif text-xl leading-tight">{s.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{s.detail}</p>
              </div>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}

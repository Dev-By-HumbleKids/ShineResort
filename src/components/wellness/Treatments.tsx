import { motion } from 'framer-motion'
import { ArrowUpRight, Clock, Heart, Leaf, Sparkles, Users } from 'lucide-react'
import { useState } from 'react'
import { spaJourneys } from '../../data/journeys'
import { treatments } from '../../data/spa'
import type { Treatment } from '../../data/types'
import { money } from '../../lib/pricing'
import { SectionHeading } from '../ui/bits'
import { Img } from '../ui/Img'
import { JourneyTimeline } from '../ui/Journey'
import { Modal } from '../ui/Modal'
import { Reveal } from '../ui/Reveal'
import { TiltCard } from '../ui/TiltCard'

const length = (t: Treatment) => (t.duration >= 240 ? '3 days' : `${t.duration} min`)

/** Photo cards for every treatment, each opening a full "journey" before booking. */
export function Treatments({ onBook }: { onBook: (id: string) => void }) {
  const [open, setOpen] = useState<Treatment | null>(null)
  const j = open ? spaJourneys[open.id] : null

  return (
    <section className="container-x py-24 md:py-32" aria-labelledby="tr-h">
      <div id="tr-h" className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeading
          eyebrow="Treatment menu"
          title={
            <>
              Choose your <em className="text-accent">journey.</em>
            </>
          }
          intro="Tap any treatment to see exactly how it unfolds — every step, every scent — before you book."
        />
      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {treatments.map((t, i) => {
          const sj = spaJourneys[t.id]
          return (
            <Reveal key={t.id} delay={(i % 3) * 0.07} className={i === 0 ? 'lg:col-span-2 lg:row-span-2' : ''}>
              <TiltCard max={4} className="h-full">
                <button
                  onClick={() => setOpen(t)}
                  data-cursor="Explore"
                  className={`group relative flex h-full w-full flex-col justify-end overflow-hidden rounded-[1.75rem] text-left text-pearl ring-1 ring-line transition hover:ring-gold/60 ${i === 0 ? 'min-h-[28rem] lg:min-h-full' : 'min-h-[26rem]'}`}
                  aria-label={`${t.name}: see the full journey`}
                >
                  <Img name={sj.cover} alt="" width={i === 0 ? 1400 : 800} sizes={i === 0 ? '(min-width:1024px) 66vw, 100vw' : '(min-width:1024px) 33vw, 100vw'} className="img-cover absolute inset-0 group-hover:scale-110" />
                  <span className="absolute inset-0 bg-linear-to-t from-midnight via-midnight/45 to-midnight/5" />
                  <span className="absolute left-5 top-5 flex flex-wrap gap-2">
                    <span className="rounded-full bg-pearl/90 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-midnight">{t.kind}</span>
                    {t.forTwo && (
                      <span className="flex items-center gap-1 rounded-full bg-gold px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-midnight">
                        <Heart className="size-3" aria-hidden /> For two
                      </span>
                    )}
                  </span>
                  <span className="relative p-6 md:p-8">
                    <span className="flex items-center gap-2 text-xs text-gold">
                      <Sparkles className="size-3.5" aria-hidden /> {sj.mood}
                    </span>
                    <span className={`mt-2 block font-serif leading-tight ${i === 0 ? 'text-5xl md:text-6xl' : 'text-4xl'}`}>{t.name}</span>
                    <span className={`mt-3 block text-sm leading-relaxed text-pearl/80 ${i === 0 ? 'max-w-lg' : 'line-clamp-2'}`}>{t.description}</span>
                    {/* the journey at a glance */}
                    <span className="mt-4 flex items-center gap-1.5" aria-hidden>
                      {sj.steps.map((s, k) => (
                        <span key={s.title} className="flex items-center gap-1.5">
                          <span className="size-8 overflow-hidden rounded-full ring-2 ring-pearl/70">
                            <Img name={s.image} alt="" width={120} sizes="32px" className="img-cover" />
                          </span>
                          {k < sj.steps.length - 1 && <span className="h-px w-3 bg-gold/70" />}
                        </span>
                      ))}
                      <span className="ml-2 text-xs text-pearl/70">{sj.steps.length} steps</span>
                    </span>
                    <span className="mt-5 flex items-center justify-between border-t border-pearl/15 pt-4">
                      <span className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1.5"><Clock className="size-4 text-gold" aria-hidden />{length(t)}</span>
                        <span className="font-serif text-2xl">{money(t.price)}</span>
                      </span>
                      <span className="flex items-center gap-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em]">
                        Explore <ArrowUpRight className="size-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
                      </span>
                    </span>
                  </span>
                </button>
              </TiltCard>
            </Reveal>
          )
        })}
      </div>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.name ?? ''} subtitle={open ? `${open.kind} · ${length(open)} · ${money(open.price)}${open.forTwo ? ' for two' : ''}` : ''} wide>
        {open && j && (
          <div className="space-y-10">
            <div className="grid grid-cols-3 gap-2">
              <div className="relative col-span-3 aspect-[16/9] overflow-hidden rounded-2xl">
                <Img name={j.cover} alt={open.name} width={1200} sizes="760px" className="img-cover" />
                <span className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-midnight/70 px-3 py-1.5 text-xs text-pearl backdrop-blur">
                  <Sparkles className="size-3.5 text-gold" aria-hidden /> {j.mood}
                </span>
              </div>
              {j.gallery.map((g) => (
                <div key={g} className="aspect-[4/3] overflow-hidden rounded-xl">
                  <Img name={g} alt="" width={400} sizes="250px" className="img-cover" />
                </div>
              ))}
            </div>

            <p className="font-serif text-2xl leading-snug">{open.description}</p>

            <div className="grid gap-4 sm:grid-cols-3">
              {j.feel.map((f, i) => (
                <motion.div
                  key={f}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.08 }}
                  className="rounded-2xl border border-line bg-bg-alt/60 p-4"
                >
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-accent">You’ll feel</p>
                  <p className="mt-1.5 font-serif text-lg leading-snug">{f}</p>
                </motion.div>
              ))}
            </div>

            <JourneyTimeline steps={j.steps} title="Your journey, step by step" />

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="flex items-center gap-2 text-2xl"><Leaf className="size-5 text-palm" aria-hidden /> What we use</h3>
                <ul className="mt-3 flex flex-wrap gap-2">
                  {j.ingredients.map((x) => (
                    <li key={x} className="rounded-full border border-line px-3 py-1 text-sm">{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-2xl"><Users className="size-5 text-accent" aria-hidden /> Perfect for</h3>
                <ul className="mt-3 space-y-1.5 text-sm">
                  {j.bestFor.map((x) => (
                    <li key={x} className="flex gap-2"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />{x}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="sticky bottom-0 -mx-6 flex flex-wrap items-center justify-between gap-4 border-t border-line bg-bg/95 px-6 py-4 backdrop-blur md:-mx-8 md:px-8">
              <p>
                <span className="font-serif text-3xl">{money(open.price)}</span>
                <span className="ml-2 text-sm text-muted">{length(open)}{open.forTwo ? ' · for two' : ''}</span>
              </p>
              <button
                onClick={() => {
                  const id = open.id
                  setOpen(null)
                  setTimeout(() => onBook(id), 350)
                }}
                className="btn btn-gold"
              >
                Book this treatment
              </button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  )
}

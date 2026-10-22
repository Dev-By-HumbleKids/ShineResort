import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Clock, Coffee, Sparkles, Users } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { venues } from '../../data/dining'
import { menuSets, teaStand, type MenuSet } from '../../data/sets'
import { money } from '../../lib/pricing'
import { SectionHeading } from '../ui/bits'
import { Img } from '../ui/Img'
import { MaskReveal, Reveal } from '../ui/Reveal'
import { TiltCard } from '../ui/TiltCard'

const venueName = (id: MenuSet['venue']) => venues.find((v) => v.id === id)?.name ?? ''

/** Curated menu sets, led by an interactive Myanmar mont tea stand. */
export function MenuSets({ onReserve }: { onReserve: (setId: string) => void }) {
  return (
    <section id="sets" className="relative scroll-mt-20 overflow-hidden py-24 md:py-32" aria-labelledby="sets-h">
      <div className="container-x">
        <div id="sets-h">
          <SectionHeading
            eyebrow="Menu sets · curated for sharing"
            title={
              <>
                Sets worth <em className="text-accent">gathering for.</em>
              </>
            }
            intro="From an afternoon stand of Myanmar mont to a seafood tower on the sand — each set is composed by Chef Thida and her team, and can be reserved with your table."
          />
        </div>
        <TeaSet onReserve={onReserve} />
        <SetCarousel onReserve={onReserve} />
      </div>
    </section>
  )
}

function TeaSet({ onReserve }: { onReserve: (id: string) => void }) {
  const set = menuSets[0]
  const [tier, setTier] = useState(0)
  const t = teaStand[tier]

  return (
    <div className="relative mt-16 overflow-hidden rounded-[2.25rem] bg-[#f3e9d8] text-charcoal ring-1 ring-line [[data-theme=night]_&]:bg-[#1c2b29] [[data-theme=night]_&]:text-pearl">
      {/* woven-pattern backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 14px), repeating-linear-gradient(-45deg, currentColor 0 1px, transparent 1px 14px)' }}
      />
      <div className="relative grid lg:grid-cols-12">
        <div className="relative min-h-[26rem] lg:col-span-5">
          <MaskReveal className="absolute inset-0">
            <Img name={set.image} alt="Three-tier stand of Myanmar mont with tea" sizes="(min-width:1024px) 40vw, 100vw" className="img-cover" />
          </MaskReveal>
          <div className="absolute inset-0 bg-linear-to-t from-midnight/80 via-midnight/10 to-transparent" />
          <span className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-midnight">
            <Sparkles className="size-3" aria-hidden /> Signature set
          </span>
          <div className="absolute inset-x-0 bottom-0 p-6 text-pearl md:p-8">
            <p className="font-myanmar text-lg leading-relaxed text-gold">{set.my}</p>
            <h3 className="mt-1 text-4xl md:text-5xl">{set.name}</h3>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-pearl/80">
              <span className="flex items-center gap-1.5"><Clock className="size-4" aria-hidden />{set.served}</span>
              <span className="flex items-center gap-1.5"><Users className="size-4" aria-hidden />{set.serves}</span>
            </div>
          </div>
        </div>

        <div className="p-6 md:p-10 lg:col-span-7">
          <p className="max-w-lg leading-relaxed text-current/75">{set.tagline}</p>

          <div className="mt-8 grid gap-6 md:grid-cols-[11rem_1fr]">
            {/* the stand: choose a tier */}
            <div role="tablist" aria-label="Tea stand tiers" aria-orientation="vertical" className="relative flex gap-2 md:flex-col md:gap-0">
              <span aria-hidden className="absolute bottom-6 left-[1.05rem] top-6 hidden w-px bg-gold/50 md:block" />
              {teaStand.map((x, i) => (
                <button
                  key={x.tier}
                  role="tab"
                  id={`tier-${i}`}
                  aria-selected={i === tier}
                  aria-controls="tier-panel"
                  onClick={() => setTier(i)}
                  onKeyDown={(e) => {
                    if (['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft'].includes(e.key)) {
                      e.preventDefault()
                      const n = (i + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + teaStand.length) % teaStand.length
                      setTier(n)
                      document.getElementById(`tier-${n}`)?.focus()
                    }
                  }}
                  tabIndex={i === tier ? 0 : -1}
                  className={`relative flex flex-1 items-center gap-3 rounded-xl px-2 py-2.5 text-left transition md:flex-none md:py-3 ${i === tier ? '' : 'opacity-60 hover:opacity-100'}`}
                >
                  <span className={`relative z-10 grid size-8 shrink-0 place-items-center rounded-full border-2 text-[0.65rem] font-bold transition ${i === tier ? 'border-gold bg-gold text-midnight shadow-[0_0_0_5px_rgb(199_166_106/0.2)]' : 'border-gold/60 bg-[#f3e9d8] [[data-theme=night]_&]:bg-[#1c2b29]'}`}>
                    {i === teaStand.length - 1 ? <Coffee className="size-3.5" aria-hidden /> : i + 1}
                  </span>
                  <span className="hidden md:block">
                    <span className="block text-sm font-semibold">{x.tier}</span>
                    <span className="block text-xs opacity-70">{x.label}</span>
                  </span>
                </button>
              ))}
            </div>

            <div id="tier-panel" role="tabpanel" aria-labelledby={`tier-${tier}`} className="min-h-[18rem]">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-accent md:hidden">
                {t.tier} · {t.label}
              </p>
              <AnimatePresence mode="wait">
                <motion.ul
                  key={tier}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-3"
                >
                  {t.items.map((it, i) => (
                    <motion.li
                      key={it.name}
                      initial={{ opacity: 0, x: 18 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="group flex items-center gap-4 rounded-2xl bg-pearl/70 p-3 ring-1 ring-black/5 transition hover:bg-pearl [[data-theme=night]_&]:bg-pearl/5 [[data-theme=night]_&]:ring-pearl/10"
                    >
                      <span className="size-20 shrink-0 overflow-hidden rounded-full ring-2 ring-gold/60 md:size-24">
                        {it.image && <Img name={it.image} alt={it.name} width={300} sizes="96px" className="img-cover group-hover:scale-110" />}
                      </span>
                      <span>
                        <span className="font-myanmar block text-lg leading-snug text-accent">{it.my}</span>
                        <span className="block font-serif text-2xl leading-tight">{it.name}</span>
                        <span className="mt-1 block text-sm leading-relaxed opacity-75">{it.note}</span>
                      </span>
                    </motion.li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-5 border-t border-current/10 pt-6">
            <div>
              <p className="text-xs opacity-70">{set.extra}</p>
              <p className="mt-1">
                <span className="font-serif text-4xl">{money(set.price)}</span>
                <span className="ml-1.5 text-sm opacity-70">for two</span>
              </p>
            </div>
            <button onClick={() => onReserve(set.id)} className="btn btn-dark" data-cursor="Reserve">
              Reserve the tea set <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function SetCarousel({ onReserve }: { onReserve: (id: string) => void }) {
  const rest = menuSets.slice(1)
  const badges = ['All', ...Array.from(new Set(rest.map((s) => s.badge)))]
  const [badge, setBadge] = useState('All')
  const list = useMemo(() => (badge === 'All' ? rest : rest.filter((s) => s.badge === badge)), [badge, rest])
  const track = useRef<HTMLDivElement>(null)
  const scroll = (d: number) => track.current?.scrollBy({ left: d * track.current.clientWidth * 0.8, behavior: 'smooth' })

  return (
    <div className="mt-20">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <Reveal>
          <h3 className="text-4xl md:text-5xl">More sets to share</h3>
          <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter menu sets">
            {badges.map((b) => (
              <button key={b} className="chip" aria-pressed={badge === b} onClick={() => setBadge(b)}>
                {b}
              </button>
            ))}
          </div>
        </Reveal>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="grid size-12 place-items-center rounded-full border border-line hover:border-ink" aria-label="Previous sets">
            <ArrowLeft className="size-4" />
          </button>
          <button onClick={() => scroll(1)} className="grid size-12 place-items-center rounded-full border border-line hover:border-ink" aria-label="Next sets">
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      <div ref={track} tabIndex={0} aria-label="Menu sets, scroll horizontally" className="scrollbar-none -mx-5 mt-10 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-6 md:-mx-10 md:px-10">
        <AnimatePresence mode="popLayout">
          {list.map((s, i) => (
            <motion.article
              layout
              key={s.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.45, delay: Math.min(i, 5) * 0.05 }}
              className="w-[84vw] shrink-0 snap-start sm:w-[23rem]"
            >
              <TiltCard max={4} className="h-full">
                <div className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-card ring-1 ring-line transition hover:ring-gold/60">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Img name={s.image} alt={s.name} width={700} sizes="(min-width:640px) 23rem, 84vw" className="img-cover group-hover:scale-110" />
                    <div className="absolute inset-0 bg-linear-to-t from-midnight/70 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-pearl/90 px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-midnight">{s.badge}</span>
                    <span className="absolute right-4 top-4 rounded-full border border-pearl/30 bg-midnight/50 px-3 py-1 font-serif text-lg text-pearl backdrop-blur-md">
                      {money(s.price)}
                      <span className="ml-1 font-sans text-[0.6rem] uppercase tracking-wider text-pearl/70">/{s.per === 'person' ? 'guest' : 'set'}</span>
                    </span>
                    <p className="absolute bottom-3 left-4 text-xs text-pearl/85">{venueName(s.venue)}</p>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    {s.my && <p className="font-myanmar text-base text-accent">{s.my}</p>}
                    <h4 className="font-serif text-3xl leading-tight">{s.name}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{s.tagline}</p>
                    <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
                      <span className="flex items-center gap-1.5"><Clock className="size-3.5" aria-hidden />{s.served}</span>
                      <span className="flex items-center gap-1.5"><Users className="size-3.5" aria-hidden />{s.serves}</span>
                    </div>
                    <p className="mt-5 text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-accent">What’s inside</p>
                    <ul className="mt-2 space-y-1.5 text-sm">
                      {s.courses.map((c) => (
                        <li key={c.name} className="flex gap-2">
                          <Check className="mt-0.5 size-3.5 shrink-0 text-palm" aria-hidden />
                          <span>
                            {c.name}
                            {c.my && <span className="font-myanmar ml-1.5 text-xs text-muted">{c.my}</span>}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {s.extra && <p className="mt-3 text-xs italic text-muted">{s.extra}</p>}
                    <div className="mt-auto pt-6">
                      <button onClick={() => onReserve(s.id)} className="btn btn-ghost w-full">
                        Reserve this set
                      </button>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </motion.article>
          ))}
        </AnimatePresence>
      </div>
      <p className="mt-2 text-xs text-muted">Fictional demonstration sets. Prices in USD before sample service and tax.</p>
    </div>
  )
}

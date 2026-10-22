import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, Camera, Check, CheckCircle2, Clock, CloudSun, Compass, Heart, ShieldCheck, Star, Sun, Users, UtensilsCrossed, Waves } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ExperienceForm } from '../components/booking/ExperienceForm'
import { PageHero } from '../components/layout/PageHero'
import { SectionHeading } from '../components/ui/bits'
import { Img } from '../components/ui/Img'
import { JourneyTimeline } from '../components/ui/Journey'
import { Modal } from '../components/ui/Modal'
import { TiltCard } from '../components/ui/TiltCard'
import { experienceCategories, experiences, getExperience } from '../data/experiences'
import { experienceJourneys, type ExperienceJourney } from '../data/journeys'
import type { Experience, ExperienceCategory } from '../data/types'
import { money } from '../lib/pricing'

const fromPrice = (e: Experience) => Math.min(...e.packages.map((p) => p.price))

const highlightIcon: Record<ExperienceJourney['highlights'][number]['icon'], typeof Sun> = {
  swim: Waves,
  camera: Camera,
  sun: Sun,
  food: UtensilsCrossed,
  heart: Heart,
  compass: Compass,
  wave: Waves,
  star: Star,
}

export default function Experiences() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const cat = (params.get('c') ?? 'all') as 'all' | ExperienceCategory
  const list = useMemo(() => (cat === 'all' ? experiences : experiences.filter((e) => e.category.includes(cat))), [cat])
  const open = id ? getExperience(id) : undefined
  const bookRef = useRef<HTMLDivElement>(null)
  const [picked, setPicked] = useState<{ id: string; n: number }>({ id: '', n: 0 })
  const journey = open ? experienceJourneys[open.id] : undefined
  const choosePackage = (pid: string) => {
    setPicked((p) => ({ id: pid, n: p.n + 1 }))
    setTimeout(() => bookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
  }
  useEffect(() => setPicked({ id: '', n: 0 }), [open?.id])

  useEffect(() => {
    document.title = open ? `${open.title} — SHINE` : 'Experiences — SHINE'
  }, [open])

  useEffect(() => {
    if (open && params.get('book') === '1') {
      const t = setTimeout(() => bookRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 650)
      return () => clearTimeout(t)
    }
  }, [open, params])

  const close = useCallback(() => navigate({ pathname: '/experiences', search: cat === 'all' ? '' : `?c=${cat}` }, { preventScrollReset: true }), [navigate, cat])

  return (
    <>
      <PageHero
        eyebrow="Your stay is only the beginning"
        title="Beyond the Shore."
        image="longtailBoats"
        intro="Island-hopping by longtail boat, sunrise rides along fifteen kilometres of sand, private charters and candlelit dinners at the water’s edge — designed and guided by the SHINE team."
      />

      <section className="container-x py-20 md:py-28" aria-labelledby="exp-h">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <div id="exp-h">
            <SectionHeading eyebrow={`${list.length} experiences`} title={<>Choose your <em className="text-accent">adventure.</em></>} />
          </div>
        </div>

        <div className="scrollbar-none -mx-5 mt-10 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filter experiences by category">
          {experienceCategories.map((c) => (
            <button
              key={c.id}
              className="chip shrink-0"
              aria-pressed={cat === c.id}
              onClick={() => setParams(c.id === 'all' ? {} : { c: c.id }, { preventScrollReset: true })}
            >
              {c.label}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {list.length} experiences shown
        </p>

        <motion.div layout className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((e, i) => (
              <motion.article
                layout
                key={e.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, delay: Math.min(i, 6) * 0.04 }}
                className="group flex flex-col"
              >
                <TiltCard max={5}>
                  <Link to={`/experiences/${e.id}${cat !== 'all' ? `?c=${cat}` : ''}`} preventScrollReset data-cursor="Explore" className="relative block aspect-[4/5] overflow-hidden rounded-[1.75rem]" aria-label={`View details: ${e.title}`}>
                    <Img name={e.image} alt="" sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 90vw" className="img-cover transition duration-[1.6s] group-hover:scale-110" />
                    <div className="absolute inset-0 bg-linear-to-t from-midnight/70 via-transparent to-transparent" />
                    <span className="absolute left-4 top-4 rounded-full bg-pearl/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-midnight">
                      {e.confirmation === 'instant' ? 'Instant demo booking' : 'Concierge request'}
                    </span>
                    <span className="absolute bottom-4 right-4 grid size-12 place-items-center rounded-full bg-pearl text-midnight transition duration-500 group-hover:rotate-45 group-hover:bg-gold">
                      <ArrowUpRight className="size-5" aria-hidden />
                    </span>
                    <p className="absolute bottom-5 left-5 flex items-center gap-1.5 text-xs text-pearl/90">
                      <CloudSun className="size-3.5" aria-hidden /> Weather-dependent
                    </p>
                  </Link>
                </TiltCard>
                <div className="mt-5 flex flex-1 flex-col">
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1.5"><Clock className="size-3.5" aria-hidden />{e.duration}</span>
                    <span className="flex items-center gap-1.5"><Users className="size-3.5" aria-hidden />{e.minGuests === e.maxGuests ? e.maxGuests : `${e.minGuests}–${e.maxGuests}`} guests</span>
                  </div>
                  <h3 className="mt-2 text-3xl">{e.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{e.summary}</p>
                  <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                    <p className="text-sm">
                      From <span className="font-serif text-2xl">{money(fromPrice(e))}</span>
                    </p>
                    <Link to={`/experiences/${e.id}?book=1${cat !== 'all' ? `&c=${cat}` : ''}`} preventScrollReset className="btn btn-dark min-h-11 px-5">
                      Book
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
        <p className="mt-16 max-w-2xl text-xs leading-relaxed text-muted">
          All experiences, island names (Pearl Cay, Moonstone Isle, Silver Sandbar), durations and prices are fictional demonstration content.
          Marine-life sightings are never guaranteed, and water and riding activities only operate in suitable weather and sea conditions.
        </p>
      </section>

      <Modal open={!!open} onClose={close} title={open?.title ?? ''} subtitle={open?.summary} wide>
        {open && (
          <div className="space-y-10">
            <div className="grid grid-cols-3 gap-2">
              <div className="col-span-3 aspect-[16/9] overflow-hidden rounded-2xl">
                <Img name={open.image} alt={open.title} sizes="700px" className="img-cover" />
              </div>
              {open.gallery?.slice(0, 3).map((g) => (
                <div key={g} className="aspect-[4/3] overflow-hidden rounded-xl">
                  <Img name={g} alt="" sizes="240px" width={500} className="img-cover" />
                </div>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                { icon: Clock, k: 'Duration', v: open.duration },
                { icon: Users, k: 'Group size', v: `${open.minGuests}–${open.maxGuests} guests${open.minAge ? ` · ${open.minAge}+` : ''}` },
                { icon: CheckCircle2, k: 'From', v: money(fromPrice(open)) },
              ].map(({ icon: Icon, k, v }) => (
                <div key={k} className="rounded-xl border border-line p-4">
                  <Icon className="size-4 text-accent" aria-hidden />
                  <p className="mt-2 text-[0.65rem] uppercase tracking-[0.18em] text-muted">{k}</p>
                  <p className="font-serif text-xl">{v}</p>
                </div>
              ))}
            </div>

            <p className="font-serif text-2xl leading-snug">{open.description}</p>

            {journey && (
              <>
                <div>
                  <h3 className="text-3xl">Why you’ll love it</h3>
                  <ul className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {journey.highlights.map((h, i) => {
                      const Icon = highlightIcon[h.icon]
                      return (
                        <motion.li
                          key={h.text}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.07 }}
                          className="rounded-2xl border border-line bg-bg-alt/60 p-4"
                        >
                          <span className="grid size-10 place-items-center rounded-full bg-gold/15 text-accent">
                            <Icon className="size-5" aria-hidden />
                          </span>
                          <p className="mt-3 text-sm font-medium leading-snug">{h.text}</p>
                        </motion.li>
                      )
                    })}
                  </ul>
                </div>

                <JourneyTimeline steps={journey.steps} title="Your day, moment by moment" />

                <div>
                  <h3 className="text-3xl">Choose your package</h3>
                  <p className="mt-1 text-sm text-muted">Compare what each option includes, then pick one to continue.</p>
                  <div className={`mt-6 grid gap-4 ${open.packages.length > 1 ? 'sm:grid-cols-2' : ''} ${open.packages.length > 2 ? 'lg:grid-cols-3' : ''}`}>
                    {open.packages.map((p) => {
                      const media = journey.packages[p.id]
                      const active = picked.id === p.id
                      return (
                        <button
                          key={p.id}
                          onClick={() => choosePackage(p.id)}
                          aria-pressed={active}
                          className={`group flex flex-col overflow-hidden rounded-2xl border bg-card text-left transition ${active ? 'border-gold shadow-[0_0_0_3px_rgb(199_166_106/0.25)]' : 'border-line hover:border-gold/60'}`}
                        >
                          {media && (
                            <span className="relative block aspect-[16/10] overflow-hidden">
                              <Img name={media.image} alt="" width={600} sizes="(min-width:640px) 300px, 90vw" className="img-cover group-hover:scale-110" />
                              <span className="absolute right-3 top-3 rounded-full bg-midnight/70 px-3 py-1 font-serif text-lg text-pearl backdrop-blur">
                                {money(p.price)}
                                <span className="ml-1 font-sans text-[0.6rem] uppercase tracking-wider text-pearl/70">/{p.per === 'person' ? 'guest' : 'group'}</span>
                              </span>
                            </span>
                          )}
                          <span className="flex flex-1 flex-col p-4">
                            <span className="font-serif text-xl leading-tight">{p.name}</span>
                            {p.note && <span className="mt-0.5 text-xs text-muted">{p.note}</span>}
                            {media && (
                              <span className="mt-3 space-y-1.5 text-sm">
                                {media.perks.map((x) => (
                                  <span key={x} className="flex gap-2">
                                    <Check className="mt-0.5 size-4 shrink-0 text-palm" aria-hidden />
                                    {x}
                                  </span>
                                ))}
                              </span>
                            )}
                            <span className={`mt-4 inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.18em] transition ${active ? 'bg-gold text-midnight' : 'bg-bg-alt group-hover:bg-gold/20'}`}>
                              {active ? <><Check className="size-3.5" aria-hidden /> Selected</> : 'Choose this'}
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-2xl">What’s included</h3>
                <ul className="mt-3 space-y-2 text-sm">
                  {open.includes.map((x) => (
                    <li key={x} className="flex gap-2.5"><CheckCircle2 className="mt-0.5 size-4 shrink-0 text-palm" aria-hidden />{x}</li>
                  ))}
                </ul>
              </div>
              {open.safety.length > 0 && (
                <div>
                  <h3 className="text-2xl">Safety</h3>
                  <ul className="mt-3 space-y-2 text-sm">
                    {open.safety.map((x) => (
                      <li key={x} className="flex gap-2.5"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-lagoon" aria-hidden />{x}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            <p className="text-xs text-muted">Departure times: {open.times.join(' · ')}</p>

            <div ref={bookRef} className="scroll-mt-4 border-t border-line pt-10">
              <h3 className="mb-6 text-4xl">Reserve this experience</h3>
              <ExperienceForm key={open.id} exp={open} onDone={close} packageId={picked} />
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

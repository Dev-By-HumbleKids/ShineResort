import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUpRight, CheckCircle2, Clock, CloudSun, ShieldCheck, Users } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ExperienceForm } from '../components/booking/ExperienceForm'
import { PageHero } from '../components/layout/PageHero'
import { SectionHeading } from '../components/ui/bits'
import { Img } from '../components/ui/Img'
import { Modal } from '../components/ui/Modal'
import { TiltCard } from '../components/ui/TiltCard'
import { experienceCategories, experiences, getExperience } from '../data/experiences'
import type { Experience, ExperienceCategory } from '../data/types'
import { money } from '../lib/pricing'

const fromPrice = (e: Experience) => Math.min(...e.packages.map((p) => p.price))

export default function Experiences() {
  const { id } = useParams()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()
  const cat = (params.get('c') ?? 'all') as 'all' | ExperienceCategory
  const list = useMemo(() => (cat === 'all' ? experiences : experiences.filter((e) => e.category.includes(cat))), [cat])
  const open = id ? getExperience(id) : undefined
  const bookRef = useRef<HTMLDivElement>(null)

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

            <p className="leading-relaxed">{open.description}</p>

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
              <ExperienceForm key={open.id} exp={open} onDone={close} />
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}

import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Clock, Quote } from 'lucide-react'
import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { CountUp, Marquee, WaveEdge } from '../components/fx/Decor'
import { Hero } from '../components/home/Hero'
import { Location } from '../components/home/Location'
import { RoomCard } from '../components/rooms/RoomCard'
import { SectionHeading } from '../components/ui/bits'
import { Img } from '../components/ui/Img'
import { MaskReveal, Reveal } from '../components/ui/Reveal'
import { experiences } from '../data/experiences'
import { facilities } from '../data/facilities'
import { rooms } from '../data/rooms'
import { reviews } from '../data/story'
import { money } from '../lib/pricing'

const IslandScene = lazy(() => import('../three/IslandScene'))

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <VillasStrip />
      <Marquee items={['Island hopping', 'Sunrise rides', 'Lantern-lit dinners', 'Longtail boats', 'Thanaka rituals', 'Golden hours']} className="text-ink/90" />
      <WaveEdge color="var(--color-midnight)" />
      <IslandMap />
      <BeyondTheShore />
      <WaveEdge color="var(--color-midnight)" flip className="-mt-px" />
      <Facilities />
      <Reviews />
      <Location />
      <ClosingCta />
    </>
  )
}

function Intro() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y1 = useTransform(scrollYProgress, [0, 1], ['8%', '-8%'])
  const y2 = useTransform(scrollYProgress, [0, 1], ['-4%', '14%'])
  const stats = [
    { n: '51', l: 'Villas, suites & pavilions' },
    { n: '600 m', l: 'Of private beachfront' },
    { n: '48 m', l: 'Infinity pool' },
    { n: '3', l: 'Islets to explore by boat' },
  ]
  return (
    <section className="container-x py-28 md:py-40" ref={ref}>
      <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-6 lg:pt-10">
          <SectionHeading
            eyebrow="A sanctuary on the Bay of Bengal"
            title={
              <>
                Born from a lamp <em className="text-accent">on the shore.</em>
              </>
            }
            intro="In 1968 a fisherman’s daughter lit a lantern on these dunes to guide the boats home. Three generations later, SHINE still keeps that light burning — a resort of timber, stone and sea air, built to feel as though it grew from the coast."
          />
          <Reveal delay={0.2} className="mt-10">
            <Link to="/story" className="btn btn-ghost">
              Read our story <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
          <dl className="mt-16 grid grid-cols-2 gap-x-8 gap-y-10 border-t border-line pt-10">
            {stats.map((s, i) => (
              <Reveal key={s.l} delay={i * 0.08}>
                <dt className="sr-only">{s.l}</dt>
                <dd>
                  <CountUp value={s.n} className="block font-serif text-5xl md:text-6xl" />
                  <span className="mt-2 block text-sm text-muted">{s.l}</span>
                </dd>
              </Reveal>
            ))}
          </dl>
        </div>
        <div className="relative h-[520px] sm:h-[640px] lg:col-span-6">
          <motion.div style={{ y: y1 }} className="absolute right-0 top-0 h-[78%] w-[78%]">
            <MaskReveal className="h-full rounded-[2rem]">
              <Img name="thatchVillas" alt="Thatched villas and pool framed by tropical gardens" sizes="(min-width:1024px) 40vw, 80vw" className="img-cover" />
            </MaskReveal>
          </motion.div>
          <motion.div style={{ y: y2 }} className="absolute bottom-0 left-0 h-[48%] w-[52%] overflow-hidden rounded-[2rem] border-8 border-bg shadow-2xl">
            <Img name="resortLodge" alt="Teak reception pavilion under a pitched roof" sizes="(min-width:1024px) 25vw, 50vw" className="img-cover" />
          </motion.div>
          <motion.p
            style={{ y: y1 }}
            className="absolute -bottom-6 right-0 hidden max-w-[15rem] text-right font-serif text-lg italic leading-snug text-muted sm:block"
          >
            <span className="mb-2 ml-auto block h-px w-10 bg-gold" aria-hidden />
            Reclaimed teak, laterite stone, lime plaster.
          </motion.p>
        </div>
      </div>
    </section>
  )
}

function VillasStrip() {
  const track = useRef<HTMLDivElement>(null)
  const scroll = (dir: number) => track.current?.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' })
  return (
    <section className="overflow-hidden bg-bg-alt py-28 md:py-36" aria-labelledby="villas-h">
      <div className="container-x flex flex-wrap items-end justify-between gap-8">
        <div id="villas-h">
          <SectionHeading
            eyebrow="Villas & Suites"
            title={
              <>
                Five ways to <em className="text-accent">wake by the sea.</em>
              </>
            }
          />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => scroll(-1)} className="grid size-12 place-items-center rounded-full border border-line transition hover:border-ink" aria-label="Previous villas">
            <ArrowRight className="size-4 rotate-180" />
          </button>
          <button onClick={() => scroll(1)} className="grid size-12 place-items-center rounded-full border border-line transition hover:border-ink" aria-label="Next villas">
            <ArrowRight className="size-4" />
          </button>
          <Link to="/stay" className="btn btn-dark ml-2">
            All accommodation
          </Link>
        </div>
      </div>
      <div
        ref={track}
        className="scrollbar-none mt-14 flex snap-x snap-mandatory gap-6 overflow-x-auto px-5 pb-8 md:px-10 lg:px-[max(2.5rem,calc((100vw-1320px)/2+2.5rem))]"
        tabIndex={0}
        aria-label="Villa carousel, scroll horizontally"
      >
        {rooms.map((r, i) => (
          <Reveal key={r.id} delay={i * 0.06} className="w-[82vw] shrink-0 snap-start sm:w-[24rem]">
            <RoomCard room={r} />
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function IslandMap() {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShow(true), { rootMargin: '300px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <section className="-mt-px bg-midnight py-28 text-pearl md:py-36" aria-labelledby="map-h">
      <div className="container-x">
        <div className="grid gap-10 md:grid-cols-2 md:items-end">
          <div id="map-h">
            <SectionHeading light eyebrow="Explore the resort in 3D" title={<>Your island, <em className="text-gold">from above.</em></>} />
          </div>
          <Reveal>
            <p className="max-w-md text-pearl/70 md:ml-auto">
              Drag to circle the property and tap a glowing marker to step inside — from the over-lagoon pavilions to the jetty where island
              boats depart. Switch to night to see the lanterns come on.
            </p>
          </Reveal>
        </div>
        <Reveal className="mt-14">
          <div ref={ref} data-cursor="Drag" className="relative h-[68vh] min-h-[420px] overflow-hidden rounded-[2rem] bg-teal shadow-[0_40px_120px_-40px_rgb(0_0_0/0.6)] ring-1 ring-pearl/10">
            {show ? (
              <Suspense fallback={<div className="skeleton absolute inset-0 opacity-20" />}>
                <IslandScene />
              </Suspense>
            ) : (
              <div className="skeleton absolute inset-0 opacity-20" />
            )}
          </div>
          <p className="mt-4 text-xs text-pearl/50">Stylised illustrative model of the fictional SHINE resort — not to scale.</p>
        </Reveal>
      </div>
    </section>
  )
}

function BeyondTheShore() {
  const featured = ['island-excursion', 'horse-riding', 'sunset-cruise', 'boat-charter'].map((id) => experiences.find((e) => e.id === id)!)
  return (
    <section className="relative overflow-hidden bg-teal py-28 text-pearl md:py-40" aria-labelledby="beyond-h">
      <div className="absolute inset-0 opacity-25">
        <Img name="aerialWaves" alt="" className="img-cover" />
      </div>
      <div className="absolute inset-0 bg-linear-to-b from-teal via-teal/80 to-midnight" />
      <div className="container-x relative">
        <div id="beyond-h" className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading light eyebrow="Your stay is only the beginning" title={<>Beyond the <em className="text-gold">Shore.</em></>} />
          <Reveal>
            <Link to="/experiences" className="btn btn-gold">
              All experiences <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-12">
          {featured.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.08} className={i === 0 ? 'lg:col-span-7 lg:row-span-2' : i === 1 ? 'lg:col-span-5' : i === 2 ? 'lg:col-span-5' : 'lg:col-span-12'}>
              <Link
                to={`/experiences/${e.id}`}
                data-cursor="Explore"
                className={`group relative block overflow-hidden rounded-[1.75rem] ${i === 0 ? 'h-[460px] lg:h-full' : i === 3 ? 'h-[340px]' : 'h-[300px]'}`}
              >
                <Img name={e.image} alt={e.title} sizes="(min-width:1024px) 50vw, 100vw" className="img-cover transition duration-[1.8s] group-hover:scale-110" />
                <div className="absolute inset-0 bg-linear-to-t from-midnight/90 via-midnight/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 md:p-8">
                  <div>
                    <p className="flex items-center gap-2 text-xs text-pearl/75">
                      <Clock className="size-3.5" aria-hidden /> {e.duration} · from {money(Math.min(...e.packages.map((p) => p.price)))}
                    </p>
                    <h3 className="mt-2 text-3xl md:text-4xl">{e.title}</h3>
                    <p className="mt-2 max-w-md text-sm text-pearl/75">{e.summary}</p>
                  </div>
                  <span className="grid size-12 shrink-0 place-items-center rounded-full border border-pearl/40 transition duration-500 group-hover:rotate-45 group-hover:border-gold group-hover:bg-gold group-hover:text-midnight">
                    <ArrowUpRight className="size-5" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Facilities() {
  const [active, setActive] = useState(0)
  const f = facilities[active]
  return (
    <section id="facilities" className="container-x scroll-mt-24 py-28 md:py-40" aria-labelledby="fac-h">
      <div id="fac-h">
        <SectionHeading eyebrow="Resort facilities" title={<>Everything, <em className="text-accent">within a barefoot walk.</em></>} />
      </div>
      <div className="mt-16 grid gap-10 lg:grid-cols-12">
        <div role="tablist" aria-label="Resort facilities" aria-orientation="vertical" className="lg:col-span-5">
          {facilities.map((x, i) => (
            <button
              key={x.id}
              role="tab"
              id={`fac-tab-${x.id}`}
              aria-selected={i === active}
              aria-controls="fac-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onMouseEnter={() => window.matchMedia('(pointer: fine)').matches && setActive(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                  e.preventDefault()
                  const n = (i + (e.key === 'ArrowDown' ? 1 : -1) + facilities.length) % facilities.length
                  setActive(n)
                  document.getElementById(`fac-tab-${facilities[n].id}`)?.focus()
                }
              }}
              className={`group flex w-full items-baseline justify-between gap-4 border-b border-line py-5 text-left transition ${i === active ? '' : 'text-muted hover:text-ink'}`}
            >
              <span className="flex items-baseline gap-5">
                <span className="w-6 text-xs tabular-nums text-accent">{String(i + 1).padStart(2, '0')}</span>
                <span className={`font-serif text-3xl transition md:text-4xl ${i === active ? 'translate-x-2 italic' : ''}`}>{x.name}</span>
              </span>
              <span className="eyebrow hidden text-[0.6rem] sm:block">{x.kicker}</span>
            </button>
          ))}
        </div>
        <div id="fac-panel" role="tabpanel" aria-labelledby={`fac-tab-${f.id}`} className="lg:col-span-7">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-bg-alt">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.div
                key={f.id}
                className="absolute inset-0"
                initial={{ clipPath: 'inset(0 0 0 100%)' }}
                animate={{ clipPath: 'inset(0 0 0 0%)' }}
                exit={{ opacity: 0.6 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              >
                <Img name={f.image} alt={f.name} sizes="(min-width:1024px) 55vw, 100vw" className="img-cover" />
              </motion.div>
            </AnimatePresence>
            <span className="absolute left-5 top-5 rounded-full bg-midnight/75 px-3 py-1.5 text-xs text-pearl backdrop-blur">
              <Clock className="mr-1.5 inline size-3.5" aria-hidden />
              {f.hours}
            </span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={f.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="mt-8 grid gap-8 md:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="leading-relaxed text-muted">{f.description}</p>
                <Link to={f.cta.to} className="btn btn-dark mt-6">
                  {f.cta.label} <ArrowRight className="size-4" aria-hidden />
                </Link>
              </div>
              <ul className="space-y-2.5 text-sm">
                {f.details.map((d) => (
                  <li key={d} className="flex items-center gap-3">
                    <span className="size-1.5 rounded-full bg-gold" aria-hidden />
                    {d}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  const [i, setI] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const t = setInterval(() => setI((x) => (x + 1) % reviews.length), 7000)
    return () => clearInterval(t)
  }, [])
  const r = reviews[i]
  return (
    <section className="bg-bg-alt py-28 md:py-36" aria-label="Guest impressions">
      <div className="container-x text-center">
        <Quote className="mx-auto size-10 text-gold" aria-hidden />
        <div className="relative mx-auto mt-8 min-h-[13rem] max-w-4xl" aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.figure key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.7 }}>
              <blockquote className="text-balance font-serif text-3xl leading-snug md:text-5xl">“{r.quote}”</blockquote>
              <figcaption className="mt-8 text-xs uppercase tracking-[0.25em] text-muted">
                {r.name} · {r.from}
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {reviews.map((_, n) => (
            <button
              key={n}
              onClick={() => setI(n)}
              aria-label={`Show review ${n + 1}`}
              aria-current={n === i}
              className={`h-1.5 rounded-full transition-all ${n === i ? 'w-10 bg-ink' : 'w-4 bg-line hover:bg-muted'}`}
            />
          ))}
        </div>
        <p className="mt-6 text-xs text-muted">Illustrative reviews written for this fictional demo.</p>
      </div>
    </section>
  )
}

function ClosingCta() {
  return (
    <section className="relative overflow-hidden bg-midnight py-40 text-pearl md:py-56">
      <div className="absolute inset-0">
        <Img name="beachRocksSunset" alt="" className="img-cover animate-[kenburns_20s_ease-out_both] opacity-70" />
      </div>
      <div className="absolute inset-0 bg-linear-to-t from-midnight via-midnight/30 to-midnight/50" />
      <div aria-hidden className="absolute left-1/2 top-1/2 size-[40rem] -translate-x-1/2 -translate-y-1/2 animate-[lantern_6s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgb(199_166_106/0.22),transparent_60%)]" />
      <div className="container-x relative text-center">
        <Reveal>
          <p className="eyebrow text-gold">Stay by the sea. Discover beyond the shore.</p>
          <h2 className="mx-auto mt-6 max-w-4xl text-balance text-5xl md:text-8xl">
            The lantern is lit. <em>Come home to the shore.</em>
          </h2>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <Link to="/book" className="btn btn-gold">
              Book Your Stay
            </Link>
            <Link to="/stay#packages" className="btn btn-ghost-light">
              View packages
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

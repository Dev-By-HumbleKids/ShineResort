import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHero } from '../components/layout/PageHero'
import { SectionHeading } from '../components/ui/bits'
import { Img } from '../components/ui/Img'
import { MaskReveal, Reveal } from '../components/ui/Reveal'
import { architecture, timeline, values } from '../data/story'

export default function Story() {
  return (
    <>
      <PageHero
        eyebrow="Our Story · Est. 2019"
        title="A light kept burning for three generations."
        image="beachDawn"
        intro="SHINE began not as a hotel, but as a lantern on the dunes of Ngwe Saung. This is the (fictional) story of the family who kept it lit."
      />
      <Opening />
      <Timeline />
      <Values />
      <Architecture />
      <section className="bg-bg-alt py-24 text-center">
        <div className="container-x">
          <Reveal>
            <p className="mx-auto max-w-3xl font-serif text-3xl leading-snug md:text-5xl">
              “We didn’t want to build a hotel on the beach. We wanted to build the beach a place to welcome people.”
            </p>
            <p className="mt-6 text-xs uppercase tracking-[0.25em] text-muted">Mya Shwe · Founder & architect (fictional)</p>
            <Link to="/stay" className="btn btn-dark mt-10">
              Find your villa <ArrowRight className="size-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function Opening() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 85%', 'end 40%'] })
  const words = 'Every evening at dusk, a lantern is still lit on the dunes in front of the reception pavilion — the same place a fisherman’s daughter first lit hers in 1968.'.split(' ')
  return (
    <section className="container-x py-28 md:py-40">
      <div ref={ref} className="mx-auto max-w-5xl">
        <p className="eyebrow mb-8 text-accent">The lamp on the shore</p>
        <p className="font-serif text-4xl leading-[1.15] md:text-6xl">
          {words.map((w, i) => (
            <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
              {w}
            </Word>
          ))}
        </p>
      </div>
    </section>
  )
}

function Word({ children, progress, range }: { children: string; progress: ReturnType<typeof useScroll>['scrollYProgress']; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.15, 1])
  return (
    <motion.span style={{ opacity }} className="mr-[0.25em] inline-block">
      {children}
    </motion.span>
  )
}

function Timeline() {
  const [active, setActive] = useState(0)
  const refs = useRef<(HTMLLIElement | null)[]>([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section className="bg-midnight py-24 text-pearl md:py-32" aria-labelledby="tl-h">
      <div className="container-x">
        <div id="tl-h">
          <SectionHeading light eyebrow="1968 — today" title={<>From lantern to <em className="text-gold">sanctuary.</em></>} />
        </div>
        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <div className="hidden lg:block">
            <div className="sticky top-28 aspect-[4/5] overflow-hidden rounded-[2rem]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.08, filter: 'grayscale(1)' }}
                  animate={{ opacity: 1, scale: 1, filter: active < 2 ? 'grayscale(0.85) sepia(0.3)' : 'grayscale(0)' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  <Img name={timeline[active].image} alt="" sizes="45vw" className="img-cover" />
                </motion.div>
              </AnimatePresence>
              <p className="absolute bottom-6 left-6 font-serif text-8xl text-pearl/90 mix-blend-overlay">{timeline[active].year}</p>
            </div>
          </div>
          <ol className="relative border-l border-pearl/15 pl-8 lg:pl-12">
            {timeline.map((t, i) => (
              <li
                key={t.year}
                ref={(el) => {
                  refs.current[i] = el
                }}
                data-i={i}
                className="relative pb-24 last:pb-4 lg:min-h-[55vh]"
              >
                <span
                  className={`absolute -left-[2.45rem] top-2 size-3 rounded-full border-2 transition duration-500 lg:-left-[3.45rem] ${i <= active ? 'border-gold bg-gold shadow-[0_0_20px_4px_rgb(199_166_106/0.5)]' : 'border-pearl/40 bg-midnight'}`}
                  aria-hidden
                />
                <p className={`font-serif text-6xl transition duration-500 md:text-7xl ${i === active ? 'text-gold' : 'text-pearl/30'}`}>{t.year}</p>
                <h3 className="mt-3 text-3xl md:text-4xl">{t.title}</h3>
                <p className="mt-4 max-w-md leading-relaxed text-pearl/70">{t.text}</p>
                <div className={`mt-6 aspect-[16/10] overflow-hidden rounded-2xl lg:hidden ${i < 2 ? "grayscale-[0.85] sepia-[0.3]" : ""}`}>
                  <Img name={t.image} alt="" sizes="90vw" className="img-cover" />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}

function Values() {
  return (
    <section className="container-x py-24 md:py-32" aria-labelledby="val-h">
      <div id="val-h">
        <SectionHeading
          eyebrow="What we believe"
          title={<>Hospitality, <em className="text-accent">the Ngwe Saung way.</em></>}
          intro="Our approach to the coast is practical rather than performative: we describe what we do, not certifications we hold."
        />
      </div>
      <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] bg-line sm:grid-cols-2 lg:grid-cols-4">
        {values.map((v, i) => (
          <Reveal key={v.title} delay={i * 0.07} className="h-full bg-bg p-8">
            <p className="font-serif text-5xl text-accent">0{i + 1}</p>
            <h3 className="mt-6 text-3xl">{v.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{v.text}</p>
          </Reveal>
        ))}
      </div>
    </section>
  )
}

function Architecture() {
  const [active, setActive] = useState<number | null>(null)
  return (
    <section id="architecture" className="scroll-mt-20 bg-bg-alt py-24 md:py-32" aria-labelledby="arch-h">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <div id="arch-h">
            <SectionHeading eyebrow="Architecture" title={<>Built from the <em className="text-accent">coast itself.</em></>} />
          </div>
          <Reveal>
            <p className="leading-relaxed text-muted">
              Mya Shwe’s design arranges every villa to face the sea breeze, so most rooms need no air-conditioning by evening. Deep teak overhangs
              shade glass walls; laterite stone keeps floors cool; boardwalks float above the dunes so sand and roots can move freely. At night, low
              amber lighting keeps the shoreline dark.
            </p>
          </Reveal>
        </div>

        <SitePlan active={active} onHover={setActive} />

        <div className="mt-14 grid auto-rows-[260px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {architecture.map((a, i) => (
            <MaskReveal
              key={a.title}
              delay={(i % 4) * 0.06}
              className={`group relative rounded-[1.5rem] ${i === 0 ? 'sm:col-span-2 sm:row-span-2' : i === 3 ? 'lg:col-span-2' : ''} ${active === i ? 'ring-4 ring-gold' : ''}`}
            >
              <div onMouseEnter={() => setActive(i)} onMouseLeave={() => setActive(null)} className="h-full">
                <Img name={a.image} alt={a.title} sizes="(min-width:1024px) 40vw, 90vw" className="img-cover transition duration-[1.5s] group-hover:scale-105" />
                <div className="absolute inset-0 bg-linear-to-t from-midnight/85 via-midnight/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-pearl">
                  <h3 className="text-2xl">{a.title}</h3>
                  <p className="mt-1 max-h-0 overflow-hidden text-sm text-pearl/80 opacity-0 transition-all duration-500 group-hover:max-h-24 group-hover:opacity-100 group-focus-within:max-h-24 group-focus-within:opacity-100 max-md:max-h-24 max-md:opacity-100">
                    {a.caption}
                  </p>
                </div>
              </div>
            </MaskReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/** Simplified illustrative site plan — numbers correspond to the gallery below. */
function SitePlan({ active, onHover }: { active: number | null; onHover: (i: number | null) => void }) {
  const pins: [number, number][] = [
    [300, 150], // Lamp Pavilion
    [300, 235], // Long Pool
    [190, 120], // Courtyard villas
    [420, 120], // Walkways
    [520, 190], // lighting
    [120, 205], // material
  ]
  return (
    <Reveal className="mt-14">
      <figure className="overflow-hidden rounded-[2rem] border border-line bg-bg p-4 md:p-8">
        <svg viewBox="0 0 600 320" className="h-auto w-full" role="img" aria-label="Illustrative site plan of SHINE showing villas, pool, reception pavilion and beach">
          <defs>
            <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#4d8990" stopOpacity=".35" />
              <stop offset="1" stopColor="#164b50" stopOpacity=".6" />
            </linearGradient>
          </defs>
          <rect x="0" y="262" width="600" height="58" fill="url(#sea)" />
          <path d="M0 262 Q150 250 300 258 T600 252 L600 262 Z" fill="#e9ddc9" opacity=".8" />
          <rect x="0" y="40" width="600" height="212" fill="#536c55" opacity=".12" rx="18" />
          {/* boardwalk */}
          <path d="M60 150 H540" stroke="var(--color-gold)" strokeWidth="2" strokeDasharray="5 6" fill="none" />
          {/* villas */}
          {[...Array(9)].map((_, i) => (
            <rect key={i} x={60 + i * 55} y={75} width="34" height="30" rx="4" fill="var(--color-card)" stroke="var(--color-line)" />
          ))}
          {[...Array(4)].map((_, i) => (
            <g key={i}>
              <rect x={70 + i * 120} y={180} width="40" height="30" rx="4" fill="var(--color-card)" stroke="var(--color-line)" />
              <rect x={74 + i * 120} y={214} width="32" height="10" rx="2" fill="#5cc6c8" />
            </g>
          ))}
          {/* reception */}
          <polygon points="270,135 330,135 315,165 285,165" fill="#6b5641" opacity=".85" />
          {/* long pool */}
          <rect x="235" y="228" width="130" height="14" rx="3" fill="#5cc6c8" />
          {pins.map(([x, y], i) => (
            <g
              key={i}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
              className="cursor-pointer"
            >
              <circle cx={x} cy={y} r={active === i ? 14 : 11} fill={active === i ? 'var(--color-gold)' : 'var(--color-midnight)'} className="transition-all" />
              <text x={x} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={active === i ? '#102C35' : '#F7F4ED'}>
                {i + 1}
              </text>
            </g>
          ))}
          <text x="300" y="300" textAnchor="middle" fontSize="11" letterSpacing="4" fill="#F7F4ED" opacity=".9">
            BAY OF BENGAL
          </text>
        </svg>
        <figcaption className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
          {architecture.map((a, i) => (
            <button key={a.title} onMouseEnter={() => onHover(i)} onFocus={() => onHover(i)} onMouseLeave={() => onHover(null)} onBlur={() => onHover(null)} className={`transition ${active === i ? 'text-ink' : ''}`}>
              <strong className="text-accent">{i + 1}</strong> {a.title}
            </button>
          ))}
          <span className="w-full">Illustrative, not to scale.</span>
        </figcaption>
      </figure>
    </Reveal>
  )
}

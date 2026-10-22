import { AnimatePresence, motion } from 'framer-motion'
import { Clock, Leaf, Wheat } from 'lucide-react'
import { useId, useMemo, useState, type FormEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Confirmation } from '../components/booking/Confirmation'
import { emptyGuest, GuestFields, validateGuest, type GuestErrors } from '../components/booking/GuestFields'
import { PageHero } from '../components/layout/PageHero'
import { DemoNotice, Field, SectionHeading, Stepper } from '../components/ui/bits'
import { DateField } from '../components/ui/DateField'
import { Img } from '../components/ui/Img'
import { MaskReveal, Reveal } from '../components/ui/Reveal'
import { diningImages, menu, menuCategories, venues } from '../data/dining'
import type { MenuCategory } from '../data/types'
import { addDays, formatDate, today } from '../lib/dates'
import { money } from '../lib/pricing'
import { saveReservation, type Guest, type Reservation } from '../lib/reservations'

export default function Dining() {
  return (
    <>
      <PageHero
        eyebrow="Dining at SHINE"
        title="Cooking that follows the tide."
        image="restaurantTerrace"
        intro="From mohinga at dawn to lobster by lantern-light — four venues, one philosophy: the morning’s catch, the region’s markets and Myanmar’s generous table."
      />
      <Venues />
      <MenuExplorer />
      <TableReservation />
    </>
  )
}

function Venues() {
  return (
    <section className="container-x py-24 md:py-32" aria-labelledby="venues-h">
      <div id="venues-h">
        <SectionHeading eyebrow="Four venues" title={<>Where shall we <em className="text-accent">dine tonight?</em></>} />
      </div>
      <div className="mt-16 space-y-20">
        {venues.map((v, i) => (
          <article key={v.id} className={`grid items-center gap-10 md:grid-cols-12 ${i % 2 ? 'md:[&>*:first-child]:order-2' : ''}`}>
            <MaskReveal className="aspect-[5/4] rounded-[2rem] md:col-span-7">
              <Img name={v.image} alt={`${v.name} — ${v.kind}`} sizes="(min-width:768px) 55vw, 100vw" className="img-cover" />
            </MaskReveal>
            <Reveal className="md:col-span-5">
              <p className="eyebrow text-accent">{v.kind}</p>
              <h3 className="mt-3 text-5xl md:text-6xl">{v.name}</h3>
              <p className="mt-5 leading-relaxed text-muted">{v.description}</p>
              <p className="mt-6 flex items-center gap-2 text-sm">
                <Clock className="size-4 text-accent" aria-hidden /> {v.hours}
              </p>
            </Reveal>
          </article>
        ))}
      </div>
    </section>
  )
}

type Diet = 'all' | 'V' | 'VG' | 'GF'

function MenuExplorer() {
  const [params, setParams] = useSearchParams()
  const initial = params.get('menu') as MenuCategory | null
  const [cat, setCat] = useState<MenuCategory>(initial && menuCategories.includes(initial) ? initial : 'Starters')
  const [diet, setDiet] = useState<Diet>('all')
  const items = useMemo(
    () => menu.filter((m) => m.category === cat && (diet === 'all' || m.tags?.includes(diet) || (diet === 'V' && m.tags?.includes('VG')))),
    [cat, diet],
  )
  const select = (c: MenuCategory) => {
    setCat(c)
    setParams({ menu: c }, { replace: true, preventScrollReset: true })
  }

  return (
    <section id="menu" className="scroll-mt-20 bg-midnight py-24 text-pearl md:py-32" aria-labelledby="menu-h">
      <div className="container-x">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div id="menu-h">
              <SectionHeading light eyebrow="Tidewater · sample menu" title={<>Taste the <em className="text-gold">coast.</em></>} />
            </div>
            <div className="mt-10 hidden grid-cols-3 gap-2 lg:grid">
              {diningImages.slice(0, 6).map((im) => (
                <div key={im} className="aspect-square overflow-hidden rounded-xl">
                  <Img name={im} alt="" sizes="120px" width={300} className="img-cover transition duration-700 hover:scale-110" />
                </div>
              ))}
            </div>
          </div>
          <div className="min-w-0 lg:col-span-8">
            <div role="tablist" aria-label="Menu sections" className="scrollbar-none -mx-5 flex gap-1 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
              {menuCategories.map((c) => (
                <button
                  key={c}
                  role="tab"
                  aria-selected={c === cat}
                  aria-controls="menu-panel"
                  onClick={() => select(c)}
                  className={`relative shrink-0 rounded-full px-4 py-2.5 text-sm transition ${c === cat ? 'text-midnight' : 'text-pearl/70 hover:text-pearl'}`}
                >
                  {c === cat && <motion.span layoutId="menu-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                  <span className="relative">{c}</span>
                </button>
              ))}
            </div>
            <div className="mt-5 flex flex-wrap items-center gap-2 text-xs" role="group" aria-label="Dietary filter">
              <span className="text-pearl/60">Dietary:</span>
              {(
                [
                  ['all', 'Everything'],
                  ['V', 'Vegetarian'],
                  ['VG', 'Vegan'],
                  ['GF', 'Gluten-free'],
                ] as [Diet, string][]
              ).map(([d, l]) => (
                <button
                  key={d}
                  aria-pressed={diet === d}
                  onClick={() => setDiet(d)}
                  className={`rounded-full border px-3 py-1.5 transition ${diet === d ? 'border-gold text-gold' : 'border-pearl/20 text-pearl/70 hover:border-pearl/50'}`}
                >
                  {l}
                </button>
              ))}
            </div>

            <div id="menu-panel" role="tabpanel" aria-label={cat} className="mt-8 min-h-[22rem]">
              <AnimatePresence mode="wait">
                <motion.ul key={cat + diet} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }} className="divide-y divide-pearl/10">
                  {items.length === 0 && <li className="py-10 text-pearl/60">No dishes in this section match that dietary filter.</li>}
                  {items.map((m) => (
                    <li key={m.name} className="flex items-baseline justify-between gap-6 py-5">
                      <div>
                        <p className="flex flex-wrap items-center gap-2 font-serif text-2xl">
                          {m.name}
                          {m.tags?.includes('Signature') && <span className="rounded-full border border-gold/60 px-2 py-0.5 font-sans text-[0.6rem] uppercase tracking-[0.15em] text-gold">Signature</span>}
                        </p>
                        <p className="mt-1 text-sm text-pearl/65">{m.description}</p>
                        <p className="mt-2 flex gap-3 text-[0.68rem] uppercase tracking-[0.12em] text-pearl/55">
                          {m.tags?.includes('VG') ? (
                            <span className="flex items-center gap-1"><Leaf className="size-3" aria-hidden />Vegan</span>
                          ) : m.tags?.includes('V') ? (
                            <span className="flex items-center gap-1"><Leaf className="size-3" aria-hidden />Vegetarian</span>
                          ) : null}
                          {m.tags?.includes('GF') && <span className="flex items-center gap-1"><Wheat className="size-3" aria-hidden />Gluten-free</span>}
                          {m.tags?.includes('Spicy') && <span>🌶 Spicy</span>}
                        </p>
                      </div>
                      <p className="shrink-0 font-serif text-2xl tabular-nums text-gold">{money(m.price)}</p>
                    </li>
                  ))}
                </motion.ul>
              </AnimatePresence>
            </div>
            <p className="mt-6 text-xs text-pearl/50">Fictional demonstration menu. Prices in USD; dishes are illustrative and not served at a real restaurant.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

const times = ['18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30']
const occasions = ['None', 'Birthday', 'Anniversary', 'Honeymoon', 'Proposal', 'Business']

function TableReservation() {
  const id = useId()
  const [date, setDate] = useState(addDays(today(), 1))
  const [time, setTime] = useState('19:30')
  const [party, setParty] = useState(2)
  const [venue, setVenue] = useState(venues[0].id)
  const [occasion, setOccasion] = useState('None')
  const [guest, setGuest] = useState<Guest>(emptyGuest)
  const [errors, setErrors] = useState<GuestErrors & { date?: string }>({})
  const [done, setDone] = useState<Reservation | null>(null)

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = { ...validateGuest(guest) }
    if (!date || date < today()) errs.date = 'Choose today or a future date.'
    else if (date > addDays(today(), 180)) errs.date = 'Tables can be reserved up to 6 months ahead.'
    setErrors(errs)
    if (Object.keys(errs).length) {
      setTimeout(() => document.querySelector<HTMLElement>('#reserve [aria-invalid="true"]')?.focus(), 40)
      return
    }
    const v = venues.find((x) => x.id === venue)!
    setDone(
      saveReservation({
        kind: 'dining',
        title: `Table at ${v.name}`,
        summary: `${formatDate(date)} · ${time} · ${party} guest${party > 1 ? 's' : ''}${occasion !== 'None' ? ` · ${occasion}` : ''}`,
        date,
        status: party > 8 || venue === 'pavilions' ? 'pending' : 'confirmed',
        guest,
        meta: { venue, time, party, occasion },
      }),
    )
  }

  return (
    <section id="reserve" className="scroll-mt-20 py-24 md:py-32" aria-labelledby="table-h">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div id="table-h">
            <SectionHeading eyebrow="Reserve a table" title={<>Save the <em className="text-accent">sunset seats.</em></>} intro="Tables for up to eight are confirmed instantly in this demo. Larger parties and private pavilions are passed to our events team." />
          </div>
          <MaskReveal className="mt-10 hidden aspect-[4/3] rounded-[2rem] lg:block">
            <Img name="wineSunset" alt="Glasses of wine against the sunset" sizes="40vw" className="img-cover" />
          </MaskReveal>
        </div>
        <div className="lg:col-span-7">
          <div className="rounded-[2rem] border border-line bg-card p-6 md:p-10">
            {done ? (
              <Confirmation r={done} onDone={() => setDone(null)} />
            ) : (
              <form onSubmit={submit} noValidate className="space-y-6" aria-label="Table reservation">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field id={`${id}-venue`} label="Venue">
                    <select id={`${id}-venue`} className="field" value={venue} onChange={(e) => setVenue(e.target.value)}>
                      {venues.map((v) => (
                        <option key={v.id} value={v.id}>
                          {v.name} — {v.kind}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field id={`${id}-occ`} label="Special occasion">
                    <select id={`${id}-occ`} className="field" value={occasion} onChange={(e) => setOccasion(e.target.value)}>
                      {occasions.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </Field>
                  <Field id={`${id}-date`} label="Date" error={errors.date}>
                    <DateField
                      id={`${id}-date`}
                      min={today()}
                      max={addDays(today(), 180)}
                      value={date}
                      onChange={setDate}
                      invalid={!!errors.date}
                      describedBy={errors.date ? `${id}-date-error` : undefined}
                    />
                  </Field>
                  <Field id={`${id}-time`} label="Time">
                    <select id={`${id}-time`} className="field" value={time} onChange={(e) => setTime(e.target.value)}>
                      {times.map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div className="rounded-xl border border-line px-4">
                  <Stepper label="Party size" hint="Up to 12 · 9+ by request" value={party} min={1} max={12} onChange={setParty} />
                </div>
                <GuestFields value={guest} onChange={setGuest} errors={errors} requestsLabel="Dietary needs or requests (optional)" />
                <button type="submit" className="btn btn-gold w-full">
                  {party > 8 || venue === 'pavilions' ? 'Send request' : 'Reserve table'}
                </button>
                <DemoNotice>Frontend demo — your request is stored only in this browser. No email is sent.</DemoNotice>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

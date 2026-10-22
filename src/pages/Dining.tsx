import { Clock } from 'lucide-react'
import { useEffect, useId, useState, type FormEvent } from 'react'
import { Confirmation } from '../components/booking/Confirmation'
import { emptyGuest, GuestFields, validateGuest, type GuestErrors } from '../components/booking/GuestFields'
import { MenuExplorer } from '../components/dining/MenuExplorer'
import { MenuSets } from '../components/dining/MenuSets'
import { PageHero } from '../components/layout/PageHero'
import { DemoNotice, Field, PriceSummary, SectionHeading, Stepper } from '../components/ui/bits'
import { DateField } from '../components/ui/DateField'
import { Img } from '../components/ui/Img'
import { MaskReveal, Reveal } from '../components/ui/Reveal'
import { venues } from '../data/dining'
import { getSet, menuSets, type MenuSet } from '../data/sets'
import { addDays, formatDate, today } from '../lib/dates'
import { money, withFees } from '../lib/pricing'
import { scrollToEl } from '../lib/scroll'
import { saveReservation, type Guest, type Reservation } from '../lib/reservations'

export default function Dining() {
  // a set chosen from the showcase pre-fills the reservation form
  const [picked, setPicked] = useState<{ id: string; n: number }>({ id: '', n: 0 })
  const reserveSet = (id: string) => {
    setPicked((p) => ({ id, n: p.n + 1 }))
    setTimeout(() => scrollToEl(document.getElementById('reserve')), 60)
  }
  return (
    <>
      <PageHero
        eyebrow="Dining at SHINE"
        title="Cooking that follows the tide."
        image="restaurantTerrace"
        intro="From mohinga at dawn to lobster by lantern-light — four venues, one philosophy: the morning’s catch, the region’s markets and Myanmar’s generous table."
      />
      <Venues />
      <MenuSets onReserve={reserveSet} />
      <MenuExplorer />
      <TableReservation picked={picked} />
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

const dinnerTimes = ['18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30']
/** Seating times that make sense for the chosen set. */
function timesFor(set?: MenuSet) {
  if (!set) return dinnerTimes
  if (set.id === 'mont-tea') return ['14:30', '15:00', '15:30', '16:00', '16:30', '17:00']
  if (set.id === 'mohinga-sunrise') return ['06:30', '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00']
  if (set.id === 'golden-hour') return ['17:00', '17:30', '18:00', '18:30']
  if (set.served.startsWith('Lunch') || set.served === 'All day') return ['12:00', '12:30', '13:00', '13:30', ...dinnerTimes]
  return dinnerTimes
}
const occasions = ['None', 'Birthday', 'Anniversary', 'Honeymoon', 'Proposal', 'Business']

function TableReservation({ picked }: { picked: { id: string; n: number } }) {
  const id = useId()
  const [setId, setSetId] = useState('')
  const [date, setDate] = useState(addDays(today(), 1))
  const [time, setTime] = useState('19:30')
  const [party, setParty] = useState(2)
  const [venue, setVenue] = useState(venues[0].id)
  const [occasion, setOccasion] = useState('None')
  const [guest, setGuest] = useState<Guest>(emptyGuest)
  const [errors, setErrors] = useState<GuestErrors & { date?: string }>({})
  const [done, setDone] = useState<Reservation | null>(null)
  const set = getSet(setId)
  const times = timesFor(set)
  const setTotal = set ? (set.per === 'person' ? set.price * party : set.price) : 0

  const applySet = (sid: string) => {
    setSetId(sid)
    const s = getSet(sid)
    if (!s) {
      setTime('19:30')
      return
    }
    setVenue(s.venue)
    setParty(s.party)
    const slots = timesFor(s)
    setTime(slots[Math.min(1, slots.length - 1)])
  }
  useEffect(() => {
    if (!picked.n) return
    setDone(null)
    applySet(picked.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked.n])

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
        summary: `${formatDate(date)} · ${time} · ${party} guest${party > 1 ? 's' : ''}${set ? ` · ${set.name}` : ''}${occasion !== 'None' ? ` · ${occasion}` : ''}`,
        date,
        status: party > 8 || venue === 'pavilions' ? 'pending' : 'confirmed',
        totals: set ? withFees([{ label: set.name, amount: setTotal, hint: set.per === 'person' ? `${money(set.price)} × ${party} guests` : set.serves }]) : undefined,
        guest,
        meta: { venue, time, party, occasion, ...(set ? { set: set.id } : {}) },
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
                <Field id={`${id}-set`} label="Menu set (optional)">
                  <select id={`${id}-set`} className="field" value={setId} onChange={(e) => applySet(e.target.value)}>
                    <option value="">À la carte — no set</option>
                    {menuSets.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} · {money(m.price)}/{m.per === 'person' ? 'guest' : 'set'}
                      </option>
                    ))}
                  </select>
                </Field>
                {set && (
                  <div className="flex items-center gap-4 rounded-2xl border border-gold/50 bg-gold/10 p-3">
                    <span className="size-16 shrink-0 overflow-hidden rounded-xl">
                      <Img name={set.image} alt="" width={200} sizes="64px" className="img-cover" />
                    </span>
                    <span className="min-w-0 flex-1">
                      {set.my && <span className="font-myanmar block text-sm text-accent">{set.my}</span>}
                      <span className="block font-serif text-xl leading-tight">{set.name}</span>
                      <span className="text-xs text-muted">{set.served} · {set.serves}</span>
                    </span>
                    <button type="button" onClick={() => applySet('')} className="self-start text-xs text-muted underline hover:text-ink">
                      Remove
                    </button>
                  </div>
                )}
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
                {set && <PriceSummary totals={withFees([{ label: set.name, amount: setTotal, hint: set.per === 'person' ? `${money(set.price)} × ${party} guests` : set.serves }])} note="Set price shown for planning — settled at the restaurant. Demo only, no payment taken." />}
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

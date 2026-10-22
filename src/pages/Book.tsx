import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Check, Info } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Confirmation } from '../components/booking/Confirmation'
import { emptyGuest, GuestFields, validateGuest, type GuestErrors } from '../components/booking/GuestFields'
import { StaySearch, validateStay } from '../components/booking/StaySearch'
import { RoomFacts } from '../components/rooms/RoomCard'
import { DemoNotice, PriceSummary, StatusBadge } from '../components/ui/bits'
import { Img } from '../components/ui/Img'
import { useStay } from '../context/StayContext'
import { packages } from '../data/packages'
import { getRoom, rooms } from '../data/rooms'
import { checkRoom } from '../lib/availability'
import { addDays, formatDate, formatRange, nightsBetween } from '../lib/dates'
import { money, roomExtras, withFees, type Line, type Totals } from '../lib/pricing'
import { scrollToTop } from '../lib/scroll'
import { saveReservation, type Guest, type Reservation } from '../lib/reservations'

const steps = ['Dates', 'Room', 'Extras', 'Details', 'Review'] as const

export default function Book() {
  const [params] = useSearchParams()
  const { query, setQuery } = useStay()
  const pkg = packages.find((p) => p.id === params.get('package'))
  const [step, setStep] = useState(() => (params.get('room') ? 1 : 0))
  const [roomId, setRoomId] = useState<string | null>(pkg?.roomId ?? params.get('room'))
  const [extras, setExtras] = useState<string[]>([])
  const [guest, setGuest] = useState<Guest>(emptyGuest)
  const [arrival, setArrival] = useState('15:00 – 17:00')
  const [errors, setErrors] = useState<GuestErrors>({})
  const [agree, setAgree] = useState(false)
  const [agreeErr, setAgreeErr] = useState(false)
  const [done, setDone] = useState<Reservation | null>(null)
  const top = useRef<HTMLDivElement>(null)

  // packages fix the length of stay
  useEffect(() => {
    if (pkg && nightsBetween(query.checkIn, query.checkOut) !== pkg.nights) setQuery({ ...query, checkOut: addDays(query.checkIn, pkg.nights) })
  }, [pkg, query, setQuery])

  const room = roomId ? getRoom(roomId) : undefined
  const a = room ? checkRoom(room, query) : null
  const nights = nightsBetween(query.checkIn, query.checkOut)

  const totals: Totals | null = useMemo(() => {
    if (!room || !a) return null
    const extraLines: Line[] = roomExtras.filter((x) => extras.includes(x.id)).map((x) => ({ label: x.name, amount: x.price }))
    if (pkg) {
      const lines = [{ label: `${pkg.name} package`, amount: pkg.price, hint: `${pkg.nights} nights · taxes included` }, ...extraLines]
      const ex = withFees(extraLines)
      return { lines, subtotal: pkg.price + ex.subtotal, service: ex.service, tax: ex.tax, total: pkg.price + ex.total }
    }
    const roomTotal = a.nights.reduce((s, n) => s + n.price, 0) * query.rooms
    return withFees([
      { label: `${room.name}`, amount: roomTotal, hint: `${nights} night${nights > 1 ? 's' : ''}${query.rooms > 1 ? ` × ${query.rooms} rooms` : ''} · avg ${money(Math.round(roomTotal / nights / query.rooms))}/night` },
      ...extraLines,
    ])
  }, [room, a, extras, pkg, query.rooms, nights])

  const go = (n: number) => {
    setStep(n)
    requestAnimationFrame(() => {
      scrollToTop(false)
      top.current?.focus()
    })
  }

  const canChooseRoom = Object.keys(validateStay(query)).length === 0
  const roomOk = !!(room && a && a.fits && a.status !== 'sold-out')

  const submitDetails = (e: FormEvent) => {
    e.preventDefault()
    const errs = validateGuest(guest)
    setErrors(errs)
    if (Object.keys(errs).length) {
      setTimeout(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(), 40)
      return
    }
    go(4)
  }

  const confirm = () => {
    if (!agree) {
      setAgreeErr(true)
      return
    }
    if (!room || !totals || !a) return
    const r = saveReservation({
      kind: 'stay',
      title: pkg ? `${pkg.name} · ${room.name}` : room.name,
      summary: `${formatRange(query.checkIn, query.checkOut)} · ${query.adults + query.children} guest${query.adults + query.children > 1 ? 's' : ''} · ${query.rooms} room${query.rooms > 1 ? 's' : ''}`,
      date: query.checkIn,
      endDate: query.checkOut,
      status: a.status === 'request' ? 'pending' : 'confirmed',
      totals,
      guest,
      meta: { room: room.id, arrival, ...(pkg ? { package: pkg.id } : {}) },
    })
    setDone(r)
    scrollToTop(false)
  }

  return (
    <div className="bg-bg pb-24 pt-28 md:pt-36">
      <div className="container-x">
        <div ref={top} tabIndex={-1} className="outline-none">
          <p className="eyebrow text-accent">Book your stay {pkg && `· ${pkg.name} package`}</p>
          <h1 className="mt-3 text-5xl md:text-7xl">{done ? 'Your stay, reserved.' : 'Plan your escape.'}</h1>
        </div>

        {!done && (
          <ol className="mt-10 flex gap-1 overflow-x-auto" aria-label="Booking progress">
            {steps.map((s, i) => (
              <li key={s} className="min-w-[4.5rem] flex-1">
                <button
                  disabled={i > step}
                  onClick={() => go(i)}
                  aria-current={i === step ? 'step' : undefined}
                  className="group w-full text-left disabled:cursor-default"
                >
                  <span className="block h-1 overflow-hidden rounded-full bg-line">
                    <motion.span className="block h-full bg-gold" initial={false} animate={{ width: i <= step ? '100%' : '0%' }} transition={{ duration: 0.6 }} />
                  </span>
                  <span className={`mt-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] ${i === step ? 'text-ink' : 'text-muted'}`}>
                    {i < step ? <Check className="size-3.5 text-palm" aria-hidden /> : <span className="tabular-nums">{i + 1}</span>}
                    {s}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        )}

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="min-w-0 lg:col-span-8">
            {done ? (
              <div className="rounded-[2rem] border border-line bg-card px-6 py-12 md:px-12">
                <Confirmation r={done} />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4 }}>
                  {step === 0 && (
                    <section aria-labelledby="s0">
                      <h2 id="s0" className="text-3xl md:text-4xl">When would you like to arrive?</h2>
                      {pkg && <p className="mt-2 text-sm text-muted">The {pkg.name} package is a {pkg.nights}-night stay; check-out adjusts automatically.</p>}
                      <div className="mt-8">
                        <StaySearch variant="inline" onSearched={() => go(1)} />
                      </div>
                    </section>
                  )}

                  {step === 1 && (
                    <section aria-labelledby="s1">
                      <h2 id="s1" className="text-3xl md:text-4xl">Choose your room</h2>
                      <p className="mt-2 text-sm text-muted">
                        {formatRange(query.checkIn, query.checkOut)} · {nights} night{nights > 1 ? 's' : ''} · {query.adults} adult{query.adults > 1 ? 's' : ''}
                        {query.children ? `, ${query.children} children` : ''} · {query.rooms} room{query.rooms > 1 ? 's' : ''}{' '}
                        <button className="link-underline font-semibold text-ink" onClick={() => go(0)}>
                          Change
                        </button>
                      </p>
                      {!canChooseRoom && <p className="field-error mt-4">Please check your dates first.</p>}
                      <div className="mt-8 grid gap-4" role="radiogroup" aria-label="Rooms">
                        {(pkg ? rooms.filter((r) => r.id === pkg.roomId) : rooms).map((r) => {
                          const av = checkRoom(r, query)
                          const ok = av.fits && av.status !== 'sold-out'
                          const total = av.nights.reduce((s, n) => s + n.price, 0) * query.rooms
                          const selected = r.id === roomId
                          return (
                            <button
                              key={r.id}
                              role="radio"
                              aria-checked={selected}
                              disabled={!ok}
                              onClick={() => setRoomId(r.id)}
                              className={`grid gap-4 overflow-hidden rounded-2xl border p-3 text-left transition sm:grid-cols-[180px_1fr_auto] sm:items-center ${
                                selected ? 'border-ink bg-card shadow-lg' : 'border-line hover:border-muted'
                              } disabled:cursor-not-allowed disabled:opacity-55`}
                            >
                              <div className="aspect-[4/3] overflow-hidden rounded-xl sm:aspect-square">
                                <Img name={r.images[0]} alt="" sizes="180px" width={400} className="img-cover" />
                              </div>
                              <div className="px-2">
                                <StatusBadge status={av.status} />
                                <p className="mt-2 font-serif text-3xl">{r.name}</p>
                                <RoomFacts room={r} className="mt-3" />
                                {!av.fits && <p className="mt-2 text-xs text-muted">Too small for your party — add a room or choose a larger villa.</p>}
                              </div>
                              <div className="px-2 pb-2 sm:text-right">
                                {ok && <p className="font-serif text-3xl">{pkg ? money(pkg.price) : money(total)}</p>}
                                <p className="text-xs text-muted">{pkg ? 'package total' : ok ? `for ${nights} night${nights > 1 ? 's' : ''}` : 'Unavailable'}</p>
                                <span className={`ml-auto mt-3 grid size-7 place-items-center rounded-full border ${selected ? 'border-ink bg-ink text-bg' : 'border-line'}`} aria-hidden>
                                  {selected && <Check className="size-4" />}
                                </span>
                              </div>
                            </button>
                          )
                        })}
                      </div>
                      <Nav onBack={() => go(0)} onNext={() => go(2)} nextDisabled={!roomOk || !canChooseRoom} nextLabel="Continue to extras" />
                    </section>
                  )}

                  {step === 2 && (
                    <section aria-labelledby="s2">
                      <h2 id="s2" className="text-3xl md:text-4xl">Make it yours</h2>
                      <p className="mt-2 text-sm text-muted">Optional extras. Experiences like island trips and horse riding can be added after booking from the Experiences page.</p>
                      <div className="mt-8 grid gap-3">
                        {roomExtras.map((x) => (
                          <label key={x.id} className="flex items-center justify-between gap-4 rounded-2xl border border-line p-5 transition hover:border-muted has-[:checked]:border-ink has-[:checked]:bg-card">
                            <span className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                className="size-4 accent-[var(--color-teal)]"
                                checked={extras.includes(x.id)}
                                onChange={(e) => setExtras((s) => (e.target.checked ? [...s, x.id] : s.filter((y) => y !== x.id)))}
                              />
                              {x.name}
                            </span>
                            <span className="text-sm">+{money(x.price)}</span>
                          </label>
                        ))}
                      </div>
                      <Nav onBack={() => go(1)} onNext={() => go(3)} nextLabel="Continue to details" />
                    </section>
                  )}

                  {step === 3 && (
                    <form onSubmit={submitDetails} noValidate aria-labelledby="s3">
                      <h2 id="s3" className="mb-8 text-3xl md:text-4xl">Who’s travelling?</h2>
                      <GuestFields value={guest} onChange={setGuest} errors={errors} />
                      <div className="mt-6 max-w-xs">
                        <label htmlFor="arrival" className="field-label">
                          Estimated arrival
                        </label>
                        <select id="arrival" className="field" value={arrival} onChange={(e) => setArrival(e.target.value)}>
                          {['Before 12:00', '12:00 – 15:00', '15:00 – 17:00', '17:00 – 20:00', 'After 20:00'].map((x) => (
                            <option key={x}>{x}</option>
                          ))}
                        </select>
                      </div>
                      <Nav onBack={() => go(2)} submit nextLabel="Review booking" />
                    </form>
                  )}

                  {step === 4 && room && totals && (
                    <section aria-labelledby="s4">
                      <h2 id="s4" className="text-3xl md:text-4xl">Review & confirm</h2>
                      <dl className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
                        {[
                          ['Room', pkg ? `${room.name} (${pkg.name})` : room.name],
                          ['Dates', `${formatDate(query.checkIn)} → ${formatDate(query.checkOut)}`],
                          ['Guests', `${query.adults} adult${query.adults > 1 ? 's' : ''}${query.children ? `, ${query.children} children` : ''} · ${query.rooms} room${query.rooms > 1 ? 's' : ''}`],
                          ['Lead guest', `${guest.firstName} ${guest.lastName} · ${guest.email}`],
                          ['Arrival', arrival],
                          ['Extras', extras.length ? roomExtras.filter((x) => extras.includes(x.id)).map((x) => x.name).join(', ') : 'None'],
                        ].map(([k, v]) => (
                          <div key={k} className="bg-card p-5">
                            <dt className="text-[0.65rem] uppercase tracking-[0.18em] text-muted">{k}</dt>
                            <dd className="mt-1">{v}</dd>
                          </div>
                        ))}
                      </dl>
                      {a?.status === 'request' && (
                        <p className="mt-6 flex gap-3 rounded-xl bg-bg-alt p-4 text-sm">
                          <Info className="size-5 shrink-0 text-accent" aria-hidden />
                          The Royal Beach Residence is confirmed by our reservations team, so this will be saved as a request awaiting review.
                        </p>
                      )}
                      <label className="mt-6 flex items-start gap-3 text-sm">
                        <input type="checkbox" checked={agree} onChange={(e) => { setAgree(e.target.checked); setAgreeErr(false) }} className="mt-1 size-4 accent-[var(--color-teal)]" aria-invalid={agreeErr} aria-describedby={agreeErr ? 'agree-err' : undefined} />
                        <span>I understand this is a demonstration: no real reservation is made and no payment is taken. I’ve read the example cancellation policy.</span>
                      </label>
                      {agreeErr && <p id="agree-err" role="alert" className="field-error">Please tick the box to continue.</p>}
                      <div className="mt-10 flex flex-wrap justify-between gap-3">
                        <button className="btn btn-ghost" onClick={() => go(3)}>
                          <ArrowLeft className="size-4" aria-hidden /> Back
                        </button>
                        <button className="btn btn-gold" onClick={confirm}>
                          {a?.status === 'request' ? 'Send reservation request' : 'Confirm demo reservation'}
                        </button>
                      </div>
                    </section>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>

          <aside className="min-w-0 lg:col-span-4" aria-label="Booking summary">
            <div className="space-y-4 lg:sticky lg:top-28">
              {room ? (
                <div className="overflow-hidden rounded-2xl border border-line bg-card">
                  <div className="aspect-[16/9]">
                    <Img name={room.images[0]} alt="" sizes="400px" width={700} className="img-cover" />
                  </div>
                  <div className="p-5">
                    <p className="font-serif text-2xl">{room.name}</p>
                    <p className="mt-1 text-sm text-muted">{formatRange(query.checkIn, query.checkOut)} · {nights} nights</p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-line p-6 text-sm text-muted">Select dates and a room to see your summary.</div>
              )}
              {totals && step >= 1 && (a?.fits && a.status !== 'sold-out' ? <PriceSummary totals={totals} note={pkg ? 'Package price includes sample taxes & service; extras attract sample fees.' : undefined} /> : null)}
              <DemoNotice>
                SHINE is fictional. Rates and availability come from a demo dataset. <Link to="/stay" className="underline">Compare rooms</Link>
              </DemoNotice>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

function Nav({ onBack, onNext, nextDisabled, nextLabel, submit }: { onBack: () => void; onNext?: () => void; nextDisabled?: boolean; nextLabel: string; submit?: boolean }) {
  return (
    <div className="mt-10 flex flex-wrap justify-between gap-3">
      <button type="button" className="btn btn-ghost" onClick={onBack}>
        <ArrowLeft className="size-4" aria-hidden /> Back
      </button>
      <button type={submit ? 'submit' : 'button'} className="btn btn-dark" onClick={onNext} disabled={nextDisabled}>
        {nextLabel} <ArrowRight className="size-4" aria-hidden />
      </button>
    </div>
  )
}

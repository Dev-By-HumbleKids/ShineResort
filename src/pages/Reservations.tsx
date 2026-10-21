import { motion } from 'framer-motion'
import { Check, Search, Trash2 } from 'lucide-react'
import { useEffect, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { DemoNotice, Field, PriceSummary } from '../components/ui/bits'
import { formatDate, today } from '../lib/dates'
import { cancelReservation, findReservation, lifecycle, listReservations, type Reservation } from '../lib/reservations'

const kindLabel: Record<Reservation['kind'], string> = { stay: 'Stay', experience: 'Experience', dining: 'Dining', spa: 'Spa' }

export default function Reservations() {
  const [params] = useSearchParams()
  const [ref, setRef] = useState(params.get('ref') ?? '')
  const [last, setLast] = useState('')
  const [found, setFound] = useState<Reservation | null>(null)
  const [error, setError] = useState('')
  const [list, setList] = useState(listReservations)

  useEffect(() => {
    const sync = () => setList(listReservations())
    window.addEventListener('shine:reservations', sync)
    return () => window.removeEventListener('shine:reservations', sync)
  }, [])

  const lookup = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!ref.trim() || !last.trim()) {
      setError('Enter both your booking reference and last name.')
      setFound(null)
      return
    }
    const r = findReservation(ref, last)
    if (!r) {
      setFound(null)
      setError('We couldn’t find a reservation with those details on this device. Check the reference and last name.')
      return
    }
    setFound(r)
  }

  return (
    <div className="pb-24 pt-28 md:pt-36">
      <div className="container-x">
        <p className="eyebrow text-accent">My reservations</p>
        <h1 className="mt-3 text-5xl md:text-7xl">Check your booking status.</h1>
        <p className="mt-4 max-w-xl text-muted">Enter the reference from your confirmation and the lead guest’s last name. Demo reservations live only in this browser.</p>

        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <form onSubmit={lookup} noValidate className="grid gap-4 rounded-[2rem] border border-line bg-card p-6 sm:grid-cols-[1fr_1fr_auto] sm:items-end md:p-8" aria-label="Find a reservation">
              <Field id="ref" label="Booking reference">
                <input id="ref" className="field font-mono uppercase" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="SHN-XXXXXX" autoComplete="off" />
              </Field>
              <Field id="last" label="Last name">
                <input id="last" className="field" value={last} onChange={(e) => setLast(e.target.value)} autoComplete="family-name" />
              </Field>
              <button className="btn btn-dark">
                <Search className="size-4" aria-hidden /> Find
              </button>
              {error && (
                <p role="alert" className="field-error sm:col-span-3">
                  {error}
                </p>
              )}
            </form>

            {found && <Detail r={found} onCancelled={() => setFound(null)} />}
          </div>

          <aside className="lg:col-span-5" aria-labelledby="device-h">
            <h2 id="device-h" className="text-3xl">
              Made on this device
            </h2>
            <p className="mt-2 text-sm text-muted">Guest names and contact details are hidden here. Look a booking up to see its details.</p>
            {list.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-line p-8 text-center">
                <p className="font-serif text-2xl">No reservations yet.</p>
                <div className="mt-6 flex flex-wrap justify-center gap-2">
                  <Link to="/book" className="btn btn-dark">Book a stay</Link>
                  <Link to="/experiences" className="btn btn-ghost">Experiences</Link>
                </div>
              </div>
            ) : (
              <ul className="mt-6 divide-y divide-line rounded-2xl border border-line">
                {list.map((r) => (
                  <li key={r.ref}>
                    <button onClick={() => setRef(r.ref)} className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-bg-alt" aria-label={`Use reference ${r.ref}`}>
                      <span>
                        <span className="block font-mono text-sm">{r.ref}</span>
                        <span className="text-sm text-muted">
                          {kindLabel[r.kind]} · {r.title}
                        </span>
                      </span>
                      <span className="shrink-0 text-right text-xs">
                        {formatDate(r.date, { day: 'numeric', month: 'short' })}
                        <span className={`mt-1 block rounded-full px-2 py-0.5 ${r.status === 'pending' ? 'bg-lagoon/15 text-lagoon' : 'bg-palm/15 text-palm'}`}>
                          {r.status === 'pending' ? 'Request' : 'Confirmed'}
                        </span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

function Detail({ r, onCancelled }: { r: Reservation; onCancelled: () => void }) {
  const { steps, current } = lifecycle(r, today())
  const [confirming, setConfirming] = useState(false)
  return (
    <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-8 rounded-[2rem] border border-line bg-card p-6 md:p-8" aria-labelledby="detail-h" aria-live="polite">
      <p className="font-mono text-sm text-muted">{r.ref}</p>
      <h2 id="detail-h" className="mt-1 text-4xl">
        {r.title}
      </h2>
      <p className="mt-2 text-muted">{r.summary}</p>

      <ol className="mt-8 grid gap-4 sm:grid-cols-5" aria-label="Reservation status">
        {steps.map((s, i) => {
          const state = i < current ? 'done' : i === current ? 'current' : 'todo'
          return (
            <li key={s.id} className="flex gap-3 sm:flex-col" aria-current={state === 'current' ? 'step' : undefined}>
              <span
                className={`grid size-8 shrink-0 place-items-center rounded-full border text-xs font-bold ${
                  state === 'done' ? 'border-palm bg-palm text-pearl' : state === 'current' ? 'border-gold bg-gold text-midnight' : 'border-line text-muted'
                }`}
              >
                {state === 'done' ? <Check className="size-4" aria-hidden /> : i + 1}
              </span>
              <span className={`text-sm ${state === 'todo' ? 'text-muted' : ''}`}>
                {s.label}
                <span className="sr-only"> — {state === 'done' ? 'complete' : state === 'current' ? 'current step' : 'upcoming'}</span>
              </span>
            </li>
          )
        })}
      </ol>

      <dl className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-muted">Lead guest</dt>
          <dd>{r.guest.firstName} {r.guest.lastName}</dd>
        </div>
        <div>
          <dt className="text-muted">Created</dt>
          <dd>{new Date(r.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</dd>
        </div>
        {r.guest.requests && (
          <div className="sm:col-span-2">
            <dt className="text-muted">Requests</dt>
            <dd>{r.guest.requests}</dd>
          </div>
        )}
      </dl>

      {r.totals && (
        <div className="mt-8">
          <PriceSummary totals={r.totals} />
        </div>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {confirming ? (
          <>
            <span className="text-sm">Remove this demo reservation from this browser?</span>
            <button
              className="btn btn-dark"
              onClick={() => {
                cancelReservation(r.ref)
                onCancelled()
              }}
            >
              Yes, cancel
            </button>
            <button className="btn btn-ghost" onClick={() => setConfirming(false)}>
              Keep it
            </button>
          </>
        ) : (
          <button className="btn btn-ghost" onClick={() => setConfirming(true)}>
            <Trash2 className="size-4" aria-hidden /> Cancel reservation
          </button>
        )}
      </div>
      <div className="mt-6">
        <DemoNotice>Statuses are simulated from your dates for demonstration. No hotel system is contacted.</DemoNotice>
      </div>
    </motion.section>
  )
}

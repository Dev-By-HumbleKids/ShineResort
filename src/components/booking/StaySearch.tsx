import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStay } from '../../context/StayContext'
import type { StayQuery } from '../../lib/availability'
import { addDays, nightsBetween, today } from '../../lib/dates'
import { Stepper } from '../ui/bits'

export const LIMITS = { adults: 12, children: 8, rooms: 5, maxNights: 30, horizonDays: 540 }

export function validateStay(q: StayQuery) {
  const errors: Partial<Record<'checkIn' | 'checkOut' | 'guests', string>> = {}
  const t = today()
  if (!q.checkIn) errors.checkIn = 'Choose a check-in date.'
  else if (q.checkIn < t) errors.checkIn = 'Check-in cannot be in the past.'
  else if (q.checkIn > addDays(t, LIMITS.horizonDays)) errors.checkIn = 'Bookings open up to 18 months ahead.'
  if (!q.checkOut) errors.checkOut = 'Choose a check-out date.'
  else if (q.checkIn && q.checkOut <= q.checkIn) errors.checkOut = 'Check-out must be after check-in.'
  else if (q.checkIn && nightsBetween(q.checkIn, q.checkOut) > LIMITS.maxNights) errors.checkOut = `Online stays are limited to ${LIMITS.maxNights} nights.`
  if (q.rooms > q.adults) errors.guests = 'Each room needs at least one adult.'
  return errors
}

type Props = { variant?: 'hero' | 'inline'; onSearched?: (q: StayQuery) => void }

/** Premium stay search used in the hero, on /stay and on /book. */
export function StaySearch({ variant = 'hero', onSearched }: Props) {
  const { query, setQuery } = useStay()
  const [q, setQ] = useState<StayQuery>(query)
  const [errors, setErrors] = useState<ReturnType<typeof validateStay>>({})
  const [guestsOpen, setGuestsOpen] = useState(false)
  const navigate = useNavigate()
  const id = useId()
  const popRef = useRef<HTMLDivElement>(null)

  useEffect(() => setQ(query), [query])

  useEffect(() => {
    if (!guestsOpen) return
    const close = (e: MouseEvent) => {
      if (!popRef.current?.contains(e.target as Node)) setGuestsOpen(false)
    }
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setGuestsOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [guestsOpen])

  const update = (patch: Partial<StayQuery>) => {
    setQ((prev) => {
      const next = { ...prev, ...patch }
      // keep check-out after check-in automatically
      if (patch.checkIn && next.checkOut <= next.checkIn) next.checkOut = addDays(next.checkIn, Math.max(1, nightsBetween(prev.checkIn, prev.checkOut)))
      if (next.rooms > next.adults) next.rooms = next.adults
      return next
    })
    setErrors({})
  }

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs = validateStay(q)
    setErrors(errs)
    if (Object.keys(errs).length) return
    setQuery(q)
    if (onSearched) onSearched(q)
    else navigate('/stay#results')
  }

  const nights = q.checkIn && q.checkOut > q.checkIn ? nightsBetween(q.checkIn, q.checkOut) : 0
  const guestsLabel = `${q.adults} adult${q.adults > 1 ? 's' : ''}${q.children ? `, ${q.children} child${q.children > 1 ? 'ren' : ''}` : ''} · ${q.rooms} room${q.rooms > 1 ? 's' : ''}`
  const hero = variant === "hero"
  const cell = hero ? "md:border-l md:border-t-0" : ""

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-label="Search stay availability"
      className={`relative grid gap-px overflow-visible rounded-2xl border text-ink ${hero ? "shadow-[0_30px_80px_-30px_rgb(16_44_53/0.45)] md:grid-cols-[1fr_1fr_1.3fr_auto]" : ""} ${
        hero ? 'border-pearl/20 bg-bg/92 backdrop-blur-xl' : 'border-line bg-card'
      }`}
    >
      <div className="px-5 pb-3 pt-4">
        <label htmlFor={`${id}-in`} className="field-label">
          Check-in
        </label>
        <input
          id={`${id}-in`}
          type="date"
          min={today()}
          value={q.checkIn}
          onChange={(e) => update({ checkIn: e.target.value })}
          aria-invalid={!!errors.checkIn}
          aria-describedby={errors.checkIn ? `${id}-in-err` : undefined}
          className="w-full bg-transparent font-serif text-xl outline-none"
          required
        />
        {errors.checkIn && <p id={`${id}-in-err`} role="alert" className="field-error">{errors.checkIn}</p>}
      </div>
      <div className={`border-t border-line px-5 pb-3 pt-4 ${cell}`}>
        <label htmlFor={`${id}-out`} className="field-label">
          Check-out {nights > 0 && <span className="normal-case tracking-normal text-accent">· {nights} night{nights > 1 ? 's' : ''}</span>}
        </label>
        <input
          id={`${id}-out`}
          type="date"
          min={q.checkIn ? addDays(q.checkIn, 1) : today()}
          value={q.checkOut}
          onChange={(e) => update({ checkOut: e.target.value })}
          aria-invalid={!!errors.checkOut}
          aria-describedby={errors.checkOut ? `${id}-out-err` : undefined}
          className="w-full bg-transparent font-serif text-xl outline-none"
          required
        />
        {errors.checkOut && <p id={`${id}-out-err`} role="alert" className="field-error">{errors.checkOut}</p>}
      </div>
      <div ref={popRef} className={`relative border-t border-line px-5 pb-3 pt-4 ${cell}`}>
        <span id={`${id}-g`} className="field-label">
          Guests & rooms
        </span>
        <button
          type="button"
          onClick={() => setGuestsOpen((o) => !o)}
          aria-expanded={guestsOpen}
          aria-controls={`${id}-pop`}
          aria-labelledby={`${id}-g ${id}-gv`}
          className="flex w-full items-center justify-between gap-2 text-left font-serif text-xl"
        >
          <span id={`${id}-gv`}>{guestsLabel}</span>
          <ChevronDown className={`size-4 shrink-0 transition ${guestsOpen ? 'rotate-180' : ''}`} />
        </button>
        {errors.guests && <p role="alert" className="field-error">{errors.guests}</p>}
        <AnimatePresence>
          {guestsOpen && (
            <motion.div
              id={`${id}-pop`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="absolute left-0 right-0 top-full z-30 mt-2 rounded-xl border border-line bg-card p-4 shadow-2xl md:left-auto md:w-80"
            >
              <Stepper label="Adults" hint="Ages 12+" value={q.adults} min={1} max={LIMITS.adults} onChange={(n) => update({ adults: n })} />
              <Stepper label="Children" hint="Ages 0–11" value={q.children} min={0} max={LIMITS.children} onChange={(n) => update({ children: n })} />
              <Stepper label="Rooms" hint="Max 5 online" value={q.rooms} min={1} max={Math.min(LIMITS.rooms, q.adults)} onChange={(n) => update({ rooms: n })} />
              <button type="button" onClick={() => setGuestsOpen(false)} className="btn btn-dark mt-3 w-full">
                Done
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="p-2">
        <button type="submit" className="btn btn-dark h-full w-full min-h-14 md:rounded-xl md:px-8">
          <Search className="size-4" aria-hidden />
          Search
        </button>
      </div>
    </form>
  )
}

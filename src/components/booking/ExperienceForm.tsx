import { CloudSun, ShieldAlert } from 'lucide-react'
import { useId, useMemo, useState, type FormEvent } from 'react'
import type { Experience } from '../../data/types'
import { addDays, formatDate, today } from '../../lib/dates'
import { experienceLines, money, withFees } from '../../lib/pricing'
import { saveReservation, type Guest, type Reservation } from '../../lib/reservations'
import { DemoNotice, Field, PriceSummary, Stepper } from '../ui/bits'
import { DateField } from '../ui/DateField'
import { Confirmation } from './Confirmation'
import { emptyGuest, GuestFields, validateGuest, type GuestErrors } from './GuestFields'

/** Configure & reserve an experience with live, itemised pricing. */
export function ExperienceForm({ exp, onDone }: { exp: Experience; onDone: () => void }) {
  const id = useId()
  const [pkgId, setPkgId] = useState(exp.packages[0].id)
  const [date, setDate] = useState(addDays(today(), 3))
  const [time, setTime] = useState(exp.times[0])
  const [guests, setGuests] = useState(Math.max(exp.minGuests, Math.min(2, exp.maxGuests)))
  const [addOns, setAddOns] = useState<string[]>([])
  const [guest, setGuest] = useState<Guest>(emptyGuest)
  const [errors, setErrors] = useState<GuestErrors & { date?: string; ack?: string }>({})
  const [ack, setAck] = useState(false)
  const [done, setDone] = useState<Reservation | null>(null)

  const pkg = exp.packages.find((p) => p.id === pkgId)!
  const chosen = exp.addOns.filter((a) => addOns.includes(a.id))
  const totals = useMemo(() => withFees(experienceLines(pkg, guests, chosen)), [pkg, guests, chosen])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = { ...validateGuest(guest) }
    if (!date || date <= today()) errs.date = 'Choose a date from tomorrow onwards.'
    else if (date > addDays(today(), 365)) errs.date = 'Experiences can be reserved up to 12 months ahead.'
    if (!ack) errs.ack = 'Please acknowledge the weather & safety note.'
    setErrors(errs)
    if (Object.keys(errs).length) {
      setTimeout(() => document.querySelector<HTMLElement>('[aria-invalid="true"], [data-ack-error]')?.focus(), 40)
      return
    }
    const r = saveReservation({
      kind: 'experience',
      title: exp.title,
      summary: `${formatDate(date)} · ${time} · ${guests} guest${guests > 1 ? 's' : ''} · ${pkg.name}`,
      date,
      status: exp.confirmation === 'instant' ? 'confirmed' : 'pending',
      totals,
      guest,
      meta: { experience: exp.id, package: pkg.id, time, guests },
    })
    setDone(r)
  }

  if (done) return <Confirmation r={done} onDone={onDone} />

  return (
    <form onSubmit={submit} noValidate className="space-y-8" aria-label={`Reserve ${exp.title}`}>
      <fieldset>
        <legend className="mb-3 font-serif text-2xl">Choose a package</legend>
        <div className="grid gap-2">
          {exp.packages.map((p, i) => (
            <label
              key={p.id}
              className={`flex items-center justify-between gap-4 rounded-xl border p-4 transition ${p.id === pkgId ? 'border-ink bg-card' : 'border-line hover:border-muted'}`}
            >
              <span className="flex items-center gap-3">
                <input type="radio" name={`${id}-pkg`} value={p.id} checked={p.id === pkgId} onChange={() => setPkgId(p.id)} className="accent-[var(--color-teal)]" data-autofocus={i === 0 ? true : undefined} />
                <span>
                  <span className="block text-sm font-medium">{p.name}</span>
                  {p.note && <span className="text-xs text-muted">{p.note}</span>}
                </span>
              </span>
              <span className="whitespace-nowrap text-sm font-semibold">
                {money(p.price)} <span className="font-normal text-muted">/ {p.per}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={`${id}-date`} label="Preferred date" error={errors.date}>
          <DateField
            id={`${id}-date`}
            min={addDays(today(), 1)}
            max={addDays(today(), 365)}
            value={date}
            onChange={setDate}
            invalid={!!errors.date}
            describedBy={errors.date ? `${id}-date-error` : undefined}
          />
        </Field>
        <Field id={`${id}-time`} label="Preferred time">
          <select id={`${id}-time`} className="field" value={time} onChange={(e) => setTime(e.target.value)}>
            {exp.times.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>

      <div className="rounded-xl border border-line px-4">
        <Stepper
          label="Participants"
          hint={`${exp.minGuests}–${exp.maxGuests} guests${exp.minAge ? ` · ages ${exp.minAge}+` : ''}`}
          value={guests}
          min={exp.minGuests}
          max={exp.maxGuests}
          onChange={setGuests}
        />
      </div>

      {exp.addOns.length > 0 && (
        <fieldset>
          <legend className="mb-3 font-serif text-2xl">Optional add-ons</legend>
          <div className="grid gap-2">
            {exp.addOns.map((a) => (
              <label key={a.id} className="flex items-center justify-between gap-4 rounded-xl border border-line p-4 transition hover:border-muted has-[:checked]:border-ink has-[:checked]:bg-card">
                <span className="flex items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={addOns.includes(a.id)}
                    onChange={(e) => setAddOns((s) => (e.target.checked ? [...s, a.id] : s.filter((x) => x !== a.id)))}
                    className="size-4 accent-[var(--color-teal)]"
                  />
                  {a.name}
                </span>
                <span className="whitespace-nowrap text-sm">
                  +{money(a.price)}
                  <span className="text-muted"> / {a.per === 'person' ? 'guest' : 'booking'}</span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <GuestFields value={guest} onChange={setGuest} errors={errors} />

      <div className="space-y-3">
        <div className="flex gap-3 rounded-xl bg-bg-alt p-4 text-sm">
          <CloudSun className="size-5 shrink-0 text-accent" aria-hidden />
          <p>{exp.conditionNote}</p>
        </div>
        <label className="flex items-start gap-3 text-sm">
          <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} className="mt-1 size-4 accent-[var(--color-teal)]" aria-invalid={!!errors.ack} data-ack-error={errors.ack ? true : undefined} />
          <span>I understand this experience depends on weather and operating conditions and may be rescheduled for safety.</span>
        </label>
        {errors.ack && (
          <p className="field-error flex items-center gap-1.5" role="alert">
            <ShieldAlert className="size-4" aria-hidden /> {errors.ack}
          </p>
        )}
      </div>

      <PriceSummary totals={totals} />

      <div className="space-y-3">
        <button type="submit" className="btn btn-gold w-full">
          {exp.confirmation === 'instant' ? 'Reserve experience' : 'Send request to concierge'}
        </button>
        <DemoNotice>
          {exp.confirmation === 'instant'
            ? 'Instant demo confirmation — a booking reference is generated locally in your browser.'
            : 'This experience is tailored by our concierge, so it is recorded as a request awaiting review.'}{' '}
          No payment is taken.
        </DemoNotice>
      </div>
    </form>
  )
}

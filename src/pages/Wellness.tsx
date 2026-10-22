import { Dumbbell, Flower2, Heart, Sunrise } from 'lucide-react'
import { useId, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Confirmation } from '../components/booking/Confirmation'
import { emptyGuest, GuestFields, validateGuest, type GuestErrors } from '../components/booking/GuestFields'
import { Treatments } from '../components/wellness/Treatments'
import { PageHero } from '../components/layout/PageHero'
import { DemoNotice, Field, PriceSummary, SectionHeading } from '../components/ui/bits'
import { DateField } from '../components/ui/DateField'
import { Img } from '../components/ui/Img'
import { MaskReveal } from '../components/ui/Reveal'
import { spaTimes, treatments } from '../data/spa'
import { addDays, formatDate, today } from '../lib/dates'
import { money, withFees } from '../lib/pricing'
import { scrollToEl } from '../lib/scroll'
import { saveReservation, type Guest, type Reservation } from '../lib/reservations'

export default function Wellness() {
  const [selected, setSelected] = useState(treatments[0].id)
  const formRef = useRef<HTMLDivElement>(null)
  const choose = (id: string) => {
    setSelected(id)
    scrollToEl(formRef.current)
  }

  return (
    <>
      <PageHero
        eyebrow="Lumina Spa & Wellness"
        title="Slow down to the rhythm of the tide."
        image="spaMassage"
        edge="var(--bg-alt)"
        intro="Six treatment pavilions set in a garden of ginger and frangipani, with rituals that draw on Myanmar’s traditions — thanaka, coconut, lemongrass and warm stone."
      />

      {/* calm, warm editorial palette, distinct from the ocean sections */}
      <section className="bg-bg-alt py-24 text-ink md:py-32">
        <div className="container-x grid items-center gap-14 lg:grid-cols-2">
          <MaskReveal className="aspect-[4/5] rounded-t-full">
            <Img name="spaHotStone" alt="Warm stones placed along the back during a massage" sizes="(min-width:1024px) 45vw, 100vw" className="img-cover" />
          </MaskReveal>
          <div>
            <SectionHeading
              eyebrow="The Lumina philosophy"
              title={<>Rituals rooted in <em>place.</em></>}
              intro="Our therapists trained in Yangon and Chiang Mai, and our products are blended in small batches from coconut, rice, turmeric and thanaka bark. Every journey begins with a foot ritual and ends with ginger tea on the garden terrace."
            />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {[
                { icon: Flower2, t: 'Six garden pavilions' },
                { icon: Heart, t: 'Couples’ suite with bath' },
                { icon: Sunrise, t: 'Sunrise yoga deck' },
                { icon: Dumbbell, t: '24-hour fitness studio' },
              ].map(({ icon: Icon, t }) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-full border border-current/20">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Treatments onBook={choose} />

      <section className="bg-bg-alt py-24 md:py-32">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Fitness & recreation" title={<>Move by the <em className="text-accent">water.</em></>} intro="An ocean-view fitness studio open around the clock, personal training on request, sunrise yoga and breathwork, beach volleyball and bicycles to explore the village." />
            <Link to="/experiences/sunrise-yoga?book=1" className="btn btn-dark mt-8">
              Book sunrise yoga
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:col-span-7">
            <MaskReveal className="aspect-[3/4] rounded-[1.5rem]">
              <Img name="yogaSunrise" alt="Yoga practice on a deck at sunrise" sizes="30vw" className="img-cover" />
            </MaskReveal>
            <div className="grid gap-3">
              <MaskReveal className="aspect-[4/3] rounded-[1.5rem]" delay={0.1}>
                <Img name="gym" alt="Fitness studio with weights" sizes="30vw" className="img-cover" />
              </MaskReveal>
              <MaskReveal className="aspect-[4/3] rounded-[1.5rem]" delay={0.2}>
                <Img name="training" alt="Personal training session" sizes="30vw" className="img-cover" />
              </MaskReveal>
            </div>
          </div>
        </div>
      </section>

      <section ref={formRef} id="book-spa" className="container-x scroll-mt-24 py-24 md:py-32" aria-labelledby="spa-h">
        <div className="mx-auto max-w-3xl">
          <div id="spa-h">
            <SectionHeading align="center" eyebrow="Spa appointment" title={<>Reserve your <em className="text-accent">treatment.</em></>} />
          </div>
          <div className="mt-12 rounded-[2rem] border border-line bg-card p-6 md:p-10">
            <SpaForm selected={selected} onSelect={setSelected} />
          </div>
        </div>
      </section>
    </>
  )
}

function SpaForm({ selected, onSelect }: { selected: string; onSelect: (id: string) => void }) {
  const id = useId()
  const [date, setDate] = useState(addDays(today(), 1))
  const [time, setTime] = useState(spaTimes[2])
  const [therapist, setTherapist] = useState('No preference')
  const [guest, setGuest] = useState<Guest>(emptyGuest)
  const [errors, setErrors] = useState<GuestErrors & { date?: string }>({})
  const [done, setDone] = useState<Reservation | null>(null)
  const t = treatments.find((x) => x.id === selected)!
  const totals = withFees([{ label: t.name, amount: t.price, hint: t.forTwo ? 'For two guests' : t.duration >= 240 ? 'Across three days' : `${t.duration} minutes` }])

  const submit = (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof errors = { ...validateGuest(guest) }
    if (!date || date < today()) errs.date = 'Choose today or a future date.'
    else if (date > addDays(today(), 180)) errs.date = 'Appointments open up to 6 months ahead.'
    setErrors(errs)
    if (Object.keys(errs).length) {
      setTimeout(() => document.querySelector<HTMLElement>('#book-spa [aria-invalid="true"]')?.focus(), 40)
      return
    }
    setDone(
      saveReservation({
        kind: 'spa',
        title: `Lumina Spa · ${t.name}`,
        summary: `${formatDate(date)} · ${time} · ${therapist}`,
        date,
        status: 'confirmed',
        totals,
        guest,
        meta: { treatment: t.id, time, therapist },
      }),
    )
  }

  if (done) return <Confirmation r={done} onDone={() => setDone(null)} />

  return (
    <form onSubmit={submit} noValidate className="space-y-6" aria-label="Spa appointment">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id={`${id}-t`} label="Treatment" className="sm:col-span-2">
          <select id={`${id}-t`} className="field" value={selected} onChange={(e) => onSelect(e.target.value)}>
            {treatments.map((x) => (
              <option key={x.id} value={x.id}>
                {x.name} — {x.duration >= 240 ? '3 days' : `${x.duration} min`} · {money(x.price)}
              </option>
            ))}
          </select>
        </Field>
        <Field id={`${id}-d`} label="Date" error={errors.date}>
          <DateField id={`${id}-d`} min={today()} max={addDays(today(), 180)} value={date} onChange={setDate} invalid={!!errors.date} describedBy={errors.date ? `${id}-d-error` : undefined} />
        </Field>
        <Field id={`${id}-time`} label="Time">
          <select id={`${id}-time`} className="field" value={time} onChange={(e) => setTime(e.target.value)}>
            {spaTimes.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </Field>
        <Field id={`${id}-th`} label="Therapist preference" className="sm:col-span-2">
          <select id={`${id}-th`} className="field" value={therapist} onChange={(e) => setTherapist(e.target.value)}>
            {['No preference', 'Female therapist', 'Male therapist'].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </Field>
      </div>
      <GuestFields value={guest} onChange={setGuest} errors={errors} requestsLabel="Health notes or requests (optional)" />
      <PriceSummary totals={totals} />
      <button type="submit" className="btn btn-gold w-full">
        Reserve appointment
      </button>
      <DemoNotice>Frontend demo — no payment, no real appointment. Your reference is stored only in this browser.</DemoNotice>
    </form>
  )
}

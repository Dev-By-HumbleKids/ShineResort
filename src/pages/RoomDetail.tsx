import { Box, Check, Clock, Info, ShieldCheck } from 'lucide-react'
import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { StaySearch } from '../components/booking/StaySearch'
import { PageHero } from '../components/layout/PageHero'
import { RoomCard, RoomFacts } from '../components/rooms/RoomCard'
import { PriceSummary, StatusBadge } from '../components/ui/bits'
import { Img } from '../components/ui/Img'
import { Lightbox } from '../components/ui/Lightbox'
import { Reveal } from '../components/ui/Reveal'
import { useStay } from '../context/StayContext'
import { getRoom, rooms } from '../data/rooms'
import { checkRoom, monthStrip, statusMeta } from '../lib/availability'
import { addDays, formatDate, fromISO, nightsBetween, today } from '../lib/dates'
import { money, withFees } from '../lib/pricing'
import NotFound from './NotFound'

const VillaScene = lazy(() => import('../three/VillaScene'))

export default function RoomDetail() {
  const { id = '' } = useParams()
  const room = getRoom(id)
  const { query, setQuery } = useStay()
  const navigate = useNavigate()
  const [lb, setLb] = useState<number | null>(null)
  const [show3d, setShow3d] = useState(false)
  const [stripStart, setStripStart] = useState(() => today())

  useEffect(() => {
    if (room) document.title = `${room.name} — SHINE`
  }, [room])

  const a = useMemo(() => (room ? checkRoom(room, query) : null), [room, query])
  const strip = useMemo(() => (room ? monthStrip(room, stripStart, 21) : []), [room, stripStart])

  if (!room || !a) return <NotFound />

  const nights = nightsBetween(query.checkIn, query.checkOut)
  const lines = a.nights.map((n) => ({
    label: formatDate(n.date, { weekday: 'short', day: 'numeric', month: 'short' }),
    amount: n.price * query.rooms,
    hint: query.rooms > 1 ? `${money(n.price)} × ${query.rooms} rooms` : undefined,
  }))
  const totals = withFees(lines)
  const bookable = a.fits && a.status !== 'sold-out'

  const pickDay = (iso: string) => setQuery({ ...query, checkIn: iso, checkOut: addDays(iso, Math.max(1, nights)) })

  return (
    <>
      <PageHero eyebrow={`${room.view} view · ${room.sizeSqm} m²`} title={room.name} image={room.images[0]} intro={room.tagline} />

      {/* gallery */}
      <section className="container-x -mt-1 pt-6" aria-label="Photo gallery">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {room.images.map((im, i) => (
            <button
              key={im}
              onClick={() => setLb(i)}
              data-cursor="View"
              className="group relative aspect-[4/3] overflow-hidden rounded-2xl"
              aria-label={`Open photo ${i + 1} of ${room.images.length}`}
            >
              <Img name={im} alt="" sizes="25vw" width={700} className="img-cover transition duration-1000 group-hover:scale-110" />
            </button>
          ))}
        </div>
      </section>
      <Lightbox
        items={room.images.map((im, i) => ({ image: im, alt: `${room.name} — photo ${i + 1}` }))}
        index={lb}
        onChange={setLb}
        onClose={() => setLb(null)}
      />

      <section className="container-x grid gap-14 py-20 lg:grid-cols-12 lg:py-28">
        {/* content */}
        <div className="min-w-0 lg:col-span-7">
          <Reveal>
            {room.description.map((p, i) => (
              <p key={i} className={i === 0 ? 'font-serif text-3xl leading-snug md:text-4xl' : 'mt-6 leading-relaxed text-muted'}>
                {p}
              </p>
            ))}
          </Reveal>

          <RoomFacts room={room} className="mt-10 border-y border-line py-6 sm:grid-cols-4" />

          <div className="mt-12 grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="text-3xl">Highlights</h2>
              <ul className="mt-5 space-y-3">
                {room.highlights.map((h) => (
                  <li key={h} className="flex gap-3">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-3xl">Included amenities</h2>
              <ul className="mt-5 grid gap-2.5 text-sm">
                {room.amenities.map((x) => (
                  <li key={x} className="flex gap-2.5">
                    <Check className="mt-0.5 size-4 shrink-0 text-palm" aria-hidden />
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 3D */}
          <div className="mt-16">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-accent">Interactive model</p>
                <h2 className="mt-2 text-4xl">Explore in 3D</h2>
              </div>
              {!show3d && (
                <button onClick={() => setShow3d(true)} className="btn btn-dark">
                  <Box className="size-4" aria-hidden /> Load 3D villa
                </button>
              )}
            </div>
            <div className="relative mt-6 h-[480px] overflow-hidden rounded-[2rem] bg-teal md:h-[560px]">
              {show3d ? (
                <Suspense fallback={<div className="skeleton absolute inset-0 opacity-30" />}>
                  <VillaScene room={room} />
                </Suspense>
              ) : (
                <button onClick={() => setShow3d(true)} className="group absolute inset-0 text-pearl" aria-label="Load the interactive 3D villa model">
                  <Img name={room.images[1]} alt="" className="img-cover opacity-45 transition duration-1000 group-hover:scale-105" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="flex flex-col items-center gap-3">
                      <span className="grid size-20 place-items-center rounded-full border border-pearl/50 bg-midnight/40 backdrop-blur transition group-hover:scale-110 group-hover:border-gold">
                        <Box className="size-7" />
                      </span>
                      <span className="eyebrow">Tap to explore the cut-away villa</span>
                      <span className="text-xs text-pearl/70">Loads on demand · ~250 KB</span>
                    </span>
                  </span>
                </button>
              )}
            </div>
            <p className="mt-3 text-xs text-muted">Stylised, illustrative model. Numbered markers link to photography of each space.</p>
          </div>

          {/* policies */}
          <div className="mt-16 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-line p-6">
              <Clock className="size-5 text-accent" aria-hidden />
              <h2 className="mt-3 text-2xl">Arrival & departure</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">Check-in from 15:00 · Check-out until 12:00. Early arrival and late departure on request, subject to availability.</p>
            </div>
            <div className="rounded-2xl border border-line p-6">
              <ShieldCheck className="size-5 text-accent" aria-hidden />
              <h2 className="mt-3 text-2xl">Cancellation (example)</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Free cancellation up to 14 days before arrival. Within 14 days, the first night is charged. Festive-season stays: 30 days. Example
                policy for this demo only.
              </p>
            </div>
          </div>
        </div>

        {/* booking sidebar */}
        <aside className="min-w-0 lg:col-span-5" aria-label="Availability and price">
          <div className="space-y-5 lg:sticky lg:top-28">
            <div className="rounded-[1.75rem] border border-line bg-card p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow text-muted">Your dates</p>
                <StatusBadge status={a.status} />
              </div>
              <p className="mt-3 text-sm text-muted">{statusMeta[a.status].description}</p>
              <div className="mt-5">
                <StaySearch variant="inline" onSearched={() => {}} />
              </div>

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">Next 3 weeks · rooms left</p>
                  <div className="flex gap-1">
                    <button
                      className="chip px-2.5 py-1 text-xs"
                      disabled={stripStart <= today()}
                      onClick={() => setStripStart((s) => (addDays(s, -21) < today() ? today() : addDays(s, -21)))}
                      aria-label="Earlier dates"
                    >
                      ←
                    </button>
                    <button className="chip px-2.5 py-1 text-xs" onClick={() => setStripStart((s) => addDays(s, 21))} aria-label="Later dates">
                      →
                    </button>
                  </div>
                </div>
                <div className="scrollbar-none mt-3 flex gap-1.5 overflow-x-auto pb-1" role="list">
                  {strip.map((d) => {
                    const dt = fromISO(d.date)
                    const inStay = d.date >= query.checkIn && d.date < query.checkOut
                    const tone = d.units === 0 ? 'opacity-40 line-through' : d.units <= 2 ? 'border-gold' : 'border-line'
                    return (
                      <button
                        role="listitem"
                        key={d.date}
                        onClick={() => d.units > 0 && pickDay(d.date)}
                        disabled={d.units === 0}
                        className={`flex w-14 shrink-0 flex-col items-center rounded-xl border px-1 py-2 text-center transition hover:border-ink ${tone} ${inStay ? 'bg-ink text-bg' : ''}`}
                        aria-label={`${formatDate(d.date, { weekday: 'long', day: 'numeric', month: 'long' })}: ${d.units === 0 ? 'sold out' : `${d.units} left, ${money(d.price)}`}`}
                      >
                        <span className="text-[0.6rem] uppercase opacity-70">{dt.toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                        <span className="font-serif text-xl leading-none">{dt.getDate()}</span>
                        <span className="mt-1 text-[0.6rem] tabular-nums">{d.units === 0 ? '—' : `${d.units} left`}</span>
                      </button>
                    )
                  })}
                </div>
                <p className="mt-2 text-[0.7rem] text-muted">Tap a date to start your stay there. Gold border = limited.</p>
              </div>
            </div>

            {a.fits && a.status !== 'sold-out' ? (
              <PriceSummary totals={totals} />
            ) : (
              <div className="flex gap-3 rounded-2xl border border-line bg-card p-5 text-sm text-muted">
                <Info className="size-5 shrink-0 text-accent" aria-hidden />
                {!a.fits
                  ? `This room sleeps up to ${room.maxGuests} guests (${room.maxAdults} adults). Increase the number of rooms or choose a larger villa.`
                  : 'This room is sold out for at least one night of your stay. Pick another date from the strip above.'}
              </div>
            )}
            <button className="btn btn-gold w-full" disabled={!bookable} onClick={() => navigate(`/book?room=${room.id}`)}>
              {a.status === 'request' ? 'Request this residence' : 'Book this room'}
            </button>
          </div>
        </aside>
      </section>

      <section className="bg-bg-alt py-24" aria-labelledby="more-h">
        <div className="container-x">
          <h2 id="more-h" className="text-4xl md:text-5xl">
            Other ways to stay
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {rooms
              .filter((r) => r.id !== room.id)
              .map((r) => (
                <RoomCard key={r.id} room={r} />
              ))}
          </div>
          <Link to="/stay" className="btn btn-ghost mt-10">
            Compare all rooms
          </Link>
        </div>
      </section>
    </>
  )
}

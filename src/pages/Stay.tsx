import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Check, SlidersHorizontal, X } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { StaySearch } from '../components/booking/StaySearch'
import { PageHero } from '../components/layout/PageHero'
import { RoomFacts } from '../components/rooms/RoomCard'
import { SectionHeading, StatusBadge } from '../components/ui/bits'
import { Img } from '../components/ui/Img'
import { Reveal } from '../components/ui/Reveal'
import { TiltCard } from '../components/ui/TiltCard'
import { useStay } from '../context/StayContext'
import { packages } from '../data/packages'
import { rooms } from '../data/rooms'
import type { Room } from '../data/types'
import { checkRoom, statusMeta, type RoomAvailability } from '../lib/availability'
import { formatRange, nightsBetween } from '../lib/dates'
import { money } from '../lib/pricing'
import { scrollToEl } from '../lib/scroll'

type Sort = 'recommended' | 'price-asc' | 'price-desc' | 'size' | 'guests'
const views = ['All views', 'Ocean', 'Garden', 'Ocean & Pool', 'Beachfront', 'Sunrise Ocean'] as const

export default function Stay() {
  const { query, hasSearched } = useStay()
  const [loading, setLoading] = useState(false)
  const [sort, setSort] = useState<Sort>('recommended')
  const [view, setView] = useState<(typeof views)[number]>('All views')
  const [onlyBookable, setOnlyBookable] = useState(false)
  const [poolOnly, setPoolOnly] = useState(false)

  // brief, honest "checking" state whenever the search changes
  useEffect(() => {
    setLoading(true)
    const t = setTimeout(() => setLoading(false), 650)
    return () => clearTimeout(t)
  }, [query])

  const nights = nightsBetween(query.checkIn, query.checkOut)
  const results = useMemo(() => {
    const list = rooms.map((room) => ({ room, a: checkRoom(room, query) }))
    const filtered = list.filter(
      ({ room, a }) =>
        (view === 'All views' || room.view === view) &&
        (!poolOnly || room.model.pool) &&
        (!onlyBookable || (a.fits && a.status !== 'sold-out')),
    )
    const total = (a: RoomAvailability) => a.nights.reduce((s, n) => s + n.price, 0)
    const sorters: Record<Sort, (x: (typeof list)[0], y: (typeof list)[0]) => number> = {
      recommended: (x, y) => Number(y.a.fits && y.a.status !== 'sold-out') - Number(x.a.fits && x.a.status !== 'sold-out'),
      'price-asc': (x, y) => total(x.a) - total(y.a),
      'price-desc': (x, y) => total(y.a) - total(x.a),
      size: (x, y) => y.room.sizeSqm - x.room.sizeSqm,
      guests: (x, y) => y.room.maxGuests - x.room.maxGuests,
    }
    return filtered.sort(sorters[sort])
  }, [query, view, poolOnly, onlyBookable, sort])

  const activeFilters = Number(view !== 'All views') + Number(poolOnly) + Number(onlyBookable)
  const reset = () => {
    setView('All views')
    setPoolOnly(false)
    setOnlyBookable(false)
  }

  return (
    <>
      <PageHero
        eyebrow="Villas & Suites"
        title="Rooms that open to the sea."
        image="modernPoolVilla"
        intro="Five distinct ways to stay — from garden villas hidden in frangipani to a pavilion raised over the lagoon. Every one designed around light, air and the sound of the surf."
      />

      <div className="container-x relative z-20 -mt-10">
        <StaySearch variant="hero" onSearched={() => setTimeout(() => scrollToEl(document.getElementById('results')), 50)} />
      </div>

      <section id="results" className="container-x scroll-mt-24 py-20 md:py-28" aria-labelledby="results-h">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-line pb-8">
          <div>
            <p className="eyebrow text-accent">{hasSearched ? 'Your search' : 'Suggested dates'}</p>
            <h2 id="results-h" className="mt-3 text-4xl md:text-5xl">
              {formatRange(query.checkIn, query.checkOut)}
            </h2>
            <p className="mt-2 text-sm text-muted">
              {nights} night{nights > 1 ? 's' : ''} · {query.adults} adult{query.adults > 1 ? 's' : ''}
              {query.children ? ` · ${query.children} child${query.children > 1 ? 'ren' : ''}` : ''} · {query.rooms} room{query.rooms > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="sr-only" htmlFor="sort">
              Sort rooms
            </label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} className="field w-auto min-h-11 rounded-full py-2 text-sm">
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="size">Largest first</option>
              <option value="guests">Most guests</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2" role="group" aria-label="Filter rooms">
          <SlidersHorizontal className="mr-1 size-4 text-muted" aria-hidden />
          {views.map((v) => (
            <button key={v} className="chip" aria-pressed={view === v} onClick={() => setView(v)}>
              {v}
            </button>
          ))}
          <button className="chip" aria-pressed={poolOnly} onClick={() => setPoolOnly((p) => !p)}>
            {poolOnly && <Check className="size-3.5" aria-hidden />} Private pool
          </button>
          <button className="chip" aria-pressed={onlyBookable} onClick={() => setOnlyBookable((p) => !p)}>
            {onlyBookable && <Check className="size-3.5" aria-hidden />} Fits my party & dates
          </button>
          {activeFilters > 0 && (
            <button onClick={reset} className="ml-1 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em] text-muted hover:text-ink">
              <X className="size-3.5" aria-hidden /> Clear
            </button>
          )}
        </div>

        <p className="sr-only" aria-live="polite">
          {loading ? 'Checking availability' : `${results.length} room types shown`}
        </p>

        <div className="mt-14 space-y-20 md:space-y-28">
          {loading ? (
            [0, 1].map((i) => (
              <div key={i} className="grid gap-8 md:grid-cols-2" aria-hidden>
                <div className="skeleton aspect-[4/3] rounded-[2rem]" />
                <div className="space-y-4 pt-6">
                  <div className="skeleton h-4 w-32 rounded" />
                  <div className="skeleton h-12 w-3/4 rounded" />
                  <div className="skeleton h-24 rounded" />
                </div>
              </div>
            ))
          ) : results.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-line px-6 py-20 text-center">
              <p className="font-serif text-4xl">No rooms match these filters.</p>
              <p className="mx-auto mt-3 max-w-md text-muted">Try another view, remove the pool filter, or change your dates or party size.</p>
              <button onClick={reset} className="btn btn-dark mt-8">
                Clear filters
              </button>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {results.map(({ room, a }, i) => (
                <motion.div key={room.id} layout initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}>
                  <RoomRow room={room} a={a} flip={i % 2 === 1} nights={nights} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
        <p className="mt-16 text-xs text-muted">
          Availability and rates are fictional demonstration data generated for each date. Weekend nights carry a sample 10% premium; green
          season (May–Oct) and festive season rates vary.
        </p>
      </section>

      <Packages />
    </>
  )
}

function RoomRow({ room, a, flip, nights }: { room: Room; a: RoomAvailability; flip: boolean; nights: number }) {
  const navigate = useNavigate()
  const { query } = useStay()
  const stayTotal = a.nights.reduce((s, n) => s + n.price, 0) * query.rooms
  const bookable = a.fits && a.status !== 'sold-out'
  return (
    <article className={`grid items-center gap-10 lg:grid-cols-12 ${flip ? 'lg:[&>*:first-child]:order-2' : ''}`} aria-labelledby={`${room.id}-h`}>
      <div className="lg:col-span-7">
        <TiltCard max={4}>
          <div className="relative grid aspect-[4/3] grid-cols-3 grid-rows-2 gap-2 overflow-hidden rounded-[2rem]">
            <Link to={`/stay/${room.id}`} className="group relative col-span-2 row-span-2 overflow-hidden" tabIndex={-1} aria-hidden>
              <Img name={room.images[0]} alt="" sizes="(min-width:1024px) 40vw, 66vw" className="img-cover transition duration-[1.6s] group-hover:scale-105" />
            </Link>
            <Img name={room.images[1]} alt="" sizes="20vw" width={600} className="img-cover" />
            <Img name={room.images[2]} alt="" sizes="20vw" width={600} className="img-cover" />
            <StatusBadge status={a.status} className="absolute left-4 top-4" />
          </div>
        </TiltCard>
      </div>
      <div className="lg:col-span-5">
        <p className="eyebrow text-accent">{room.view} view · {room.sizeSqm} m²</p>
        <h3 id={`${room.id}-h`} className="mt-3 text-4xl md:text-5xl">
          {room.name}
        </h3>
        <p className="mt-4 leading-relaxed text-muted">{room.tagline}</p>
        <RoomFacts room={room} className="mt-6" />
        <ul className="mt-6 flex flex-wrap gap-2">
          {room.amenities.slice(1, 5).map((x) => (
            <li key={x} className="rounded-full bg-bg-alt px-3 py-1 text-xs">
              {x}
            </li>
          ))}
        </ul>

        <div className="mt-8 rounded-2xl border border-line bg-card p-5">
          {!a.fits ? (
            <p className="text-sm text-muted">
              Not suitable for {query.adults + query.children} guests in {query.rooms} room{query.rooms > 1 ? 's' : ''} (max {room.maxGuests} per room). Try adding a room.
            </p>
          ) : a.status === 'sold-out' ? (
            <p className="text-sm text-muted">{statusMeta['sold-out'].description} Try nearby dates — see the calendar on the room page.</p>
          ) : (
            <div className="flex flex-wrap items-end justify-between gap-4">
              <p>
                <span className="block text-xs text-muted">
                  {nights} night{nights > 1 ? 's' : ''}
                  {query.rooms > 1 ? ` × ${query.rooms} rooms` : ''}, before sample taxes
                </span>
                <span className="font-serif text-4xl">{money(stayTotal)}</span>
              </p>
              {a.status === 'limited' && <p className="text-xs text-muted">{a.minUnits} left in demo inventory</p>}
            </div>
          )}
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="btn btn-dark" disabled={!bookable} onClick={() => navigate(`/book?room=${room.id}`)}>
              {a.status === 'request' ? 'Request to book' : 'Book now'}
            </button>
            <Link to={`/stay/${room.id}`} className="btn btn-ghost">
              Details & 3D tour
            </Link>
          </div>
        </div>
      </div>
    </article>
  )
}

function Packages() {
  return (
    <section id="packages" className="scroll-mt-24 bg-bg-alt py-28 md:py-36" aria-labelledby="pk-h">
      <div className="container-x">
        <div id="pk-h">
          <SectionHeading
            eyebrow="Signature packages"
            title={
              <>
                A whole holiday, <em className="text-accent">thoughtfully composed.</em>
              </>
            }
            intro="Each package pairs a room with the experiences that suit it best. Prices are fictional demonstration totals including sample taxes."
          />
        </div>
        <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {packages.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 0.08} className={i === 0 ? 'xl:col-span-2' : ''}>
              <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-card ring-1 ring-line">
                <div className={`relative overflow-hidden ${i === 0 ? 'aspect-[16/8]' : 'aspect-[16/10]'}`}>
                  <Img name={p.image} alt="" sizes="(min-width:1280px) 33vw, 50vw" className="img-cover transition duration-[1.6s] group-hover:scale-105" />
                  <span className="absolute left-4 top-4 rounded-full bg-pearl/90 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-midnight">
                    {p.nights} nights
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <p className="eyebrow text-accent">{p.forWho}</p>
                  <h3 className="mt-2 text-3xl md:text-4xl">{p.name}</h3>
                  <ul className="mt-5 space-y-2 text-sm">
                    {p.includes.map((x) => (
                      <li key={x} className="flex gap-2.5">
                        <Check className="mt-0.5 size-4 shrink-0 text-palm" aria-hidden />
                        {x}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 text-xs text-muted">
                    <strong>Not included:</strong> {p.excludes.join(', ')}. {p.conditions}
                  </p>
                  <div className="mt-auto flex items-end justify-between gap-4 pt-6">
                    <p>
                      <span className="block text-xs text-muted">From, for the stay</span>
                      <span className="font-serif text-3xl">{money(p.price)}</span>
                    </p>
                    <Link to={`/book?room=${p.roomId}&package=${p.id}`} className="btn btn-dark">
                      Book <ArrowRight className="size-4" aria-hidden />
                    </Link>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

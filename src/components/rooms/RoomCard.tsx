import { ArrowUpRight, BedDouble, Eye, Maximize2, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Room } from '../../data/types'
import type { RoomAvailability } from '../../lib/availability'
import { money } from '../../lib/pricing'
import { StatusBadge } from '../ui/bits'
import { Img } from '../ui/Img'
import { TiltCard } from '../ui/TiltCard'

export function RoomFacts({ room, className = '' }: { room: Room; className?: string }) {
  return (
    <ul className={`grid grid-cols-2 gap-x-4 gap-y-2 text-[0.8rem] text-muted ${className}`}>
      <li className="flex items-center gap-2"><Users className="size-4 shrink-0" aria-hidden />Up to {room.maxGuests} guests</li>
      <li className="flex items-center gap-2"><Maximize2 className="size-4 shrink-0" aria-hidden />{room.sizeSqm} m²</li>
      <li className="flex items-center gap-2"><BedDouble className="size-4 shrink-0" aria-hidden />{room.beds}</li>
      <li className="flex items-center gap-2"><Eye className="size-4 shrink-0" aria-hidden />{room.view} view</li>
    </ul>
  )
}

/** Compact tilt card for carousels. */
export function RoomCard({ room, availability, nightsTotal }: { room: Room; availability?: RoomAvailability; nightsTotal?: number }) {
  return (
    <TiltCard className="h-full">
      <article data-cursor="View" className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-[0_20px_60px_-35px_rgb(16_44_53/0.5)] ring-1 ring-line">
        <div className="relative aspect-[4/5] overflow-hidden">
          <Img name={room.images[0]} alt={`${room.name} interior`} sizes="(min-width: 1024px) 30vw, 85vw" className="img-cover transition duration-[1.6s] ease-[var(--ease-tide)] group-hover:scale-105" />
          <div className="absolute inset-0 scale-110 opacity-0 transition-[opacity,scale] duration-[1.2s] ease-[var(--ease-tide)] group-hover:scale-100 group-hover:opacity-100">
            <Img name={room.images[1]} alt="" sizes="(min-width: 1024px) 30vw, 85vw" className="img-cover" />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-midnight/80 via-transparent to-transparent" />
          {availability && <StatusBadge status={availability.status} className="absolute left-4 top-4" />}
          <div className="absolute inset-x-0 bottom-0 p-6 text-pearl" style={{ transform: 'translateZ(40px)' }}>
            <p className="eyebrow text-gold">{room.view} view</p>
            <h3 className="mt-2 text-3xl md:text-[2.1rem]">{room.name}</h3>
          </div>
        </div>
        <div className="flex flex-1 flex-col gap-5 p-6">
          <p className="text-sm leading-relaxed text-muted">{room.tagline}</p>
          <RoomFacts room={room} />
          <div className="mt-auto flex items-end justify-between gap-4 border-t border-line pt-5">
            <p>
              <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-muted">{nightsTotal ? `${nightsTotal} nights from` : 'From / night'}</span>
              <span className="font-serif text-3xl">{money(nightsTotal && availability ? availability.nights.reduce((s, n) => s + n.price, 0) : room.nightlyRate)}</span>
            </p>
            <Link
              to={`/stay/${room.id}`}
              className="inline-flex items-center gap-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.2em] after:absolute after:inset-0"
              aria-label={`View details for ${room.name}`}
            >
              View details <ArrowUpRight className="size-4 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
            </Link>
          </div>
        </div>
      </article>
    </TiltCard>
  )
}

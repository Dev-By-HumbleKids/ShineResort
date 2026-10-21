import type { AvailabilityStatus, Room } from '../data/types'
import { eachNight, fromISO } from './dates'

/**
 * Deterministic, fictional availability. Each room/night pair gets a stable
 * pseudo-random occupancy so results are repeatable during a demo. This does
 * NOT reflect any real inventory.
 */
function hash(str: string) {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return (h >>> 0) / 4294967295
}

export type Season = { id: 'festive' | 'high' | 'green'; label: string; multiplier: number }

export function seasonFor(iso: string): Season {
  const d = fromISO(iso)
  const m = d.getMonth() + 1
  const day = d.getDate()
  if ((m === 12 && day >= 20) || (m === 1 && day <= 5)) return { id: 'festive', label: 'Festive season', multiplier: 1.3 }
  if (m >= 5 && m <= 10) return { id: 'green', label: 'Green season', multiplier: 0.8 }
  return { id: 'high', label: 'High season', multiplier: 1 }
}

export function unitsLeft(room: Room, iso: string) {
  const s = seasonFor(iso)
  const weekend = [5, 6].includes(fromISO(iso).getDay())
  const pressure = s.id === 'festive' ? 0.7 : s.id === 'high' ? 0.42 : 0.22
  const occupancy = Math.min(1, hash(room.id + iso) * 0.5 + pressure * (weekend ? 1.15 : 0.95))
  return Math.max(0, Math.round(room.inventory * (1 - occupancy)))
}

export function nightlyPrice(room: Room, iso: string) {
  const weekend = [5, 6].includes(fromISO(iso).getDay())
  return Math.round(room.nightlyRate * seasonFor(iso).multiplier * (weekend ? 1.1 : 1))
}

export type StayQuery = { checkIn: string; checkOut: string; adults: number; children: number; rooms: number }

export function fitsGuests(room: Room, q: Pick<StayQuery, 'adults' | 'children' | 'rooms'>) {
  const perRoomAdults = Math.ceil(q.adults / q.rooms)
  const perRoomGuests = Math.ceil((q.adults + q.children) / q.rooms)
  return perRoomAdults <= room.maxAdults && perRoomGuests <= room.maxGuests
}

export type RoomAvailability = {
  status: AvailabilityStatus
  minUnits: number
  fits: boolean
  nights: { date: string; price: number; units: number }[]
}

export function checkRoom(room: Room, q: StayQuery): RoomAvailability {
  const nights = eachNight(q.checkIn, q.checkOut).map((date) => ({
    date,
    price: nightlyPrice(room, date),
    units: unitsLeft(room, date),
  }))
  const minUnits = nights.length ? Math.min(...nights.map((n) => n.units)) : 0
  const fits = fitsGuests(room, q)
  let status: AvailabilityStatus
  if (minUnits < q.rooms) status = 'sold-out'
  else if (room.requiresRequest) status = 'request'
  else if (minUnits - q.rooms <= 1) status = 'limited'
  else status = 'available'
  return { status, minUnits, fits, nights }
}

export const statusMeta: Record<AvailabilityStatus, { label: string; tone: string; description: string }> = {
  available: { label: 'Available', tone: 'bg-palm text-pearl', description: 'Rooms are open for your dates in this demo.' },
  limited: { label: 'Limited Availability', tone: 'bg-gold text-midnight', description: 'Only a few rooms remain for these dates in the demo dataset.' },
  'sold-out': { label: 'Sold Out', tone: 'bg-charcoal/80 text-pearl', description: 'No rooms of this type remain for one or more nights.' },
  request: { label: 'Request Required', tone: 'bg-lagoon text-pearl', description: 'Our reservations team reviews this booking before confirming.' },
}

/** 30 days of status for a calendar strip. */
export function monthStrip(room: Room, start: string, days = 30) {
  const out: { date: string; units: number; price: number }[] = []
  const d = fromISO(start)
  for (let i = 0; i < days; i++) {
    const x = new Date(d)
    x.setDate(d.getDate() + i)
    const iso = `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`
    out.push({ date: iso, units: unitsLeft(room, iso), price: nightlyPrice(room, iso) })
  }
  return out
}

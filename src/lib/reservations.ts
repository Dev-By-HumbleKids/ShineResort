import type { Totals } from './pricing'

/**
 * Demo reservations are stored only in this browser's localStorage.
 * Nothing is sent to a server, no payment is taken and no email is sent.
 */
export type ReservationKind = 'stay' | 'experience' | 'dining' | 'spa'

export type Guest = { firstName: string; lastName: string; email: string; phone: string; requests?: string }

export type Reservation = {
  ref: string
  kind: ReservationKind
  title: string
  /** short human summary e.g. dates & party */
  summary: string
  date: string
  endDate?: string
  status: 'confirmed' | 'pending'
  createdAt: string
  totals?: Totals
  guest: Guest
  meta?: Record<string, string | number>
}

const KEY = 'shine.reservations.v1'

function read(): Reservation[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as Reservation[]) : []
  } catch {
    return []
  }
}

function write(list: Reservation[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(list))
  } catch {
    /* storage may be unavailable (private mode); the confirmation still renders */
  }
}

const PREFIX: Record<ReservationKind, string> = { stay: 'SHN', experience: 'EXP', dining: 'DIN', spa: 'SPA' }

export function makeRef(kind: ReservationKind) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let s = ''
  const rand = crypto.getRandomValues(new Uint32Array(6))
  for (const n of rand) s += alphabet[n % alphabet.length]
  return `${PREFIX[kind]}-${s}`
}

export function saveReservation(r: Omit<Reservation, 'ref' | 'createdAt'>): Reservation {
  const full: Reservation = { ...r, ref: makeRef(r.kind), createdAt: new Date().toISOString() }
  write([full, ...read()].slice(0, 50))
  window.dispatchEvent(new Event('shine:reservations'))
  return full
}

export function listReservations() {
  return read()
}

export function findReservation(ref: string, lastName: string) {
  const r = read().find((x) => x.ref.toUpperCase() === ref.trim().toUpperCase())
  if (!r) return null
  return r.guest.lastName.trim().toLowerCase() === lastName.trim().toLowerCase() ? r : null
}

export function cancelReservation(ref: string) {
  write(read().filter((r) => r.ref !== ref))
  window.dispatchEvent(new Event('shine:reservations'))
}

/** Demo lifecycle derived from dates — used by the status tracker. */
export function lifecycle(r: Reservation, todayISO: string) {
  const steps = [
    { id: 'received', label: 'Request received' },
    { id: 'confirmed', label: r.status === 'pending' ? 'Awaiting concierge review' : 'Confirmed (demo)' },
    { id: 'pre', label: r.kind === 'stay' ? 'Pre-arrival planning' : 'Reminder & preparation' },
    { id: 'day', label: r.kind === 'stay' ? 'In residence' : 'Experience day' },
    { id: 'done', label: 'Completed' },
  ]
  let current = r.status === 'pending' ? 1 : 2
  const end = r.endDate ?? r.date
  if (todayISO >= r.date && r.status === 'confirmed') current = 3
  if (todayISO > end && r.status === 'confirmed') current = 4
  return { steps, current }
}

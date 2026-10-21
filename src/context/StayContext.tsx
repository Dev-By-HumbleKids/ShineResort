import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import type { StayQuery } from '../lib/availability'
import { addDays, today } from '../lib/dates'

/** Holds the current stay search so dates follow the guest across pages. */
type Ctx = { query: StayQuery; setQuery: (q: StayQuery) => void; hasSearched: boolean }

const StayContext = createContext<Ctx | null>(null)

export function defaultQuery(): StayQuery {
  const ci = addDays(today(), 14)
  return { checkIn: ci, checkOut: addDays(ci, 3), adults: 2, children: 0, rooms: 1 }
}

export function StayProvider({ children }: { children: ReactNode }) {
  const [query, setQ] = useState<StayQuery>(() => {
    try {
      const raw = sessionStorage.getItem('shine.query')
      if (raw) {
        const q = JSON.parse(raw) as StayQuery
        if (q.checkIn >= today()) return q
      }
    } catch {
      /* ignore */
    }
    return defaultQuery()
  })
  const [hasSearched, setHasSearched] = useState(false)

  const setQuery = useCallback((q: StayQuery) => {
    setQ(q)
    setHasSearched(true)
    try {
      sessionStorage.setItem('shine.query', JSON.stringify(q))
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(() => ({ query, setQuery, hasSearched }), [query, setQuery, hasSearched])
  return <StayContext.Provider value={value}>{children}</StayContext.Provider>
}

export function useStay() {
  const ctx = useContext(StayContext)
  if (!ctx) throw new Error('useStay must be used inside StayProvider')
  return ctx
}

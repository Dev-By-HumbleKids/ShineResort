import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ChevronLeft, ChevronRight, Moon } from 'lucide-react'
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'
import { addDays, formatDate, fromISO, nightsBetween, toISO, today } from '../../lib/dates'

const WEEKDAYS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

const monthStart = (iso: string) => iso.slice(0, 8) + '01'
function addMonths(iso: string, n: number) {
  const d = fromISO(monthStart(iso))
  d.setMonth(d.getMonth() + n)
  return toISO(d)
}
/** Monday-first grid of ISO dates (null = padding). */
function monthGrid(first: string) {
  const d = fromISO(first)
  const pad = (d.getDay() + 6) % 7
  const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  const cells: (string | null)[] = Array(pad).fill(null)
  for (let i = 0; i < days; i++) cells.push(addDays(first, i))
  while (cells.length % 7) cells.push(null)
  return cells
}

type RangeProps = {
  mode: 'range'
  start: string
  end: string
  /** which end the guest is choosing when the calendar opens */
  picking?: 'start' | 'end'
  onChange: (start: string, end: string) => void
  maxNights?: number
}
type SingleProps = { mode: 'single'; value: string; onChange: (value: string) => void }

export type CalendarProps = (RangeProps | SingleProps) & {
  min?: string
  max?: string
  months?: 1 | 2
  /** optional "from" price shown under each day */
  priceFor?: (iso: string) => number | null
  onDone?: () => void
}

/**
 * SHINE's date picker: two-month range selection with a champagne range band,
 * live hover preview, nightly "from" prices, presets and full keyboard support.
 */
export function Calendar(props: CalendarProps) {
  const min = props.min ?? today()
  const max = props.max
  const months = props.months ?? 2
  const range = props.mode === 'range'

  const [dStart, setDStart] = useState(range ? props.start : props.value)
  const [dEnd, setDEnd] = useState(range ? props.end : '')
  const [picking, setPicking] = useState<'start' | 'end'>(range ? (props.picking ?? 'start') : 'start')
  const [hover, setHover] = useState<string | null>(null)
  const [focus, setFocus] = useState(() => (range && props.picking === 'end' && props.end ? props.end : dStart || min))
  const [view, setView] = useState(() => monthStart(focus))
  const [dir, setDir] = useState(1)
  const grid = useRef<HTMLDivElement>(null)

  const maxNights = range ? (props.maxNights ?? 30) : 0
  const endLimit = range && picking === 'end' && dStart ? addDays(dStart, maxNights) : undefined

  // while choosing check-out, earlier dates simply restart the selection
  const disabled = (iso: string) => iso < min || (!!max && iso > max) || (!!endLimit && iso > endLimit)

  // keep the focused day visible and focused for keyboard users
  useEffect(() => {
    const last = addMonths(view, months - 1)
    if (focus < view || monthStart(focus) > last) {
      setDir(focus < view ? -1 : 1)
      setView(monthStart(focus < view ? focus : addMonths(focus, -(months - 1))))
    }
    const el = grid.current?.querySelector<HTMLButtonElement>(`[data-iso="${focus}"]`)
    if (el && grid.current?.contains(document.activeElement)) el.focus()
  }, [focus, view, months])

  const commitRange = (s: string, e: string) => {
    if (props.mode === 'range') props.onChange(s, e)
    setTimeout(() => props.onDone?.(), 220)
  }

  const pick = (iso: string) => {
    if (disabled(iso)) return
    if (props.mode === 'single') {
      setDStart(iso)
      props.onChange(iso)
      setTimeout(() => props.onDone?.(), 160)
      return
    }
    if (picking === 'start' || iso <= dStart) {
      setDStart(iso)
      setDEnd('')
      setPicking('end')
      return
    }
    setDEnd(iso)
    setPicking('start')
    commitRange(dStart, iso)
  }

  const onKey = (e: KeyboardEvent) => {
    const step: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }
    if (e.key in step) {
      e.preventDefault()
      const next = addDays(focus, step[e.key])
      if (next >= min && (!max || next <= max)) setFocus(next)
    } else if (e.key === 'PageDown' || e.key === 'PageUp') {
      e.preventDefault()
      const next = addMonths(focus, e.key === 'PageDown' ? 1 : -1).slice(0, 8) + focus.slice(8)
      setFocus(next < min ? min : next)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      pick(focus)
    }
  }

  const go = (n: number) => {
    setDir(n)
    setView((v) => addMonths(v, n))
  }
  const canPrev = view > monthStart(min)
  const canNext = !max || addMonths(view, months) <= monthStart(max)

  // range preview while choosing the check-out
  const previewEnd = range && picking === 'end' && dStart && hover && hover > dStart && !disabled(hover) ? hover : dEnd
  const nights = range && dStart && previewEnd ? nightsBetween(dStart, previewEnd) : 0

  const presets = useMemo(() => {
    if (!range) return []
    const base = dStart && dStart >= min ? dStart : addDays(min, 1)
    const fri = (() => {
      let d = base
      while (fromISO(d).getDay() !== 5) d = addDays(d, 1)
      return d
    })()
    return [
      { label: 'Weekend', s: fri, e: addDays(fri, 2) },
      { label: '3 nights', s: base, e: addDays(base, 3) },
      { label: '1 week', s: base, e: addDays(base, 7) },
    ]
  }, [range, dStart, min])

  const monthsToShow = Array.from({ length: months }, (_, i) => addMonths(view, i))
  const t = today()

  return (
    <div className="select-none" onMouseLeave={() => setHover(null)}>
      {range && (
        <div className="mb-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          {(['start', 'end'] as const).map((k, i) => {
            const v = k === 'start' ? dStart : previewEnd
            const active = picking === k
            return (
              <div key={k} className={i === 1 ? 'order-3' : ''}>
                <button
                  type="button"
                  onClick={() => (k === 'start' || dStart) && setPicking(k)}
                  className={`w-full rounded-xl border px-4 py-2.5 text-left transition ${active ? 'border-gold bg-gold/10 shadow-[0_0_0_3px_rgb(199_166_106/0.18)]' : 'border-line hover:border-muted'}`}
                >
                  <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-muted">{k === 'start' ? 'Check-in' : 'Check-out'}</span>
                  <span className={`block font-serif text-xl leading-tight ${v ? '' : 'text-muted'}`}>{v ? formatDate(v, { weekday: 'short', day: 'numeric', month: 'short' }) : 'Add date'}</span>
                </button>
              </div>
            )
          })}
          <span className="order-2 flex flex-col items-center text-accent">
            <ArrowRight className="size-4" aria-hidden />
            <span className="mt-0.5 text-[0.6rem] font-semibold tabular-nums">{nights ? `${nights}N` : '—'}</span>
          </span>
        </div>
      )}

      <div className="relative flex items-center justify-between">
        <button type="button" onClick={() => go(-1)} disabled={!canPrev} className="grid size-9 place-items-center rounded-full border border-line transition hover:border-ink disabled:opacity-25" aria-label="Previous month">
          <ChevronLeft className="size-4" />
        </button>
        <p className="sr-only" aria-live="polite">
          {monthsToShow.map((m) => fromISO(m).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })).join(' and ')}
        </p>
        <button type="button" onClick={() => go(1)} disabled={!canNext} className="grid size-9 place-items-center rounded-full border border-line transition hover:border-ink disabled:opacity-25" aria-label="Next month">
          <ChevronRight className="size-4" />
        </button>
      </div>

      <div ref={grid} onKeyDown={onKey} className="relative -mt-9 overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={view}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`grid gap-8 ${months === 2 ? 'md:grid-cols-2' : ''}`}
          >
            {monthsToShow.map((m, mi) => (
              <div key={m} className={mi === 1 ? 'hidden md:block' : ''}>
                <p className="mb-4 text-center font-serif text-2xl leading-9">
                  {fromISO(m).toLocaleDateString('en-GB', { month: 'long' })} <span className="text-muted">{fromISO(m).getFullYear()}</span>
                </p>
                <div role="grid" aria-label={fromISO(m).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })} className="grid grid-cols-7 gap-y-1">
                  {WEEKDAYS.map((w, wi) => (
                    <span key={w} role="columnheader" className={`pb-2 text-center text-[0.62rem] font-semibold uppercase tracking-[0.15em] ${wi > 4 ? 'text-accent' : 'text-muted'}`}>
                      {w}
                    </span>
                  ))}
                  {monthGrid(m).map((iso, ci) => {
                    if (!iso) return <span key={`p${ci}`} aria-hidden />
                    const isDis = disabled(iso)
                    const isStart = range ? iso === dStart : iso === dStart
                    const isEnd = range && !!previewEnd && iso === previewEnd
                    const inside = range && !!dStart && !!previewEnd && iso > dStart && iso < previewEnd
                    const col = ci % 7
                    const band = range && dStart && previewEnd && (inside || (isStart && previewEnd > dStart) || isEnd)
                    const price = props.priceFor && !isDis ? props.priceFor(iso) : null
                    return (
                      <div
                        key={iso}
                        role="gridcell"
                        aria-selected={isStart || isEnd}
                        className={`relative flex justify-center py-0.5 ${
                          !band
                            ? ''
                            : inside
                              ? `bg-gold/15 ${col === 0 ? 'rounded-l-full' : ''} ${col === 6 ? 'rounded-r-full' : ''}`
                              : isStart
                                ? 'bg-linear-to-r from-transparent from-50% to-gold/15 to-50%'
                                : 'bg-linear-to-l from-transparent from-50% to-gold/15 to-50%'
                        }`}
                      >
                        <button
                          type="button"
                          data-iso={iso}
                          tabIndex={iso === focus ? 0 : -1}
                          disabled={isDis}
                          onClick={() => pick(iso)}
                          onMouseEnter={() => setHover(iso)}
                          onFocus={() => setFocus(iso)}
                          aria-label={`${formatDate(iso, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}${price ? `, from $${price}` : ''}${isDis ? ', unavailable' : ''}`}
                          className={`group relative flex size-11 flex-col items-center justify-center rounded-full text-sm transition duration-200 md:size-12 ${
                            isStart || isEnd
                              ? 'bg-ink text-bg shadow-lg ring-2 ring-gold ring-offset-2 ring-offset-card'
                              : isDis
                                ? 'text-muted/40 line-through decoration-muted/30'
                                : 'hover:bg-bg-alt hover:ring-1 hover:ring-gold/60'
                          } ${iso === focus ? 'focus-visible:ring-2 focus-visible:ring-gold' : ''}`}
                        >
                          <span className={`leading-none tabular-nums ${isStart || isEnd ? 'font-semibold' : ''}`}>{fromISO(iso).getDate()}</span>
                          {price ? (
                            <span className={`mt-0.5 text-[0.55rem] leading-none tabular-nums ${isStart || isEnd ? 'text-gold' : 'text-muted group-hover:text-accent'}`}>${price}</span>
                          ) : null}
                          {iso === t && !(isStart || isEnd) && <span className="absolute bottom-1 size-1 rounded-full bg-gold" aria-hidden />}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {range && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <div className="flex flex-wrap gap-1.5">
            {presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setDStart(p.s)
                  setDEnd(p.e)
                  setPicking('start')
                  setFocus(p.s)
                  commitRange(p.s, p.e)
                }}
                className="rounded-full border border-line px-3 py-1.5 text-xs transition hover:border-gold hover:bg-gold/10"
              >
                {p.label}
              </button>
            ))}
          </div>
          <p className="flex items-center gap-2 text-xs text-muted">
            <Moon className="size-3.5 text-accent" aria-hidden />
            {picking === 'end' ? 'Now choose your check-out' : nights ? `${nights} night${nights > 1 ? 's' : ''} · prices from, per night` : 'Choose your check-in'}
          </p>
        </div>
      )}
    </div>
  )
}

import { CheckCircle2, CircleDashed, CircleSlash, Clock3, Minus, Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import type { AvailabilityStatus } from '../../data/types'
import { statusMeta } from '../../lib/availability'
import { money, type Totals } from '../../lib/pricing'
import { Reveal } from './Reveal'

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = 'left',
  light,
}: {
  eyebrow: string
  title: ReactNode
  intro?: ReactNode
  align?: 'left' | 'center'
  light?: boolean
}) {
  return (
    <Reveal className={`max-w-3xl ${align === 'center' ? 'mx-auto text-center' : ''}`}>
      <p className={`eyebrow mb-5 flex items-center gap-3 ${align === 'center' ? 'justify-center' : ''} ${light ? 'text-gold' : 'text-accent'}`}>
        <span className="h-px w-8 bg-current" aria-hidden />
        {eyebrow}
      </p>
      <h2 className="text-balance text-[2.6rem] leading-[1.02] sm:text-5xl md:text-6xl lg:text-7xl">{title}</h2>
      {intro && <p className={`mt-6 max-w-xl text-base leading-relaxed md:text-lg ${align === 'center' ? 'mx-auto' : ''} ${light ? 'text-pearl/75' : 'text-muted'}`}>{intro}</p>}
    </Reveal>
  )
}

const statusIcon: Record<AvailabilityStatus, ReactNode> = {
  available: <CheckCircle2 className="size-3.5" aria-hidden />,
  limited: <Clock3 className="size-3.5" aria-hidden />,
  'sold-out': <CircleSlash className="size-3.5" aria-hidden />,
  request: <CircleDashed className="size-3.5" aria-hidden />,
}

/** Status pill: icon + text so meaning never relies on colour alone. */
export function StatusBadge({ status, className = '' }: { status: AvailabilityStatus; className?: string }) {
  const m = statusMeta[status]
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.14em] ${m.tone} ${className}`}>
      {statusIcon[status]}
      {m.label}
    </span>
  )
}

export function Stepper({
  label,
  value,
  min,
  max,
  onChange,
  hint,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (n: number) => void
  hint?: string
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <div>
        <p className="text-sm font-medium">{label}</p>
        {hint && <p className="text-xs text-muted">{hint}</p>}
      </div>
      <div className="flex items-center gap-3" role="group" aria-label={label}>
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="grid size-9 place-items-center rounded-full border border-line transition hover:border-ink disabled:opacity-30"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="size-4" />
        </button>
        <output className="w-5 text-center font-semibold tabular-nums" aria-live="polite">
          {value}
        </output>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="grid size-9 place-items-center rounded-full border border-line transition hover:border-ink disabled:opacity-30"
          aria-label={`Increase ${label}`}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  )
}

export function PriceSummary({ totals, note }: { totals: Totals; note?: string }) {
  return (
    <div className="rounded-xl border border-line bg-card p-5">
      <p className="eyebrow mb-4 text-muted">Price summary</p>
      <dl className="space-y-2.5 text-sm">
        {totals.lines.map((l, i) => (
          <div key={i} className="flex justify-between gap-4">
            <dt>
              {l.label}
              {l.hint && <span className="block text-xs text-muted">{l.hint}</span>}
            </dt>
            <dd className="tabular-nums">{money(l.amount)}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-4 border-t border-line pt-2.5 text-muted">
          <dt>Subtotal</dt>
          <dd className="tabular-nums">{money(totals.subtotal)}</dd>
        </div>
        <div className="flex justify-between gap-4 text-muted">
          <dt>Service charge (sample 10%)</dt>
          <dd className="tabular-nums">{money(totals.service)}</dd>
        </div>
        <div className="flex justify-between gap-4 text-muted">
          <dt>Government tax (sample 5%)</dt>
          <dd className="tabular-nums">{money(totals.tax)}</dd>
        </div>
        <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
          <dt className="font-semibold">Estimated total</dt>
          <dd className="font-serif text-3xl tabular-nums">{money(totals.total)}</dd>
        </div>
      </dl>
      <p className="mt-4 text-xs leading-relaxed text-muted">{note ?? 'Demonstration pricing in USD. No payment is taken.'}</p>
    </div>
  )
}

export function Field({
  label,
  error,
  children,
  id,
  className = '',
}: {
  label: string
  error?: string
  children: ReactNode
  id: string
  className?: string
}) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export function DemoNotice({ children }: { children: ReactNode }) {
  return <p className="rounded-lg border border-dashed border-line bg-bg-alt/60 px-4 py-3 text-xs leading-relaxed text-muted">{children}</p>
}

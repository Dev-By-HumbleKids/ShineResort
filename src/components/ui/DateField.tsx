import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { formatDate, today } from '../../lib/dates'
import { Calendar } from './Calendar'

/** Floating panel that closes on outside click or Escape and returns focus. */
export function Popover({
  open,
  onClose,
  anchor,
  className = '',
  label,
  children,
}: {
  open: boolean
  onClose: () => void
  anchor: RefObject<HTMLElement | null>
  className?: string
  label: string
  children: ReactNode
}) {
  useEffect(() => {
    if (!open) return
    const outside = (e: MouseEvent) => {
      if (!anchor.current?.contains(e.target as Node)) onClose()
    }
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
    }
    document.addEventListener('mousedown', outside)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', outside)
      document.removeEventListener('keydown', esc)
    }
  }, [open, onClose, anchor])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-label={label}
          data-lenis-prevent
          initial={{ opacity: 0, y: 10, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 6, scale: 0.98 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute z-40 origin-top rounded-[1.5rem] border border-line bg-card p-4 text-ink shadow-[0_40px_100px_-30px_rgb(16_44_53/0.55)] sm:p-6 ${className} max-sm:fixed! max-sm:inset-x-3! max-sm:top-auto! max-sm:bottom-3! max-sm:mt-0! max-sm:w-auto! max-sm:max-h-[85svh] max-sm:overflow-y-auto max-sm:shadow-[0_-20px_80px_-10px_rgb(16_44_53/0.5)]`}
        >
          <span aria-hidden className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-gold/70 to-transparent" />
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Single-date field for forms, using the SHINE calendar instead of the native picker. */
export function DateField({
  id,
  value,
  onChange,
  min = today(),
  max,
  invalid,
  describedBy,
}: {
  id: string
  value: string
  onChange: (v: string) => void
  min?: string
  max?: string
  invalid?: boolean
  describedBy?: string
}) {
  const [open, setOpen] = useState(false)
  const wrap = useRef<HTMLDivElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const close = () => {
    setOpen(false)
    trigger.current?.focus()
  }
  return (
    <div ref={wrap} className="relative">
      <button
        ref={trigger}
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-invalid={invalid}
        aria-describedby={describedBy}
        className="field flex items-center justify-between gap-3 text-left"
      >
        <span>{value ? formatDate(value, { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) : 'Choose a date'}</span>
        <CalendarDays className="size-4 shrink-0 text-accent" aria-hidden />
      </button>
      <Popover open={open} onClose={close} anchor={wrap} label="Choose a date" className="left-0 top-full mt-2 w-[min(22rem,calc(100vw-2.5rem))]">
        <Calendar mode="single" value={value} onChange={onChange} min={min} max={max} months={1} onDone={close} />
      </Popover>
    </div>
  )
}

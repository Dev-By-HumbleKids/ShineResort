import { motion } from 'framer-motion'
import { CheckCircle2, Copy, Hourglass } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Reservation } from '../../lib/reservations'
import { money } from '../../lib/pricing'
import { DemoNotice } from '../ui/bits'

/** Shown after any successful demo submission. */
export function Confirmation({ r, onDone }: { r: Reservation; onDone?: () => void }) {
  const [copied, setCopied] = useState(false)
  const pending = r.status === 'pending'
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(r.ref)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard unavailable */
    }
  }
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center" role="status" aria-live="polite">
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.1 }}
        className={`mx-auto grid size-20 place-items-center rounded-full ${pending ? 'bg-lagoon/15 text-lagoon' : 'bg-palm/15 text-palm'}`}
      >
        {pending ? <Hourglass className="size-9" aria-hidden /> : <CheckCircle2 className="size-10" aria-hidden />}
      </motion.div>
      <p className="eyebrow mt-6 text-accent">{pending ? 'Request received · concierge review' : 'Demo reservation confirmed'}</p>
      <h3 className="mt-3 text-4xl">{pending ? 'We’ll be in touch, ' : 'Thank you, '}{r.guest.firstName}.</h3>
      <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
        {r.title} · {r.summary}
      </p>
      <div className="mx-auto mt-8 flex max-w-xs items-center justify-between gap-3 rounded-2xl border border-line bg-card px-5 py-4">
        <div className="text-left">
          <p className="text-[0.65rem] uppercase tracking-[0.2em] text-muted">Booking reference</p>
          <p className="font-mono text-xl tracking-wider">{r.ref}</p>
        </div>
        <button onClick={copy} className="grid size-10 place-items-center rounded-full border border-line hover:border-ink" aria-label="Copy booking reference">
          <Copy className="size-4" />
        </button>
      </div>
      <p className="mt-2 h-4 text-xs text-palm" aria-live="polite">
        {copied ? 'Copied to clipboard' : ''}
      </p>
      {r.totals && <p className="mt-2 text-sm">Estimated total {money(r.totals.total)}</p>}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to={`/reservations?ref=${r.ref}`} className="btn btn-dark" onClick={onDone}>
          View status
        </Link>
        {onDone && (
          <button onClick={onDone} className="btn btn-ghost">
            Close
          </button>
        )}
      </div>
      <div className="mx-auto mt-8 max-w-md text-left">
        <DemoNotice>
          This is a frontend demonstration. No real booking was created, no payment was taken and no email was sent. The reference is stored only in
          this browser so you can explore the status page.
        </DemoNotice>
      </div>
    </motion.div>
  )
}

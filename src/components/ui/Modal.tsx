import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { lockScroll } from '../../lib/scroll'

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: ReactNode
  variant?: 'drawer' | 'center'
  wide?: boolean
}

/** Accessible dialog: focus trap, Escape to close, focus restore, scroll lock. */
export function Modal({ open, onClose, title, subtitle, children, variant = 'drawer', wide }: Props) {
  const panel = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const restore = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (!open) return
    restore.current = document.activeElement as HTMLElement
    lockScroll(true)
    const t = setTimeout(() => {
      const first = panel.current?.querySelector<HTMLElement>('[data-autofocus]') ?? panel.current?.querySelector<HTMLElement>(FOCUSABLE)
      first?.focus()
    }, 60)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
      }
      if (e.key === 'Tab' && panel.current) {
        const els = [...panel.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null)
        if (!els.length) return
        const first = els[0]
        const last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      clearTimeout(t)
      document.removeEventListener('keydown', onKey)
      lockScroll(false)
      restore.current?.focus?.()
    }
  }, [open, onClose])

  const isDrawer = variant === 'drawer'

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[80]" initial={{ opacity: 1 }} exit={{ opacity: 1 }}>
          <motion.div
            className="absolute inset-0 bg-midnight/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            data-lenis-prevent
            className={
              isDrawer
                ? `absolute inset-y-0 right-0 flex w-full flex-col bg-bg text-ink shadow-2xl ${wide ? 'max-w-3xl' : 'max-w-xl'}`
                : `absolute left-1/2 top-1/2 flex max-h-[92vh] w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-bg text-ink shadow-2xl ${wide ? 'max-w-4xl' : 'max-w-lg'}`
            }
            initial={isDrawer ? { x: '100%' } : { opacity: 0, scale: 0.96 }}
            animate={isDrawer ? { x: 0 } : { opacity: 1, scale: 1 }}
            exit={isDrawer ? { x: '100%' } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="flex items-start justify-between gap-4 border-b border-line px-6 py-5 md:px-8">
              <div>
                <h2 id={titleId} className="text-3xl md:text-4xl">
                  {title}
                </h2>
                {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
              </div>
              <button
                onClick={onClose}
                className="grid size-11 shrink-0 place-items-center rounded-full border border-line transition hover:rotate-90 hover:border-ink"
                aria-label="Close dialog"
              >
                <X className="size-5" />
              </button>
            </header>
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-6 md:px-8">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

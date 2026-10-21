import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { img, type ImageKey } from '../../data/images'
import { lockScroll } from '../../lib/scroll'

export type LightboxItem = { image: ImageKey; alt: string; caption?: string }

/** Keyboard-accessible image viewer: ← → to browse, Esc to close. */
export function Lightbox({ items, index, onChange, onClose }: { items: LightboxItem[]; index: number | null; onChange: (i: number) => void; onClose: () => void }) {
  const open = index !== null
  const closeBtn = useRef<HTMLButtonElement>(null)
  const go = useCallback((dir: number) => index !== null && onChange((index + dir + items.length) % items.length), [index, items.length, onChange])

  useEffect(() => {
    if (!open) return
    const prev = document.activeElement as HTMLElement | null
    lockScroll(true)
    closeBtn.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') go(1)
      if (e.key === 'ArrowLeft') go(-1)
      if (e.key === 'Tab') {
        // keep focus inside the viewer
        const els = [...document.querySelectorAll<HTMLElement>('[data-lightbox] button')]
        const i = els.indexOf(document.activeElement as HTMLElement)
        e.preventDefault()
        els[(i + (e.shiftKey ? -1 : 1) + els.length) % els.length]?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      lockScroll(false)
      prev?.focus?.()
    }
  }, [open, go, onClose])

  const item = index !== null ? items[index] : null

  return createPortal(
    <AnimatePresence>
      {open && item && (
        <motion.div
          data-lightbox
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-[90] flex flex-col bg-midnight/95 text-pearl backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between px-5 py-4">
            <p className="text-xs tracking-[0.2em] text-pearl/60 tabular-nums">
              {String(index! + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </p>
            <button ref={closeBtn} onClick={onClose} className="grid size-11 place-items-center rounded-full border border-pearl/25 hover:border-pearl" aria-label="Close viewer">
              <X className="size-5" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-4 md:px-20">
            <AnimatePresence mode="wait">
              <motion.figure
                key={item.image + index}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35 }}
                className="flex max-h-full flex-col items-center"
              >
                <img
                  src={img(item.image, 2000)}
                  alt={item.alt}
                  className="max-h-[74vh] w-auto max-w-full rounded-xl object-contain"
                  draggable={false}
                />
                <figcaption className="mt-4 max-w-xl text-center text-sm text-pearl/75">{item.caption ?? item.alt}</figcaption>
              </motion.figure>
            </AnimatePresence>
            <button onClick={() => go(-1)} className="absolute left-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-pearl/10 hover:bg-pearl/20 md:left-6" aria-label="Previous image">
              <ChevronLeft className="size-6" />
            </button>
            <button onClick={() => go(1)} className="absolute right-2 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-pearl/10 hover:bg-pearl/20 md:right-6" aria-label="Next image">
              <ChevronRight className="size-6" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

import Lenis from 'lenis'

let lenis: Lenis | null = null

export function initSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({ duration: 1.1, smoothWheel: true })
  if (import.meta.env.DEV) (window as unknown as { __lenis?: Lenis }).__lenis = lenis
  let id = 0
  const raf = (t: number) => {
    lenis?.raf(t)
    id = requestAnimationFrame(raf)
  }
  id = requestAnimationFrame(raf)
  return () => {
    cancelAnimationFrame(id)
    lenis?.destroy()
    lenis = null
  }
}

export function lockScroll(locked: boolean) {
  if (locked) {
    lenis?.stop()
    document.documentElement.style.overflow = 'hidden'
  } else {
    lenis?.start()
    document.documentElement.style.overflow = ''
  }
}

export function scrollToTop(immediate = true) {
  if (lenis) lenis.scrollTo(0, { immediate })
  else window.scrollTo({ top: 0 })
}

export function scrollToEl(el: Element | null, offset = -90) {
  if (!el) return
  if (lenis) lenis.scrollTo(el as HTMLElement, { offset })
  else {
    const y = el.getBoundingClientRect().top + window.scrollY + offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

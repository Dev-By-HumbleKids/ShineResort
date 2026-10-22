import { AnimatePresence, motion } from 'framer-motion'
import { Home, Minus, Plus, RotateCcw, RotateCw, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Img } from '../components/ui/Img'
import { useTheme } from '../context/ThemeContext'
import type { Room } from '../data/types'
import { buildVilla } from './buildVilla'
import { clearMatCache, createStage, type Stage } from './core'

/** Interactive cut-away villa with hotspots linked to real photography. */
export default function VillaScene({ room }: { room: Room }) {
  const host = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Stage | null>(null)
  const roofRef = useRef<(lifted: boolean) => void>(() => {})
  const { theme } = useTheme()
  const [active, setActive] = useState<string | null>(null)
  const [roofLifted, setRoofLifted] = useState(true)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const el = host.current
    if (!el) return
    const { width: w, depth: d } = room.model
    let stage: Stage
    try {
      stage = createStage(el, {
        camera: [w * 1.05 + 3, 8 + (room.model.storeys - 1) * 2, d * 1.4 + 8],
        target: [0, 1.2 + (room.model.stilts ? 1 : 0), 1],
        minDistance: 9,
        maxDistance: 30,
        fov: 38,
      })
    } catch {
      setFailed(true)
      return
    }
    stageRef.current = stage
    const v = buildVilla(stage, room)
    roofRef.current = v.setRoof
    stage.setNight(document.documentElement.dataset.theme === 'night')
    const positions = Object.fromEntries(room.hotspots.map((h) => [h.id, h.position]))
    stage.bindHotspots([...el.querySelectorAll<HTMLElement>('[data-spot]')], positions)
    stage.introFlight([w * 2.4 + 8, 16, d * 2.4 + 14])
    return () => {
      stage.dispose()
      clearMatCache()
      stageRef.current = null
    }
  }, [room])

  useEffect(() => stageRef.current?.setNight(theme === 'night'), [theme])

  const toggleRoof = () => {
    const next = !roofLifted
    roofRef.current(next)
    setRoofLifted(next)
  }

  const spot = room.hotspots.find((h) => h.id === active)

  if (failed) {
    return (
      <div className="grid h-full place-items-center p-8 text-center text-pearl/80">
        <p>3D preview isn’t supported on this device. Explore the photo gallery above instead.</p>
      </div>
    )
  }

  return (
    <div ref={host} className="relative h-full w-full overflow-hidden">
      {room.hotspots.map((h, i) => (
        <button
          key={h.id}
          data-spot={h.id}
          onClick={() => setActive(h.id === active ? null : h.id)}
          aria-pressed={h.id === active}
          aria-label={`${h.label}: ${h.detail}`}
          className="group absolute left-0 top-0 z-10 transition-opacity duration-300"
          style={{ opacity: 0 }}
        >
          <span className="relative grid size-9 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-gold/40 [animation-duration:2.6s]" />
            <span
              className={`relative grid size-7 place-items-center rounded-full border-2 border-pearl text-[0.65rem] font-bold shadow-lg transition ${
                h.id === active ? 'bg-pearl text-midnight' : 'bg-gold text-midnight group-hover:scale-110'
              }`}
            >
              {i + 1}
            </span>
          </span>
        </button>
      ))}

      <AnimatePresence>
        {spot && (
          <motion.aside
            key={spot.id}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 24 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-20 left-4 right-4 z-20 overflow-hidden rounded-2xl bg-pearl text-charcoal shadow-2xl sm:bottom-auto sm:left-auto sm:right-4 sm:top-4 sm:w-72"
            aria-live="polite"
          >
            <div className="relative aspect-[16/10]">
              <Img name={spot.image} alt={spot.label} sizes="300px" width={600} className="img-cover" />
              <button
                onClick={() => setActive(null)}
                className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-midnight/70 text-pearl"
                aria-label="Close detail"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-4">
              <p className="font-serif text-2xl leading-none">{spot.label}</p>
              <p className="mt-2 text-sm text-charcoal/70">{spot.detail}</p>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-2">
        <button onClick={toggleRoof} className="flex h-10 items-center gap-2 rounded-full bg-midnight/80 px-4 text-xs font-semibold uppercase tracking-[0.15em] text-pearl backdrop-blur transition hover:bg-midnight" aria-pressed={!roofLifted}>
          <Home className="size-4" aria-hidden />
          {roofLifted ? 'Close roof' : 'Lift roof'}
        </button>
        <div className="flex gap-2">
          {[
            { icon: RotateCcw, label: 'Rotate left', fn: () => stageRef.current?.nudge(-0.6) },
            { icon: RotateCw, label: 'Rotate right', fn: () => stageRef.current?.nudge(0.6) },
            { icon: Plus, label: 'Zoom in', fn: () => stageRef.current?.nudge(0, 0.8) },
            { icon: Minus, label: 'Zoom out', fn: () => stageRef.current?.nudge(0, 1.25) },
          ].map(({ icon: Icon, label, fn }) => (
            <button key={label} onClick={fn} aria-label={label} className="grid size-10 place-items-center rounded-full bg-midnight/80 text-pearl backdrop-blur transition hover:bg-midnight">
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

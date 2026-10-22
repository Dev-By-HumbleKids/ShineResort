import { Minus, Plus, RotateCcw, RotateCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { buildIsland, islandHotspots } from './buildIsland'
import { clearMatCache, createStage, type Stage } from './core'

const spots: { id: keyof typeof islandHotspots; label: string; sub: string; to: string }[] = [
  { id: 'villas', label: 'Garden Villas', sub: 'Stay', to: '/stay/tropical-garden-villa' },
  { id: 'pool', label: 'The Long Pool', sub: 'Infinity pool', to: '/#facilities' },
  { id: 'dining', label: 'Tidewater', sub: 'Restaurant', to: '/dining' },
  { id: 'spa', label: 'Lumina Spa', sub: 'Wellness', to: '/wellness' },
  { id: 'jetty', label: 'The Jetty', sub: 'Boat charters', to: '/experiences/boat-charter' },
  { id: 'honeymoon', label: 'Sunrise Pavilions', sub: 'Over the lagoon', to: '/stay/sunrise-honeymoon-pavilion' },
  { id: 'lighthouse', label: 'The Lamp', sub: 'Our story', to: '/story' },
  { id: 'riding', label: 'Riding Beach', sub: 'Horse riding', to: '/experiences/horse-riding' },
  { id: 'cay', label: 'Pearl Cay', sub: 'Island excursion', to: '/experiences/island-excursion' },
]

export default function IslandScene() {
  const host = useRef<HTMLDivElement>(null)
  const stageRef = useRef<Stage | null>(null)
  const { theme } = useTheme()
  const navigate = useNavigate()
  const [failed, setFailed] = useState(false)
  const [touch, setTouch] = useState(false)

  useEffect(() => {
    const el = host.current
    if (!el) return
    let stage: Stage
    try {
      stage = createStage(el, { camera: [17, 8.5, 21], target: [0, 1.2, 0], minDistance: 14, maxDistance: 38 })
    } catch {
      setFailed(true)
      return
    }
    stageRef.current = stage
    setTouch(stage.touch)
    buildIsland(stage)
    stage.setNight(document.documentElement.dataset.theme === 'night')
    stage.bindHotspots([...el.querySelectorAll<HTMLElement>('[data-spot]')], islandHotspots)
    stage.introFlight([26, 20, 30])
    return () => {
      stage.dispose()
      clearMatCache()
      stageRef.current = null
    }
  }, [])

  useEffect(() => stageRef.current?.setNight(theme === 'night'), [theme])

  if (failed) {
    return (
      <ul className="grid gap-3 p-6 sm:grid-cols-3">
        {spots.map((s) => (
          <li key={s.id}>
            <button onClick={() => navigate(s.to)} className="chip w-full justify-between">
              {s.label} <span className="text-muted">{s.sub}</span>
            </button>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <div ref={host} className="relative h-full w-full overflow-hidden">
      {spots.map((s) => (
        <button
          key={s.id}
          data-spot={s.id}
          onClick={() => navigate(s.to)}
          className="group absolute left-0 top-0 z-10 flex items-center gap-2 transition-opacity duration-300"
          style={{ opacity: 0 }}
          aria-label={`${s.label} — ${s.sub}`}
        >
          <span className="relative grid size-6 place-items-center">
            <span className="absolute inset-0 animate-ping rounded-full bg-gold/50 [animation-duration:2.4s]" />
            <span className="relative size-3 rounded-full border-2 border-pearl bg-gold shadow" />
          </span>
          <span className="pointer-events-none whitespace-nowrap rounded-full bg-midnight/85 px-3 py-1.5 text-left text-pearl opacity-0 shadow-lg backdrop-blur transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 max-md:hidden">
            <span className="block font-serif text-base leading-none">{s.label}</span>
            <span className="text-[0.6rem] uppercase tracking-[0.2em] text-gold">{s.sub}</span>
          </span>
        </button>
      ))}

      <div className="absolute bottom-4 right-4 z-10 flex gap-2">
        {[
          { icon: RotateCcw, label: 'Rotate left', fn: () => stageRef.current?.nudge(-0.6) },
          { icon: RotateCw, label: 'Rotate right', fn: () => stageRef.current?.nudge(0.6) },
          { icon: Plus, label: 'Zoom in', fn: () => stageRef.current?.nudge(0, 0.8) },
          { icon: Minus, label: 'Zoom out', fn: () => stageRef.current?.nudge(0, 1.25) },
        ].map(({ icon: Icon, label, fn }) => (
          <button
            key={label}
            onClick={fn}
            aria-label={label}
            className="grid size-10 place-items-center rounded-full bg-midnight/80 text-pearl backdrop-blur transition hover:bg-midnight"
          >
            <Icon className="size-4" />
          </button>
        ))}
      </div>
      <p className="pointer-events-none absolute left-4 top-4 z-10 rounded-full bg-midnight/70 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-pearl backdrop-blur">
        {touch ? 'Tap a marker · use buttons to rotate' : 'Drag to explore · click a marker'}
      </p>
    </div>
  )
}

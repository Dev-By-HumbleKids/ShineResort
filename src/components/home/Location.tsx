import { Car, Clock3, Compass, ExternalLink, MapPin, Navigation, Plane, Sunset } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { localTime, sunTimes } from '../../lib/sun'
import { SectionHeading } from '../ui/bits'
import { Reveal } from '../ui/Reveal'

/**
 * Illustrative pin for the fictional resort: an undeveloped stretch at the
 * northern end of Ngwe Saung Beach (no mapped buildings within ~200 m on
 * OpenStreetMap). SHINE itself does not exist.
 */
export const RESORT_PIN = { lat: 16.8775, lng: 94.3761 }

const q = `${RESORT_PIN.lat},${RESORT_PIN.lng}`
const embed = `https://maps.google.com/maps?q=${q}&z=15&output=embed`
const openUrl = `https://www.google.com/maps/search/?api=1&query=${q}`
const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${q}`

const routes = [
  { icon: Car, title: 'From Yangon', detail: 'Around 5 hours by road via Pathein — we arrange private transfers.', time: '≈ 5 h' },
  { icon: Car, title: 'From Pathein', detail: 'A scenic drive through palm country to the coast.', time: '≈ 1 h' },
  { icon: Plane, title: 'Arrive by air', detail: 'Fly to Yangon, then continue with our chauffeured transfer.', time: 'Yangon intl.' },
]

/** Google Map of SHINE's (fictional) beachfront site plus how to get there. */
export function Location() {
  const frameWrap = useRef<HTMLDivElement>(null)
  const [load, setLoad] = useState(false)
  const [now, setNow] = useState(() => new Date())

  // only fetch the Google embed when the section approaches the viewport
  useEffect(() => {
    const el = frameWrap.current
    if (!el) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setLoad(true), { rootMargin: '400px' })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 60_000)
    return () => clearInterval(t)
  }, [])

  return (
    <section id="location" className="scroll-mt-24 py-28 md:py-36" aria-labelledby="loc-h">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-end">
          <div id="loc-h">
            <SectionHeading
              eyebrow="Getting here"
              title={
                <>
                  Find us on the <em className="text-accent">silver shore.</em>
                </>
              }
            />
          </div>
          <Reveal>
            <p className="max-w-md leading-relaxed text-muted lg:ml-auto">
              SHINE sits on a quiet, west-facing stretch at the northern end of Ngwe Saung Beach in the Ayeyarwady Region — fifteen kilometres of
              sand, a sea that turns gold every evening, and nothing between you and the Bay of Bengal.
            </p>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-12">
          {/* map */}
          <Reveal className="lg:col-span-8">
            <div ref={frameWrap} className="relative h-[26rem] overflow-hidden rounded-[2rem] bg-bg-alt ring-1 ring-line md:h-[34rem]">
              {load ? (
                <iframe
                  title="Map showing SHINE’s location on Ngwe Saung Beach, Myanmar"
                  src={embed}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="map-frame absolute inset-0 h-full w-full border-0"
                  allowFullScreen
                />
              ) : (
                <div className="skeleton absolute inset-0" aria-hidden />
              )}

              {/* brand label card over the map */}
              <div className="pointer-events-none absolute left-4 top-4 flex items-center gap-3 rounded-2xl bg-midnight/90 py-3 pl-3 pr-5 text-pearl shadow-xl backdrop-blur md:left-6 md:top-6">
                <span className="relative grid size-11 place-items-center rounded-full bg-gold text-midnight">
                  <span className="absolute inset-0 animate-ping rounded-full bg-gold/50 [animation-duration:2.5s]" aria-hidden />
                  <MapPin className="relative size-5" aria-hidden />
                </span>
                <span>
                  <span className="block font-serif text-xl leading-none tracking-[0.2em]">SHINE</span>
                  <span className="mt-1 block text-[0.62rem] uppercase tracking-[0.2em] text-pearl/70">Ngwe Saung Beach · Myanmar</span>
                </span>
              </div>

              <div className="absolute bottom-4 right-4 flex flex-wrap justify-end gap-2 md:bottom-6 md:right-6">
                <a href={openUrl} target="_blank" rel="noreferrer" className="btn btn-dark min-h-11 px-4 shadow-lg">
                  <ExternalLink className="size-4" aria-hidden /> Open in Google Maps
                </a>
                <a href={directionsUrl} target="_blank" rel="noreferrer" className="btn btn-gold min-h-11 px-4 shadow-lg">
                  <Navigation className="size-4" aria-hidden /> Directions
                </a>
              </div>
            </div>
          </Reveal>

          {/* details */}
          <div className="flex flex-col gap-4 lg:col-span-4">
            <Reveal className="rounded-[1.75rem] bg-midnight p-6 text-pearl">
              <p className="eyebrow text-gold">Address</p>
              <address className="mt-3 font-serif text-2xl not-italic leading-snug">
                SHINE Beach Resort
                <br />
                Northern Ngwe Saung Beach
                <br />
                Pathein District, Ayeyarwady Region, Myanmar
              </address>
              <p className="mt-4 flex items-center gap-2 font-mono text-xs text-pearl/60">
                <Compass className="size-3.5" aria-hidden /> {RESORT_PIN.lat.toFixed(4)}° N, {RESORT_PIN.lng.toFixed(4)}° E
              </p>
              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-pearl/10 pt-5 text-sm">
                <p className="flex items-center gap-2">
                  <Clock3 className="size-4 text-gold" aria-hidden /> {localTime(now)} local
                </p>
                <p className="flex items-center gap-2">
                  <Sunset className="size-4 text-gold" aria-hidden /> Sunset {sunTimes(now).sunset}
                </p>
              </div>
            </Reveal>

            {routes.map((r, i) => (
              <Reveal key={r.title} delay={i * 0.06} className="flex gap-4 rounded-[1.5rem] border border-line bg-card p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-gold/15 text-accent">
                  <r.icon className="size-5" aria-hidden />
                </span>
                <span>
                  <span className="flex items-baseline gap-2">
                    <span className="font-serif text-xl">{r.title}</span>
                    <span className="text-xs text-accent">{r.time}</span>
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-muted">{r.detail}</span>
                </span>
              </Reveal>
            ))}
          </div>
        </div>
        <p className="mt-6 text-xs text-muted">
          SHINE is a fictional resort. The pin marks an illustrative, undeveloped stretch of Ngwe Saung Beach; travel times are approximate.
        </p>
      </div>
    </section>
  )
}

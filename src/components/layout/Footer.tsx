import { ArrowUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { scrollToTop } from '../../lib/scroll'
import { WaveEdge } from '../fx/Decor'
import { Logo } from './Logo'
import { navItems } from './Header'

export function Footer() {
  return (
    <>
    <WaveEdge color="var(--color-midnight)" className="relative z-10 -mb-px -mt-16 md:-mt-24" />
    <footer className="relative overflow-hidden bg-midnight text-pearl">
      <div aria-hidden className="pointer-events-none absolute bottom-0 left-1/2 size-[56rem] -translate-x-1/2 translate-y-1/2 animate-[lantern_7s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgb(199_166_106/0.14),transparent_60%)]" />
      <div className="container-x relative py-20 md:py-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo className="items-start" />
            <p className="mt-8 max-w-sm font-serif text-3xl leading-tight text-pearl/90">
              Stay by the sea. <em className="text-gold">Discover beyond the shore.</em>
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 md:col-span-7 md:grid-cols-3">
            <div>
              <p className="eyebrow mb-5 text-gold">Explore</p>
              <ul className="space-y-3 text-sm text-pearl/75">
                {navItems.map((n) => (
                  <li key={n.to}>
                    <Link className="link-underline hover:text-pearl" to={n.to}>
                      {n.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-5 text-gold">Plan</p>
              <ul className="space-y-3 text-sm text-pearl/75">
                <li><Link className="link-underline hover:text-pearl" to="/book">Book your stay</Link></li>
                <li><Link className="link-underline hover:text-pearl" to="/stay#packages">Packages</Link></li>
                <li><Link className="link-underline hover:text-pearl" to="/reservations">My reservations</Link></li>
                <li><Link className="link-underline hover:text-pearl" to="/experiences/custom-escape">Concierge</Link></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <p className="eyebrow mb-5 text-gold">Find us</p>
              <address className="space-y-3 text-sm not-italic leading-relaxed text-pearl/75">
                <p>Ngwe Saung Beach<br />Ayeyarwady Region, Myanmar</p>
                <p>Around 5 hours by road from Yangon</p>
                <p className="text-pearl/50">Fictional address — demo only</p>
              </address>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-2 border-t border-pearl/10 pt-8 sm:flex-row sm:items-baseline sm:justify-between">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.25em] text-pearl/50">Designed & developed by</p>
          <a
            href="https://github.com/Dev-By-HumbleKids"
            target="_blank"
            rel="noreferrer"
            className="group font-serif text-2xl text-pearl transition hover:text-gold md:text-3xl"
          >
            KoonSett <span className="italic text-pearl/60 transition group-hover:text-gold/80">(Win Thant Aung)</span>
          </a>
        </div>

        <div className="mt-8 border-t border-pearl/10 pt-8 text-xs leading-relaxed text-pearl/55 md:flex md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} SHINE is a <strong className="text-pearl/80">fictional resort</strong> created for a frontend portfolio. All content, prices and
            availability are demonstration data.
          </p>
          <div className="mt-3 flex items-center gap-6 md:mt-0">
            <p>Photography via Unsplash.</p>
            <button onClick={() => scrollToTop(false)} className="group flex items-center gap-2 uppercase tracking-[0.2em] text-pearl/70 hover:text-pearl">
              Back to top
              <span className="grid size-9 place-items-center rounded-full border border-pearl/25 transition group-hover:-translate-y-1 group-hover:border-gold group-hover:text-gold">
                <ArrowUp className="size-4" aria-hidden />
              </span>
            </button>
          </div>
        </div>
      </div>
      <p aria-hidden className="pointer-events-none select-none text-center font-serif text-[24vw] leading-[0.75] text-pearl/[0.04]">
        SHINE
      </p>
    </footer>
    </>
  )
}

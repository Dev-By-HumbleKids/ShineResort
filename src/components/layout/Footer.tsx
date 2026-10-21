import { Link } from 'react-router-dom'
import { Logo } from './Logo'
import { navItems } from './Header'

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-midnight text-pearl">
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

        <div className="mt-20 border-t border-pearl/10 pt-8 text-xs leading-relaxed text-pearl/55 md:flex md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} SHINE is a <strong className="text-pearl/80">fictional resort</strong> created for a frontend portfolio. All content, prices and
            availability are demonstration data.
          </p>
          <p className="mt-3 md:mt-0">Photography via Unsplash.</p>
        </div>
      </div>
      <p aria-hidden className="pointer-events-none select-none text-center font-serif text-[24vw] leading-[0.75] text-pearl/[0.04]">
        SHINE
      </p>
    </footer>
  )
}

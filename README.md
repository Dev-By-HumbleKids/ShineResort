# SHINE — Luxury Beach Resort & Island Escape

> *“Where the Ocean Meets Extraordinary.”*
> Stay by the sea. Discover beyond the shore.

A frontend portfolio project: the website of **SHINE**, a **fictional** five-star beachfront resort in Ngwe Saung, Myanmar. It combines editorial luxury-hospitality design, cinematic motion, two hand-built 3D scenes and a complete (simulated) booking experience for rooms, island adventures, dining and spa.

> ⚠️ **SHINE does not exist.** Its history, founders, rooms, prices, availability, menus, reviews and awards are invented demonstration content. No real booking, payment or email is ever made.

---

## Highlights

| Area | What it shows |
| --- | --- |
| **Cinematic hero** | Full-bleed golden-hour photography with Ken Burns + scroll parallax, letter-by-letter wordmark reveal, integrated stay search |
| **3D Resort Island** | Stylised Three.js model of the whole property — drag to orbit, glowing markers link to villas, dining, spa, jetty, horse riding and *Pearl Cay* |
| **3D “dollhouse” villas** | Every room type is generated from data as a cut-away model (roof lifts, stilts over the lagoon, private pools, two storeys) with numbered hotspots linked to real photography — loaded only on demand |
| **Day ↔ Night** | One toggle switches the whole site *and* the 3D lighting from sunlit shore to lantern-lit night (stars, glowing windows, lighthouse beacon) |
| **Stay search & availability** | Date / guest / room validation, deterministic demo inventory, *Available · Limited · Sold Out · Request Required* states, season & weekend pricing, filters and sorting |
| **Room booking flow** | 5 steps — dates → room → extras → guest details → review — with an itemised, transparent price summary and a generated booking reference |
| **Beyond the Shore** | 13 bookable experiences (island excursion, boat charter, beach horse riding, sunset cruise, snorkelling…) with working category filters, packages, add-ons, participant limits, weather notes and *instant vs. concierge* confirmation |
| **Dining** | Four venues, an animated menu explorer (8 sections + dietary filters) and table reservations |
| **Lumina Spa** | Calm, warm-neutral design with a treatment menu and appointment form |
| **Our Story** | Scroll-driven word reveal, sticky timeline 1968 → today, values, interactive SVG site plan + architectural gallery |
| **Gallery** | Filterable masonry with an accessible lightbox (← → Esc) |
| **My Reservations** | Look up a booking by reference + last name; status timeline; guest data hidden from the device list |

## Tech stack

- **React 19 + TypeScript + Vite 6**
- **Tailwind CSS v4** with brand design tokens (`src/index.css`)
- **Framer Motion** — reveals, masks, page & layout transitions (respects *reduced motion*)
- **Three.js** — custom render-on-demand stage, pauses off-screen (`src/three/`)
- **Lenis** smooth scrolling (disabled for reduced motion)
- **React Router** (`HashRouter` so deep links work on GitHub Pages)
- **lucide-react** icons · Google Fonts *Cormorant Garamond* + *Manrope*

No backend: demo reservations are stored in the visitor’s `localStorage`.

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build in dist/
npm run preview    # serve the production build
```

Requires Node 18+.

### Deploy to GitHub Pages

The build uses relative asset paths (`base: './'`) and hash routing, so the contents of `dist/` can be published as-is — e.g. with the *GitHub Pages* action or by pushing `dist/` to a `gh-pages` branch.

## Project structure

```
src/
  data/          rooms, experiences, dining, spa, packages, story, gallery, images (typed mock data)
  lib/           availability engine, pricing & fees, dates, reservations store, smooth scroll
  context/       Day/Night theme, shared stay search
  three/         stage (renderer, lights, hotspots, on-demand loop), island + villa builders
  components/    layout, booking forms, room cards, UI primitives (modal, lightbox, tilt card…)
  pages/         Home, Stay, RoomDetail, Experiences, Dining, Wellness, Story, Gallery, Book, Reservations
```

## Design system

| Token | Hex | Use |
| --- | --- | --- |
| Ocean Midnight | `#102C35` | premium / immersive sections |
| Deep Teal | `#164B50` | ocean adventures |
| Lagoon Blue | `#4D8990` | “request” states, accents |
| Champagne Gold | `#C7A66A` | restrained highlights, CTAs |
| Pearl White | `#F7F4ED` | editorial background |
| Warm Sand | `#E9DDC9` | secondary surfaces |
| Palm Green | `#536C55` | “available”, nature |
| Charcoal | `#202A2B` | body text |

Headlines use an elegant serif; UI and body copy use a modern sans-serif with spaced uppercase labels.

## Accessibility & performance

- Semantic landmarks, skip link, labelled forms with inline errors and focus on the first invalid field
- Focus-trapped dialogs and lightbox with Escape/arrow keys and focus restore
- Status badges combine icon + text (never colour alone)
- `prefers-reduced-motion` disables smooth scroll, parallax loops and water animation
- Responsive Unsplash images (`srcset`/`sizes`), lazy loading, route-level code splitting
- Three.js (~130 kB gzip) is only downloaded when a 3D scene is about to appear; scenes render only while visible
- On touch devices the 3D scenes don’t hijack page scrolling — rotation uses on-screen buttons

## Testing performed

Manual checks in a Chromium preview during development:

- `tsc -b` and `vite build` pass with no errors
- No horizontal overflow on any route at 375 px width
- Room booking flow end-to-end: validation errors, price calculation (verified by hand), terms checkbox, reference generation
- Reservation lookup (wrong / right last name), status timeline, guest names absent from device list
- Experience filters, package / participant / add-on pricing, validation and confirmation
- Menu tabs and dietary filters, table reservation, spa booking pre-selection
- Gallery filter + lightbox keyboard navigation
- 3D island and villa scenes in both day and night themes; no console errors

Not tested: Safari/Firefox, real mobile hardware, screen-reader walkthroughs.

## Credits

- Photography: [Unsplash](https://unsplash.com) (Unsplash License), used illustratively for a fictional brand
- Brand, copy, 3D models and code: original work for this portfolio project

## License

MIT for the code. Photos remain under their respective Unsplash licenses.

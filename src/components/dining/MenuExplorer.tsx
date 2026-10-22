import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Flame, Leaf, Search, Sparkles, Wheat, Wine, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { menu, menuCategories } from '../../data/dining'
import type { MenuCategory, MenuItem } from '../../data/types'
import { money } from '../../lib/pricing'
import { scrollToEl } from '../../lib/scroll'
import { SectionHeading } from '../ui/bits'
import { Img } from '../ui/Img'
import { Modal } from '../ui/Modal'
import { TiltCard } from '../ui/TiltCard'

type Tab = 'Chef’s Picks' | MenuCategory
type Diet = 'all' | 'V' | 'VG' | 'GF'

const tabs: Tab[] = ['Chef’s Picks', ...menuCategories]
const diets: [Diet, string][] = [
  ['all', 'Everything'],
  ['V', 'Vegetarian'],
  ['VG', 'Vegan'],
  ['GF', 'Gluten-free'],
]

const matchesDiet = (m: MenuItem, d: Diet) => d === 'all' || !!m.tags?.includes(d) || (d === 'V' && !!m.tags?.includes('VG'))

function DietIcons({ m, className = '' }: { m: MenuItem; className?: string }) {
  return (
    <span className={`flex items-center gap-1.5 ${className}`}>
      {m.tags?.includes('VG') ? (
        <span title="Vegan" className="grid size-6 place-items-center rounded-full bg-palm/90 text-pearl"><Leaf className="size-3" aria-label="Vegan" /></span>
      ) : m.tags?.includes('V') ? (
        <span title="Vegetarian" className="grid size-6 place-items-center rounded-full bg-palm/70 text-pearl"><Leaf className="size-3" aria-label="Vegetarian" /></span>
      ) : null}
      {m.tags?.includes('GF') && (
        <span title="Gluten-free" className="grid size-6 place-items-center rounded-full bg-sand/90 text-charcoal"><Wheat className="size-3" aria-label="Gluten-free" /></span>
      )}
      {m.tags?.includes('Spicy') && (
        <span title="Spicy" className="grid size-6 place-items-center rounded-full bg-[#b4472f]/90 text-pearl"><Flame className="size-3" aria-label="Spicy" /></span>
      )}
    </span>
  )
}

/** Tidewater's menu as an editorial grid of photo cards with a quick-view. */
export function MenuExplorer() {
  const [params, setParams] = useSearchParams()
  const initial = params.get('menu') as MenuCategory | null
  const [tab, setTab] = useState<Tab>(initial && menuCategories.includes(initial) ? initial : 'Chef’s Picks')
  const [diet, setDiet] = useState<Diet>('all')
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<MenuItem | null>(null)

  const q = query.trim().toLowerCase()
  const items = useMemo(() => {
    const base = q
      ? menu.filter((m) => `${m.name} ${m.description} ${m.category}`.toLowerCase().includes(q))
      : tab === 'Chef’s Picks'
        ? menu.filter((m) => m.tags?.includes('Signature'))
        : menu.filter((m) => m.category === tab)
    return base.filter((m) => matchesDiet(m, diet))
  }, [tab, diet, q])

  const select = (t: Tab) => {
    setTab(t)
    setQuery('')
    if (t === 'Chef’s Picks') setParams({}, { replace: true, preventScrollReset: true })
    else setParams({ menu: t }, { replace: true, preventScrollReset: true })
  }

  const count = (t: Tab) => (t === 'Chef’s Picks' ? menu.filter((m) => m.tags?.includes('Signature')).length : menu.filter((m) => m.category === t).length)

  // quick-view navigation stays within the list the guest is browsing
  const idx = open ? items.findIndex((m) => m.name === open.name) : -1
  const step = (d: number) => items.length && setOpen(items[(idx + d + items.length) % items.length])
  const pairedDish = open?.pairing ? menu.find((m) => m.name === open.pairing) : undefined

  return (
    <section id="menu" className="relative scroll-mt-20 overflow-hidden bg-midnight py-24 text-pearl md:py-32" aria-labelledby="menu-h">
      <div aria-hidden className="pointer-events-none absolute -left-40 top-20 size-[36rem] rounded-full bg-[radial-gradient(circle,rgb(199_166_106/0.12),transparent_65%)]" />
      <div className="container-x relative">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div id="menu-h" className="lg:col-span-7">
            <SectionHeading
              light
              eyebrow="Tidewater · the menu"
              title={
                <>
                  Taste the <em className="text-gold">coast.</em>
                </>
              }
              intro="The morning’s catch, Pathein’s markets and recipes three generations old. Tap any dish for the chef’s note and a pairing."
            />
          </div>
          <div className="lg:col-span-5">
            <label className="relative block">
              <span className="sr-only">Search the menu</span>
              <Search className="pointer-events-none absolute left-5 top-1/2 size-4 -translate-y-1/2 text-pearl/50" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search dishes, ingredients…"
                className="h-14 w-full rounded-full border border-pearl/15 bg-pearl/5 pl-12 pr-12 text-sm text-pearl placeholder:text-pearl/40 outline-none transition focus:border-gold focus:bg-pearl/10"
              />
              {query && (
                <button type="button" onClick={() => setQuery('')} className="absolute right-4 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-full text-pearl/60 hover:bg-pearl/10" aria-label="Clear search">
                  <X className="size-4" />
                </button>
              )}
            </label>
          </div>
        </div>

        <div role="tablist" aria-label="Menu sections" className="scrollbar-none -mx-5 mt-12 flex gap-1 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0">
          {tabs.map((t) => {
            const active = !q && t === tab
            return (
              <button
                key={t}
                role="tab"
                aria-selected={active}
                aria-controls="menu-panel"
                onClick={() => select(t)}
                className={`relative flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm transition ${active ? 'text-midnight' : 'text-pearl/70 hover:text-pearl'}`}
              >
                {active && <motion.span layoutId="menu-pill" className="absolute inset-0 rounded-full bg-gold" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />}
                <span className="relative flex items-center gap-1.5">
                  {t === 'Chef’s Picks' && <Sparkles className="size-3.5" aria-hidden />}
                  {t}
                </span>
                <span className={`relative text-[0.65rem] tabular-nums ${active ? 'text-midnight/60' : 'text-pearl/35'}`}>{count(t)}</span>
              </button>
            )
          })}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2 text-xs" role="group" aria-label="Dietary filter">
            <span className="text-pearl/50">Dietary:</span>
            {diets.map(([d, l]) => (
              <button
                key={d}
                aria-pressed={diet === d}
                onClick={() => setDiet(d)}
                className={`rounded-full border px-3 py-1.5 transition ${diet === d ? 'border-gold bg-gold/10 text-gold' : 'border-pearl/15 text-pearl/70 hover:border-pearl/40'}`}
              >
                {l}
              </button>
            ))}
          </div>
          <p className="text-xs text-pearl/50" aria-live="polite">
            {q ? `${items.length} result${items.length === 1 ? '' : 's'} for “${query.trim()}”` : `${items.length} dish${items.length === 1 ? '' : 'es'}`}
          </p>
        </div>

        <div id="menu-panel" role="tabpanel" aria-label={q ? 'Search results' : tab} className="mt-10 min-h-[24rem]">
          {items.length === 0 ? (
            <div className="grid place-items-center rounded-[2rem] border border-dashed border-pearl/15 px-6 py-20 text-center">
              <p className="font-serif text-3xl">Nothing on the menu matches that.</p>
              <button
                onClick={() => {
                  setDiet('all')
                  setQuery('')
                }}
                className="btn btn-gold mt-6"
              >
                Show everything
              </button>
            </div>
          ) : (
            <motion.ul layout className="grid auto-rows-[18rem] grid-cols-1 gap-5 sm:grid-cols-2 md:auto-rows-[20rem] lg:grid-cols-3 xl:grid-cols-4">
              <AnimatePresence mode="popLayout">
                {items.map((m, i) => {
                  const feature = i === 0 && items.length > 2
                  return (
                    <motion.li
                      layout
                      key={m.name}
                      initial={{ opacity: 0, y: 24, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                      className={feature ? 'sm:col-span-2 sm:row-span-2' : ''}
                    >
                      <TiltCard max={4} className="h-full">
                        <button
                          onClick={() => setOpen(m)}
                          data-cursor="Taste"
                          className="group relative block h-full w-full overflow-hidden rounded-[1.6rem] text-left ring-1 ring-pearl/10 transition hover:ring-gold/60"
                          aria-label={`${m.name}, ${money(m.price)}. View details`}
                        >
                          <Img name={m.image} alt={m.name} width={feature ? 1200 : 700} sizes={feature ? '(min-width:1024px) 50vw, 100vw' : '(min-width:1280px) 25vw, (min-width:640px) 50vw, 100vw'} className="img-cover group-hover:scale-110" />
                          <span className="absolute inset-0 bg-linear-to-t from-midnight via-midnight/35 to-transparent transition duration-500 group-hover:via-midnight/50" />

                          <span className="absolute inset-x-4 top-4 flex items-start justify-between gap-2">
                            <span className="flex flex-col items-start gap-2">
                              {m.tags?.includes('Signature') && (
                                <span className="flex items-center gap-1.5 rounded-full bg-gold px-2.5 py-1 text-[0.58rem] font-bold uppercase tracking-[0.18em] text-midnight shadow">
                                  <Sparkles className="size-3" aria-hidden /> Signature
                                </span>
                              )}
                              <DietIcons m={m} />
                            </span>
                            <span className="rounded-full border border-pearl/25 bg-midnight/50 px-3 py-1 font-serif text-lg tabular-nums text-pearl backdrop-blur-md">{money(m.price)}</span>
                          </span>

                          <span className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                            {q && <span className="eyebrow mb-1 block text-[0.55rem] text-gold">{m.category}</span>}
                            <span className={`block font-serif leading-tight text-pearl ${feature ? 'text-4xl md:text-5xl' : 'text-2xl'}`}>{m.name}</span>
                            <span className={`mt-2 block text-sm leading-relaxed text-pearl/75 ${feature ? 'max-w-md' : 'line-clamp-2'}`}>{m.description}</span>
                            {m.pairing && (
                              <span className="mt-3 flex max-h-0 items-center gap-1.5 overflow-hidden text-xs text-gold opacity-0 transition-all duration-500 group-hover:max-h-6 group-hover:opacity-100 group-focus-visible:max-h-6 group-focus-visible:opacity-100 max-md:max-h-6 max-md:opacity-100">
                                <Wine className="size-3.5" aria-hidden /> Pairs with {m.pairing}
                              </span>
                            )}
                          </span>
                        </button>
                      </TiltCard>
                    </motion.li>
                  )
                })}
              </AnimatePresence>
            </motion.ul>
          )}
        </div>
        <p className="mt-8 text-xs text-pearl/45">Fictional demonstration menu with illustrative photography. Prices in USD; dishes are not served at a real restaurant.</p>
      </div>

      <Modal open={!!open} onClose={() => setOpen(null)} title={open?.name ?? ''} subtitle={open ? `${open.category} · Tidewater` : ''} variant="center" wide>
        {open && (
          <AnimatePresence mode="wait">
            <motion.div key={open.name} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }} className="grid gap-8 md:grid-cols-2">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl md:aspect-auto md:min-h-[26rem]">
                <Img name={open.image} alt={open.name} width={1000} sizes="(min-width:768px) 420px, 90vw" className="img-cover" />
                {open.tags?.includes('Signature') && (
                  <span className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-midnight">
                    <Sparkles className="size-3" aria-hidden /> Chef’s signature
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <p className="font-serif text-5xl text-accent">{money(open.price)}</p>
                <p className="mt-4 leading-relaxed">{open.description}</p>
                {open.story && (
                  <blockquote className="mt-6 border-l-2 border-gold pl-4 font-serif text-xl italic leading-snug text-muted">“{open.story}”</blockquote>
                )}
                <div className="mt-6 flex flex-wrap gap-2 text-xs">
                  {open.tags?.filter((t) => t !== 'Signature').map((t) => (
                    <span key={t} className="rounded-full border border-line px-3 py-1">
                      {{ V: 'Vegetarian', VG: 'Vegan', GF: 'Gluten-free', Spicy: 'Spicy' }[t as 'V' | 'VG' | 'GF' | 'Spicy']}
                    </span>
                  ))}
                </div>
                {open.pairing && (
                  <div className="mt-6 rounded-2xl border border-line bg-bg-alt/60 p-4">
                    <p className="eyebrow flex items-center gap-2 text-accent">
                      <Wine className="size-3.5" aria-hidden /> Perfect pairing
                    </p>
                    {pairedDish ? (
                      <button onClick={() => setOpen(pairedDish)} className="group mt-3 flex w-full items-center gap-3 text-left">
                        <span className="size-14 shrink-0 overflow-hidden rounded-xl">
                          <Img name={pairedDish.image} alt="" width={200} sizes="56px" className="img-cover group-hover:scale-110" />
                        </span>
                        <span>
                          <span className="block font-serif text-xl group-hover:text-accent">{pairedDish.name}</span>
                          <span className="text-xs text-muted">{pairedDish.category} · {money(pairedDish.price)}</span>
                        </span>
                        <ChevronRight className="ml-auto size-4 text-muted transition group-hover:translate-x-1" aria-hidden />
                      </button>
                    ) : (
                      <p className="mt-2 font-serif text-xl">{open.pairing}</p>
                    )}
                  </div>
                )}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-8">
                  <div className="flex gap-2">
                    <button onClick={() => step(-1)} className="grid size-11 place-items-center rounded-full border border-line hover:border-ink" aria-label="Previous dish">
                      <ChevronLeft className="size-4" />
                    </button>
                    <button onClick={() => step(1)} className="grid size-11 place-items-center rounded-full border border-line hover:border-ink" aria-label="Next dish">
                      <ChevronRight className="size-4" />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setOpen(null)
                      setTimeout(() => scrollToEl(document.getElementById('reserve')), 350)
                    }}
                    className="btn btn-gold"
                  >
                    Reserve a table
                  </button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </Modal>
    </section>
  )
}

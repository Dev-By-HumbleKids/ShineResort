import { AnimatePresence, motion } from 'framer-motion'
import { Expand } from 'lucide-react'
import { useMemo, useState } from 'react'
import { PageHero } from '../components/layout/PageHero'
import { Img } from '../components/ui/Img'
import { Lightbox } from '../components/ui/Lightbox'
import { gallery, galleryCategories } from '../data/gallery'

export default function Gallery() {
  const [cat, setCat] = useState<(typeof galleryCategories)[number]>('All')
  const [open, setOpen] = useState<number | null>(null)
  const items = useMemo(() => (cat === 'All' ? gallery : gallery.filter((g) => g.category === cat)), [cat])

  return (
    <>
      <PageHero eyebrow="Gallery" title="Moments by the Bay of Bengal." image="overwaterAerial" intro="Golden hours, quiet mornings and the spaces in between." />
      <section className="container-x py-20 md:py-28" aria-label="Photo gallery">
        <div className="scrollbar-none -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:px-0" role="group" aria-label="Filter photos">
          {galleryCategories.map((c) => (
            <button key={c} className="chip shrink-0" aria-pressed={cat === c} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          {items.length} photos
        </p>

        <motion.ul layout className="mt-10 grid auto-rows-[180px] grid-flow-dense grid-cols-2 gap-3 md:auto-rows-[220px] md:grid-cols-4 md:gap-4">
          <AnimatePresence mode="popLayout">
            {items.map((g, i) => (
              <motion.li
                layout
                key={g.image}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.5, delay: Math.min(i, 8) * 0.03 }}
                className={g.shape === 'tall' ? 'row-span-2' : g.shape === 'wide' ? 'col-span-2' : ''}
              >
                <button onClick={() => setOpen(i)} data-cursor="View" className="group relative h-full w-full overflow-hidden rounded-2xl" aria-label={`Open photo: ${g.alt}`}>
                  <Img name={g.image} alt={g.alt} sizes="(min-width:768px) 25vw, 50vw" width={900} className="img-cover transition duration-[1.4s] group-hover:scale-110" />
                  <span className="absolute inset-0 bg-midnight/0 transition group-hover:bg-midnight/30" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-pearl/90 px-2.5 py-1 text-[0.6rem] font-semibold uppercase tracking-[0.15em] text-midnight opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100">
                    {g.category}
                  </span>
                  <Expand className="absolute right-3 top-3 size-5 text-pearl opacity-0 transition group-hover:opacity-100" aria-hidden />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
        <p className="mt-10 text-xs text-muted">Illustrative photography from Unsplash, used to represent the fictional SHINE resort.</p>
      </section>
      <Lightbox items={items} index={open} onChange={setOpen} onClose={() => setOpen(null)} />
    </>
  )
}

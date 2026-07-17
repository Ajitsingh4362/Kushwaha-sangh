import { useState } from 'react'
import { ImageIcon } from 'lucide-react'
import PageHero from '../components/PageHero'
import { galleryCategories } from '../data/content'

export default function Gallery() {
  const [active, setActive] = useState('all')

  const tiles = galleryCategories
    .filter((c) => active === 'all' || c.id === active)
    .flatMap((c) => Array.from({ length: c.count }).map((_, i) => ({ category: c.label, key: `${c.id}-${i}` })))

  return (
    <>
      <PageHero
        eyebrow="In Pictures"
        title="Gallery"
        blurb="Hostel life, Sangh events, felicitation ceremonies and health camps."
      />

      <section className="mx-auto max-w-6xl px-5 py-16 lg:px-8">
        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={() => setActive('all')}
            className={`border px-4 py-2 text-sm font-medium transition ${
              active === 'all'
                ? 'border-saffron bg-saffron text-maroon-deep'
                : 'border-gold/40 text-ink hover:border-saffron'
            }`}
          >
            All
          </button>
          {galleryCategories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`border px-4 py-2 text-sm font-medium transition ${
                active === c.id
                  ? 'border-saffron bg-saffron text-maroon-deep'
                  : 'border-gold/40 text-ink hover:border-saffron'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {tiles.map((t) => (
            <div
              key={t.key}
              className="flex aspect-square flex-col items-center justify-center gap-1.5 border border-dashed border-gold/50 bg-cream-deep/50 text-center text-stone/70"
            >
              <ImageIcon size={22} strokeWidth={1.5} />
              <span className="px-2 text-[0.7rem]">{t.category}</span>
            </div>
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-stone">
          Placeholder tiles — replace with real photos once the Sangh shares them.
        </p>
      </section>
    </>
  )
}

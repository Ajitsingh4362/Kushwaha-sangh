import { useState } from 'react'
import { ImageIcon } from 'lucide-react'
import PageHero from '../components/PageHero'
import { galleryCategories } from '../data/content'
import a1 from '../assets/activities/activity-1.jpg'
import a2 from '../assets/activities/activity-2.jpg'
import a3 from '../assets/activities/activity-3.jpg'
import a4 from '../assets/activities/activity-4.jpg'
import a5 from '../assets/activities/activity-5.jpg'
import a6 from '../assets/activities/activity-6.jpg'
import a7 from '../assets/activities/activity-7.jpg'
import a8 from '../assets/activities/activity-8.jpg'

const realPhotos = [
  { src: a1, category: 'ceremonies', label: 'Felicitation Ceremonies' },
  { src: a2, category: 'events', label: 'Sangh Events' },
  { src: a3, category: 'ceremonies', label: 'Felicitation Ceremonies' },
  { src: a4, category: 'events', label: 'Sangh Events' },
  { src: a5, category: 'ceremonies', label: 'Felicitation Ceremonies' },
  { src: a6, category: 'ceremonies', label: 'Felicitation Ceremonies' },
  { src: a7, category: 'ceremonies', label: 'Felicitation Ceremonies' },
  { src: a8, category: 'events', label: 'Sangh Events' },
]

export default function Gallery() {
  const [active, setActive] = useState('all')

  const realTiles = realPhotos
    .filter((p) => active === 'all' || p.category === active)
    .map((p, i) => ({ key: `real-${i}`, ...p }))

  const placeholderTiles = galleryCategories
    .filter((c) => active === 'all' || c.id === active)
    .filter((c) => c.id !== 'ceremonies' && c.id !== 'events')
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
          {realTiles.map((t) => (
            <div key={t.key} className="aspect-square overflow-hidden border border-gold/40 bg-cream-deep/50">
              <img src={t.src} alt={t.label} className="h-full w-full object-cover" loading="lazy" />
            </div>
          ))}
          {placeholderTiles.map((t) => (
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
          Hostel and health-camp tiles are still placeholders — replace once the Sangh shares those photos.
        </p>
      </section>
    </>
  )
}

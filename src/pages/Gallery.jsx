import { useEffect, useState } from 'react'
import { ImageIcon, X, ChevronLeft, ChevronRight } from 'lucide-react'
import PageHero from '../components/PageHero'
import { galleryCategories } from '../data/content'
import { supabase } from '../lib/supabase'
import a1 from '../assets/activities/activity-1.jpg'
import a2 from '../assets/activities/activity-2.jpg'
import a3 from '../assets/activities/activity-3.jpg'
import a4 from '../assets/activities/activity-4.jpg'
import a5 from '../assets/activities/activity-5.jpg'
import a6 from '../assets/activities/activity-6.jpg'
import a7 from '../assets/activities/activity-7.jpg'
import a8 from '../assets/activities/activity-8.jpg'

const seedPhotos = [
  { src: a1, category: 'ceremonies', label: 'सम्मान समारोह' },
  { src: a2, category: 'events', label: 'संघ के कार्यक्रम' },
  { src: a3, category: 'ceremonies', label: 'सम्मान समारोह' },
  { src: a4, category: 'events', label: 'संघ के कार्यक्रम' },
  { src: a5, category: 'ceremonies', label: 'सम्मान समारोह' },
  { src: a6, category: 'ceremonies', label: 'सम्मान समारोह' },
  { src: a7, category: 'ceremonies', label: 'सम्मान समारोह' },
  { src: a8, category: 'events', label: 'संघ के कार्यक्रम' },
]

const categoryLabels = Object.fromEntries(galleryCategories.map((c) => [c.id, c.label]))

const SHOWCASE_SIZE = 12
const ROTATE_INTERVAL_MS = 15000

function shuffle(arr) {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export default function Gallery() {
  const [active, setActive] = useState('all')
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [dbPhotos, setDbPhotos] = useState([])
  const [rotateTick, setRotateTick] = useState(0)

  useEffect(() => {
    function load() {
      supabase
        .from('gallery_photos')
        .select('*')
        .order('created_at', { ascending: false })
        .then(({ data }) => setDbPhotos(data || []))
    }
    load()

    const channel = supabase
      .channel('public-gallery-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_photos' }, load)
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // Every so often, bring a fresh rotating selection to the front page
  // view — the admin panel still has the complete library, this is
  // just what the public "All" view surfaces at any given moment.
  useEffect(() => {
    const timer = setInterval(() => setRotateTick((t) => t + 1), ROTATE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [])

  const allPhotos = [
    ...dbPhotos.map((p) => ({
      key: `db-${p.id}`,
      src: p.url,
      category: p.category,
      label: p.caption || categoryLabels[p.category] || p.category,
    })),
    ...seedPhotos.map((p, i) => ({ key: `seed-${i}`, ...p })),
  ]

  const filtered = allPhotos.filter((p) => active === 'all' || p.category === active)

  // Only rotate/limit the "All" view when there's more to show than
  // fits — a specific category filter shows everything in it.
  const tiles =
    active === 'all' && filtered.length > SHOWCASE_SIZE
      ? shuffle(filtered).slice(0, SHOWCASE_SIZE)
      : filtered

  const lightbox = lightboxIndex !== null ? tiles[lightboxIndex] : null

  function showNext() {
    setLightboxIndex((i) => (i + 1) % tiles.length)
  }
  function showPrev() {
    setLightboxIndex((i) => (i - 1 + tiles.length) % tiles.length)
  }

  useEffect(() => {
    if (lightboxIndex === null) return
    function handleKey(e) {
      if (e.key === 'ArrowRight') showNext()
      if (e.key === 'ArrowLeft') showPrev()
      if (e.key === 'Escape') setLightboxIndex(null)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightboxIndex, tiles.length])

  return (
    <>
      <PageHero
        eyebrow="तस्वीरों में"
        title="गैलरी"
        blurb="संघ के कार्यक्रम, सम्मान समारोह और स्वास्थ्य शिविर।"
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
            सभी
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

        {active === 'all' && filtered.length > SHOWCASE_SIZE && (
          <p className="mt-3 text-xs text-stone">कुछ चुनी हुई तस्वीरें दिखाई जा रही हैं, जो थोड़ी-थोड़ी देर में बदलती रहती हैं।</p>
        )}

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {tiles.map((t, i) => (
            <button
              key={t.key}
              onClick={() => setLightboxIndex(i)}
              className="aspect-square overflow-hidden border border-gold/40 bg-cream-deep/50 transition hover:opacity-90"
            >
              <img src={t.src} alt={t.label} className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
          {tiles.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-1.5 py-10 text-center text-stone/70">
              <ImageIcon size={22} strokeWidth={1.5} />
              <span className="text-sm">इस श्रेणी में अभी कोई तस्वीर नहीं है।</span>
            </div>
          )}
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxIndex(null)}
            aria-label="बंद करें"
            className="absolute right-5 top-5 text-cream-paper hover:text-saffron"
          >
            <X size={28} />
          </button>

          {tiles.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                showPrev()
              }}
              aria-label="पिछली तस्वीर"
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-cream-paper hover:bg-black/60 sm:left-5"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          <img
            src={lightbox.src}
            alt={lightbox.label}
            className="max-h-[85vh] max-w-full rounded-sm object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {tiles.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                showNext()
              }}
              aria-label="अगली तस्वीर"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-cream-paper hover:bg-black/60 sm:right-5"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>
      )}
    </>
  )
}

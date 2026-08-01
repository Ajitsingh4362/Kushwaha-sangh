import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Calendar, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import PageHero from '../components/PageHero'
import { PROGRAM_CATEGORIES } from '../components/ProgramsPanel'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}

function ProgramCard({ program }) {
  const cover = program.thumbnail_url || program.photos?.[0]
  const coverIsVideo = program.thumbnail_url && program.thumbnail_type === 'video'

  return (
    <Link
      to={`/programs/${program.id}`}
      className="ledger-plaque group flex flex-col overflow-hidden text-left transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="aspect-video w-full overflow-hidden bg-cream-paper">
        {cover ? (
          coverIsVideo ? (
            <video src={cover} muted playsInline className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
          ) : (
            <img
              src={cover}
              alt={program.title}
              className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
            />
          )
        ) : (
          <div className="grid h-full place-items-center text-stone/50">No photo</div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="eyebrow text-maroon/70">{program.category}</p>
        <p className="font-display text-base font-semibold text-maroon-deep">{program.title}</p>
        <p className="flex items-center gap-1 text-xs text-stone">
          <Calendar size={12} /> {formatDate(program.program_date)}
        </p>
        {program.location && (
          <p className="flex items-center gap-1 text-xs text-stone">
            <MapPin size={12} /> {program.location}
          </p>
        )}
        {program.participant_count != null && (
          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-saffron-dark">
            <Users size={12} /> {program.participant_count} participated
          </p>
        )}
      </div>
    </Link>
  )
}

export default function Programs() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')

  useEffect(() => {
    supabase
      .from('programs')
      .select('*')
      .order('program_date', { ascending: false })
      .then(({ data }) => {
        setPrograms(data || [])
        setLoading(false)
      })
  }, [])

  const filtered = activeCategory === 'All' ? programs : programs.filter((p) => p.category === activeCategory)

  return (
    <>
      <PageHero
        eyebrow="Sangh Activities"
        title="Programs & Camps"
        blurb="Blood donation camps, health checkups, cultural events, and community drives — everything the Sangh organizes, with full details."
      />

      <section className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {['All', ...PROGRAM_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-full border px-4 py-1.5 text-xs font-medium transition ${
                activeCategory === cat
                  ? 'border-saffron bg-saffron text-maroon-deep'
                  : 'border-gold/40 text-maroon-deep hover:border-saffron'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="mt-8 text-stone">Loading programs…</p>
        ) : filtered.length === 0 ? (
          <p className="mt-8 text-stone">No programs to show yet — check back soon.</p>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

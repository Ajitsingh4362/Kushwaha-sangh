import { useEffect, useState } from 'react'
import { X, MapPin, Calendar, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'
import PageHero from '../components/PageHero'
import { PROGRAM_CATEGORIES } from '../components/ProgramsPanel'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}

function ProgramCard({ program, onOpen }) {
  return (
    <button
      onClick={() => onOpen(program)}
      className="ledger-plaque group flex flex-col overflow-hidden text-left transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="aspect-video w-full overflow-hidden bg-cream-paper">
        {program.photos?.[0] ? (
          <img
            src={program.photos[0]}
            alt={program.title}
            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
          />
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
    </button>
  )
}

function ProgramDetailModal({ program, onClose }) {
  if (!program) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="ledger-plaque max-h-[90vh] w-full max-w-2xl overflow-y-auto p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="eyebrow text-maroon/70">{program.category}</p>
            <h2 className="mt-1 font-display text-2xl font-bold text-maroon-deep">{program.title}</h2>
          </div>
          <button onClick={onClose} className="text-stone hover:text-maroon-deep">
            <X size={22} />
          </button>
        </div>

        <div className="mt-3 flex flex-wrap gap-4 text-sm text-stone">
          <span className="flex items-center gap-1">
            <Calendar size={14} /> {formatDate(program.program_date)}
          </span>
          {program.location && (
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {program.location}
            </span>
          )}
          {program.participant_count != null && (
            <span className="flex items-center gap-1 font-medium text-saffron-dark">
              <Users size={14} /> {program.participant_count} participated
            </span>
          )}
        </div>

        {program.description && <p className="mt-4 whitespace-pre-line text-sm text-ink">{program.description}</p>}

        {program.video_url && (
          <video src={program.video_url} controls className="mt-5 w-full rounded-sm border border-gold/40" />
        )}

        {program.photos?.length > 1 && (
          <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {program.photos.map((url) => (
              <img key={url} src={url} alt="" className="aspect-square w-full rounded-sm object-cover" />
            ))}
          </div>
        )}

        {program.participants?.length > 0 && (
          <div className="mt-5">
            <p className="mb-2 font-display text-sm font-semibold text-maroon-deep">
              Participants ({program.participants.length})
            </p>
            <ul className="flex flex-wrap gap-2">
              {program.participants.map((p, idx) => (
                <li key={idx} className="rounded-full border border-gold/40 bg-cream-paper px-3 py-1 text-xs text-ink">
                  {p.name}
                  {p.detail && <span className="text-stone"> · {p.detail}</span>}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Programs() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [selected, setSelected] = useState(null)

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
              <ProgramCard key={p.id} program={p} onOpen={setSelected} />
            ))}
          </div>
        )}
      </section>

      <ProgramDetailModal program={selected} onClose={() => setSelected(null)} />
    </>
  )
}

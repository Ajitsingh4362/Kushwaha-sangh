import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Calendar, MapPin, Users } from 'lucide-react'
import { supabase } from '../lib/supabase'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

export default function RecentProgramsSection() {
  const [programs, setPrograms] = useState([])

  useEffect(() => {
    supabase
      .from('programs')
      .select('*')
      .order('program_date', { ascending: false })
      .limit(3)
      .then(({ data }) => setPrograms(data || []))
  }, [])

  if (programs.length === 0) return null

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="eyebrow text-maroon/70">Sangh Activities</p>
          <h2 className="mt-2 font-display text-3xl font-bold text-maroon-deep sm:text-4xl">Recent Programs & Camps</h2>
          <p className="mt-3 text-sm text-stone">
            Blood donation camps, health checkups, and community drives organized by our members.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {programs.map((p) => {
            const cover = p.thumbnail_url || p.photos?.[0]
            const coverIsVideo = p.thumbnail_url && p.thumbnail_type === 'video'
            return (
            <Link
              key={p.id}
              to={`/programs/${p.id}`}
              className="ledger-plaque group flex flex-col overflow-hidden text-left transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <div className="aspect-video w-full overflow-hidden bg-cream-paper">
                {cover ? (
                  coverIsVideo ? (
                    <video src={cover} muted playsInline className="h-full w-full object-cover transition duration-300 group-hover:scale-105" />
                  ) : (
                    <img
                      src={cover}
                      alt={p.title}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  )
                ) : (
                  <div className="grid h-full place-items-center text-stone/50">No photo</div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-1.5 p-4">
                <p className="eyebrow text-maroon/70">{p.category}</p>
                <p className="font-display text-sm font-semibold text-maroon-deep">{p.title}</p>
                <p className="flex items-center gap-1 text-xs text-stone">
                  <Calendar size={11} /> {formatDate(p.program_date)}
                </p>
                {p.location && (
                  <p className="flex items-center gap-1 text-xs text-stone">
                    <MapPin size={11} /> {p.location}
                  </p>
                )}
                {p.participant_count != null && (
                  <p className="mt-1 flex items-center gap-1 text-xs font-medium text-saffron-dark">
                    <Users size={11} /> {p.participant_count} participated
                  </p>
                )}
              </div>
            </Link>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/programs"
            className="inline-flex items-center gap-1.5 rounded-sm border border-saffron px-5 py-2.5 text-sm font-semibold text-maroon-deep hover:bg-saffron/10"
          >
            View All Programs <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  )
}

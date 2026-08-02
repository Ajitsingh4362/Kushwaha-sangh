import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, Users, X, ChevronLeft, ChevronRight, Download } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { CornerFlourish, OrnamentDivider } from '../components/Ornament'

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
}

function Lightbox({ photos, index, onClose, onPrev, onNext }) {
  useEffect(() => {
    function onKeyDown(e) {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose, onPrev, onNext])

  if (index === null) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" onClick={onClose}>
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 text-cream-paper/80 hover:text-cream-paper"
      >
        <X size={28} />
      </button>

      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrev()
          }}
          aria-label="Previous photo"
          className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-cream-paper hover:bg-black/70 sm:left-6"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      <img
        src={photos[index]}
        alt=""
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] max-w-full rounded-sm object-contain"
      />

      {photos.length > 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          aria-label="Next photo"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-cream-paper hover:bg-black/70 sm:right-6"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {photos.length > 1 && (
        <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-sm text-cream-paper/80">
          {index + 1} / {photos.length}
        </p>
      )}
    </div>
  )
}

export default function ProgramDetail() {
  const { id } = useParams()
  const [program, setProgram] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    supabase
      .from('programs')
      .select('*')
      .eq('id', id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) setNotFound(true)
        setProgram(data)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return (
      <section className="mx-auto max-w-4xl px-5 py-20 text-center text-stone">Loading…</section>
    )
  }

  if (notFound) {
    return (
      <section className="mx-auto max-w-4xl px-5 py-20 text-center">
        <p className="text-stone">This program could not be found.</p>
        <Link to="/programs" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-maroon-deep hover:underline">
          <ArrowLeft size={15} /> Back to Programs
        </Link>
      </section>
    )
  }

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-maroon-deep py-14 text-cream-paper sm:py-18">
        <div className="bg-noise absolute inset-0 opacity-40" />
        <CornerFlourish className="absolute left-4 top-4 h-10 w-10 text-gold/70 sm:left-8 sm:top-8" />
        <CornerFlourish className="absolute right-4 top-4 h-10 w-10 -scale-x-100 text-gold/70 sm:right-8 sm:top-8" />

        <div className="relative mx-auto max-w-3xl px-5 text-center">
          <Link to="/programs" className="mb-5 inline-flex items-center gap-1.5 text-sm text-cream/80 hover:text-cream-paper">
            <ArrowLeft size={15} /> Back to Programs
          </Link>
          <p className="eyebrow text-gold-light">{program.category}</p>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-4xl">{program.title}</h1>
          <OrnamentDivider className="mx-auto mt-5 h-4 w-40 text-gold-light/70" />

          <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-sm text-cream/85">
            <span className="flex items-center gap-1.5">
              <Calendar size={15} /> {formatDate(program.program_date)}
            </span>
            {program.location && (
              <span className="flex items-center gap-1.5">
                <MapPin size={15} /> {program.location}
              </span>
            )}
            {program.participant_count != null && (
              <span className="flex items-center gap-1.5 font-medium text-saffron-light">
                <Users size={15} /> {program.participant_count} participated
              </span>
            )}
          </div>
        </div>
        <div className="ledger-rule absolute bottom-0 left-0 right-0 opacity-40" />
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-4xl px-5 py-14 lg:px-8">
        {/* Thumbnail (image or video) */}
        {program.thumbnail_url && (
          <div className="mb-8 overflow-hidden rounded-sm border border-gold/40">
            {program.thumbnail_type === 'video' ? (
              <video src={program.thumbnail_url} controls className="w-full" />
            ) : (
              <img src={program.thumbnail_url} alt={program.title} className="w-full object-cover" />
            )}
          </div>
        )}

        {program.description && (
          <p className="whitespace-pre-line text-base leading-relaxed text-ink">{program.description}</p>
        )}

        {/* Main video, if separate from thumbnail */}
        {program.video_url && (
          <div className="mt-8">
            <p className="mb-2 font-display text-lg font-semibold text-maroon-deep">Program Video</p>
            <video src={program.video_url} controls className="w-full rounded-sm border border-gold/40" />
          </div>
        )}

        {/* Photo gallery */}
        {program.photos?.length > 0 && (
          <div className="mt-10">
            <p className="mb-3 font-display text-lg font-semibold text-maroon-deep">
              Photos ({program.photos.length})
            </p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {program.photos.map((url, idx) => (
                <button
                  key={url}
                  onClick={() => setLightboxIndex(idx)}
                  className="block overflow-hidden rounded-sm border border-gold/40"
                >
                  <img src={url} alt="" className="aspect-square w-full object-cover transition hover:scale-105" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Participants */}
        {program.participants?.length > 0 && (
          <div className="mt-10">
            <p className="mb-3 font-display text-lg font-semibold text-maroon-deep">
              Participants ({program.participants.length})
            </p>
            <div className="ledger-plaque overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-cream-paper text-maroon-deep">
                  <tr>
                    <th className="px-4 py-2.5 font-semibold">#</th>
                    <th className="px-4 py-2.5 font-semibold">Name</th>
                    <th className="px-4 py-2.5 font-semibold">Detail</th>
                    <th className="px-4 py-2.5 font-semibold">Certificate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/15">
                  {program.participants.map((p, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 text-stone">{idx + 1}</td>
                      <td className="px-4 py-2 text-ink">{p.name}</td>
                      <td className="px-4 py-2 text-stone">{p.detail || '—'}</td>
                      <td className="px-4 py-2">
                        {p.certificate_url ? (
                          <a
                            href={p.certificate_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs font-medium text-maroon-deep hover:underline"
                          >
                            <Download size={12} /> Download
                          </a>
                        ) : (
                          <span className="text-xs text-stone">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {program.photos?.length > 0 && (
        <Lightbox
          photos={program.photos}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex((i) => (i - 1 + program.photos.length) % program.photos.length)}
          onNext={() => setLightboxIndex((i) => (i + 1) % program.photos.length)}
        />
      )}
    </>
  )
}


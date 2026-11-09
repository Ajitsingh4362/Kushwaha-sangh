import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Search, UserPlus, Users, X } from 'lucide-react'
import PageHero from '../components/PageHero'
import PayDuesButton from '../components/PayDuesButton'
import MembershipForm from '../components/MembershipForm'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { nameToHindi, occupationToHindi } from '../lib/toHindi'

// सदस्य page: member directory + new membership application + monthly dues.
// Directory data comes from the get_public_members() database function
// (supabase/public_members.sql): name, membership type and occupation only.

const PAGE_SIZE = 20

const TYPE_HI = {
  karyakarni: 'कार्यकारिणी',
  regular: 'सामान्य',
}

// Page numbers to show: always first and last, plus neighbours of the
// current page, with gaps marked as null.
function pageList(current, total) {
  const pages = new Set([1, total, current - 1, current, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)
  const out = []
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push(null)
    out.push(p)
  })
  return out
}

export default function Community() {
  const location = useLocation()
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(location.hash === '#join')

  // Opening /community#join (the नई सदस्यता tab) shows the form and
  // scrolls to it — every time, even if the link is clicked again.
  useEffect(() => {
    if (location.hash !== '#join') return
    setShowForm(true)
    const id = setTimeout(() => document.getElementById('join')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 120)
    return () => clearTimeout(id)
  }, [location.key, location.hash])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setFailed(true)
      setLoading(false)
      return
    }
    supabase.rpc('get_public_members').then(({ data, error }) => {
      if (error) setFailed(true)
      else setMembers(data || [])
      setLoading(false)
    })
  }, [])

  // Serial numbers follow joining order and stay fixed while searching.
  const rows = useMemo(
    () =>
      members.map((m, i) => ({
        serial: i + 1,
        name: nameToHindi(m.name),
        nameOriginal: m.name || '',
        type: TYPE_HI[m.member_type] || 'सामान्य',
        occupation: occupationToHindi(m.occupation),
      })),
    [members]
  )

  const q = query.trim().toLowerCase()
  const filtered = q
    ? rows.filter((r) => r.name.toLowerCase().includes(q) || r.nameOriginal.toLowerCase().includes(q))
    : rows
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const current = Math.min(page, totalPages)
  const start = (current - 1) * PAGE_SIZE
  const shown = filtered.slice(start, start + PAGE_SIZE)

  function goTo(p) {
    setPage(p)
    document.getElementById('member-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <PageHero
        eyebrow="हमारा परिवार"
        title="सदस्य"
        blurb="संघ के सभी पंजीकृत सदस्यों की सूची। यहीं से नई सदस्यता के लिए आवेदन करें और मासिक शुल्क भरें।"
      />

      <div className="flex flex-wrap justify-center gap-3 bg-cream-deep/60 px-4 py-8">
        <PayDuesButton />
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          aria-expanded={showForm}
          aria-controls="join"
          className="flex items-center gap-2 rounded-sm bg-saffron px-6 py-3 text-sm font-semibold text-maroon-deep transition hover:bg-saffron-light"
        >
          {showForm ? <X size={17} /> : <UserPlus size={17} />}
          {showForm ? 'आवेदन फ़ॉर्म बंद करें' : 'नए सदस्य बनें'}
        </button>
      </div>

      {showForm && (
        <section id="join" className="mx-auto max-w-2xl scroll-mt-28 px-4 pt-12 sm:px-5 lg:px-8">
          <MembershipForm />
        </section>
      )}

      <section id="member-list" className="mx-auto max-w-4xl scroll-mt-28 px-4 py-12 sm:px-5 lg:px-8">
        {loading ? (
          <p className="py-10 text-center text-stone">सदस्य सूची लोड हो रही है…</p>
        ) : failed ? (
          <p className="py-10 text-center text-stone">सदस्य सूची अभी उपलब्ध नहीं है, कृपया बाद में देखें।</p>
        ) : (
          <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 font-display text-lg font-semibold text-maroon-deep">
                <Users size={20} className="text-saffron" />
                कुल पंजीकृत सदस्य: {members.length}
              </p>
              <label className="relative block sm:w-72">
                <span className="sr-only">नाम से खोजें</span>
                <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value)
                    setPage(1)
                  }}
                  placeholder="नाम से खोजें"
                  className="w-full border border-gold/40 bg-cream-paper py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-stone/60 focus:border-saffron"
                />
              </label>
            </div>

            <div className="mt-6 overflow-x-auto border border-gold/40 bg-cream-paper">
              <table className="w-full text-left text-sm">
                <thead className="bg-maroon-deep text-cream-paper">
                  <tr>
                    <th scope="col" className="w-12 whitespace-nowrap px-3 py-3 font-semibold sm:w-20 sm:px-4">क्रम</th>
                    <th scope="col" className="px-3 py-3 font-semibold sm:px-4">नाम</th>
                    <th scope="col" className="px-3 py-3 font-semibold sm:px-4">सदस्यता</th>
                    <th scope="col" className="hidden px-4 py-3 font-semibold sm:table-cell">व्यवसाय</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gold/15">
                  {shown.map((r) => (
                    <tr key={r.serial} className="even:bg-cream-deep/40">
                      <td className="px-3 py-2.5 font-ledger text-stone sm:px-4">{r.serial}</td>
                      <td className="px-3 py-2.5 sm:px-4">
                        <span className="font-medium text-ink">{r.name}</span>
                        {r.occupation && <span className="block text-xs text-stone sm:hidden">{r.occupation}</span>}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-stone sm:px-4">{r.type}</td>
                      <td className="hidden px-4 py-2.5 text-stone sm:table-cell">{r.occupation || '—'}</td>
                    </tr>
                  ))}
                  {shown.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-stone">
                        {members.length === 0 ? 'अभी कोई सदस्य दर्ज नहीं है।' : 'इस नाम से कोई सदस्य नहीं मिला।'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {filtered.length > 0 && (
              <div className="mt-5 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
                <p className="text-sm text-stone">
                  {filtered.length} में से {start + 1}–{start + shown.length} दिखाए जा रहे हैं
                </p>
                {totalPages > 1 && (
                  <nav aria-label="सदस्य सूची के पेज" className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => goTo(current - 1)}
                      disabled={current === 1}
                      aria-label="पिछला पेज"
                      className="grid h-9 w-9 place-items-center border border-gold/40 text-maroon-deep transition hover:border-saffron disabled:opacity-40"
                    >
                      <ChevronLeft size={17} />
                    </button>
                    {pageList(current, totalPages).map((p, i) =>
                      p === null ? (
                        <span key={`gap-${i}`} className="px-1 text-stone">
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          type="button"
                          onClick={() => goTo(p)}
                          aria-current={p === current ? 'page' : undefined}
                          className={`h-9 min-w-9 border px-2.5 text-sm font-medium transition ${
                            p === current
                              ? 'border-maroon-deep bg-maroon-deep text-cream-paper'
                              : 'border-gold/40 text-maroon-deep hover:border-saffron'
                          }`}
                        >
                          {p}
                        </button>
                      )
                    )}
                    <button
                      type="button"
                      onClick={() => goTo(current + 1)}
                      disabled={current === totalPages}
                      aria-label="अगला पेज"
                      className="grid h-9 w-9 place-items-center border border-gold/40 text-maroon-deep transition hover:border-saffron disabled:opacity-40"
                    >
                      <ChevronRight size={17} />
                    </button>
                  </nav>
                )}
              </div>
            )}
          </>
        )}
      </section>
    </>
  )
}

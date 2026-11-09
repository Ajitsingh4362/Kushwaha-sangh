import { useEffect, useMemo, useState } from 'react'
import { Search, Users } from 'lucide-react'
import PageHero from '../components/PageHero'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

// Public member directory. Data comes from the get_public_members()
// database function (supabase/public_members.sql), which returns only
// name, membership type and occupation — no contact details.

const TYPE_HI = {
  karyakarni: 'कार्यकारिणी',
  regular: 'सामान्य',
}

export default function Community() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [query, setQuery] = useState('')

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
  const numbered = useMemo(() => members.map((m, i) => ({ ...m, serial: i + 1 })), [members])
  const q = query.trim().toLowerCase()
  const shown = q ? numbered.filter((m) => (m.name || '').toLowerCase().includes(q)) : numbered

  return (
    <>
      <PageHero
        eyebrow="हमारा परिवार"
        title="सदस्य"
        blurb="संघ के सभी पंजीकृत सदस्यों की सूची।"
      />

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-5 lg:px-8">
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
                  onChange={(e) => setQuery(e.target.value)}
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
                  {shown.map((m) => (
                    <tr key={m.serial} className="even:bg-cream-deep/40">
                      <td className="px-3 py-2.5 font-ledger text-stone sm:px-4">{m.serial}</td>
                      <td className="px-3 py-2.5 sm:px-4">
                        <span className="font-medium text-ink">{m.name}</span>
                        {m.occupation && <span className="block text-xs text-stone sm:hidden">{m.occupation}</span>}
                      </td>
                      <td className="whitespace-nowrap px-3 py-2.5 text-stone sm:px-4">{TYPE_HI[m.member_type] || 'सामान्य'}</td>
                      <td className="hidden px-4 py-2.5 text-stone sm:table-cell">{m.occupation || '—'}</td>
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
          </>
        )}
      </section>
    </>
  )
}

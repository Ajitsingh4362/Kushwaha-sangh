import { useEffect, useState } from 'react'
import { Search, Star, X } from 'lucide-react'
import { supabase } from '../lib/supabase'

// Popup list of active members, opened from the dashboard's
// "Active Members" card.
export default function ActiveMembersModal({ onClose }) {
  const [members, setMembers] = useState(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase
      .from('members')
      .select('id, member_code, name, phone, member_type, occupation, created_at')
      .eq('active', true)
      .order('created_at', { ascending: true })
      .then(({ data, error: err }) => {
        if (err) setError('Could not load members. Please try again.')
        setMembers(data || [])
      })
  }, [])

  // Close on Escape, and stop the page behind from scrolling.
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  const q = search.trim().toLowerCase()
  const shown = (members || []).filter(
    (m) => !q || [m.member_code, m.name, m.phone, m.occupation].some((v) => (v || '').toLowerCase().includes(q))
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="active-members-title"
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-3xl flex-col border border-gold/40 bg-cream-paper shadow-xl sm:max-h-[85vh]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gold/30 px-5 py-4">
          <div>
            <h2 id="active-members-title" className="font-display text-lg font-semibold text-maroon-deep">
              Active Members
            </h2>
            <p className="text-xs text-stone">
              {members === null
                ? 'Loading…'
                : q
                  ? `${shown.length} of ${members.length} shown`
                  : `${members.length} active member${members.length === 1 ? '' : 's'}`}
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-stone hover:text-maroon-deep">
            <X size={22} />
          </button>
        </div>

        <div className="border-b border-gold/20 px-5 py-3">
          <label className="relative block">
            <span className="sr-only">Search active members</span>
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by member ID, name, phone or occupation…"
              className="w-full border border-gold/40 bg-cream py-2 pl-9 pr-3 text-sm text-ink focus:border-saffron"
            />
          </label>
        </div>

        <div className="flex-1 overflow-auto">
          {error && <p className="px-5 py-6 text-sm text-red-700">{error}</p>}
          {members !== null && !error && (
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="sticky top-0 bg-cream-deep text-xs uppercase tracking-wide text-stone">
                <tr>
                  <th className="px-5 py-2 font-medium">Member ID</th>
                  <th className="px-3 py-2 font-medium">Name</th>
                  <th className="px-3 py-2 font-medium">Phone</th>
                  <th className="px-3 py-2 font-medium">Type</th>
                  <th className="px-3 py-2 pr-5 font-medium">Occupation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/15">
                {shown.map((m) => (
                  <tr key={m.id}>
                    <td className="whitespace-nowrap px-5 py-2.5 font-ledger text-xs text-maroon">{m.member_code || '—'}</td>
                    <td className="px-3 py-2.5 font-medium text-ink">{m.name}</td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-xs">
                      {m.phone ? (
                        <a href={`tel:${m.phone}`} className="text-maroon-deep hover:underline">
                          {m.phone}
                        </a>
                      ) : (
                        <span className="text-stone">—</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-2.5 text-xs text-stone">
                      {m.member_type === 'karyakarni' ? (
                        <span className="flex items-center gap-1 text-saffron">
                          <Star size={11} fill="currentColor" /> Executive
                        </span>
                      ) : (
                        'Regular'
                      )}
                    </td>
                    <td className="px-3 py-2.5 pr-5 text-xs text-stone">{m.occupation || '—'}</td>
                  </tr>
                ))}
                {shown.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-8 text-center text-stone">
                      {members.length === 0 ? 'No active members yet.' : 'No member matches that search.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

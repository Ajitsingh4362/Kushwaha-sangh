import { useEffect, useState } from 'react'
import { Search, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import AdminModal from './AdminModal'

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

  const q = search.trim().toLowerCase()
  const shown = (members || []).filter(
    (m) => !q || [m.member_code, m.name, m.phone, m.occupation].some((v) => (v || '').toLowerCase().includes(q))
  )

  const subtitle =
    members === null
      ? 'Loading…'
      : q
        ? `${shown.length} of ${members.length} shown`
        : `${members.length} active member${members.length === 1 ? '' : 's'}`

  return (
    <AdminModal
      title="Active Members"
      subtitle={subtitle}
      onClose={onClose}
      toolbar={
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
      }
    >
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
    </AdminModal>
  )
}

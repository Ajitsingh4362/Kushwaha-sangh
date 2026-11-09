import { useEffect, useState } from 'react'
import { CheckCircle2, Clock, MessageCircle, Search, XCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import AdminModal from './AdminModal'
import { nameToHindi } from '../lib/toHindi'

function monthLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

function monthLabelHi(dateStr) {
  return new Date(dateStr).toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' })
}

// WhatsApp link with a ready-made Hindi reminder (10-digit numbers get +91).
function whatsappLink(phone, name, month, amount) {
  const digits = (phone || '').replace(/\D/g, '')
  if (digits.length < 10) return null
  const number = digits.length === 10 ? `91${digits}` : digits
  const text =
    `नमस्ते ${nameToHindi(name)} जी, सीतामढ़ी कुशवाहा संघ का ${monthLabelHi(month)} का मासिक शुल्क ₹${amount} बाकी है। ` +
    'कृपया www.kushwahasangh.org/community पर "मासिक शुल्क भरें" से भुगतान करें। धन्यवाद।'
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

// Popup for the dashboard's "Unpaid This Month" card: everyone whose dues
// for the month aren't verified yet, with Mark Paid and a WhatsApp reminder.
export default function UnpaidDuesModal({ month, onClose }) {
  const [rows, setRows] = useState(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [savingId, setSavingId] = useState(null)

  async function load() {
    const { data: dues, error: duesErr } = await supabase
      .from('dues')
      .select('id, member_id, amount, status, due_month')
      .eq('due_month', month)
      .neq('status', 'verified')
    if (duesErr) {
      setError('Could not load dues. Please try again.')
      setRows([])
      return
    }
    const ids = [...new Set((dues || []).map((d) => d.member_id))]
    const { data: members } = ids.length
      ? await supabase.from('members').select('id, member_code, name, phone').in('id', ids)
      : { data: [] }
    const byId = Object.fromEntries((members || []).map((m) => [m.id, m]))
    setRows(
      (dues || [])
        .map((d) => ({ ...d, member: byId[d.member_id] || { name: 'Unknown member' } }))
        .sort((a, b) => (a.member.member_code || '').localeCompare(b.member.member_code || '', 'en', { numeric: true }))
    )
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month])

  async function markPaid(due) {
    setSavingId(due.id)
    const { error: err } = await supabase
      .from('dues')
      .update({ status: 'verified', paid: true, paid_date: new Date().toISOString().slice(0, 10) })
      .eq('id', due.id)
    setSavingId(null)
    if (err) {
      setError('Could not mark as paid. Please try again.')
      return
    }
    setRows((list) => list.filter((r) => r.id !== due.id))
  }

  const statusBadge = (r) =>
    r.status === 'declared' ? (
      <span className="flex items-center gap-1 font-medium text-saffron">
        <Clock size={13} /> Says paid
      </span>
    ) : (
      <span className="flex items-center gap-1 font-medium text-red-700">
        <XCircle size={13} /> Unpaid
      </span>
    )

  const actions = (r) => {
    const wa = whatsappLink(r.member.phone, r.member.name, month, Number(r.amount))
    return (
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => markPaid(r)}
          disabled={savingId === r.id}
          className="flex items-center gap-1 whitespace-nowrap rounded-sm border border-gold/50 px-2.5 py-1 text-xs font-medium text-ink hover:border-saffron disabled:opacity-60"
        >
          <CheckCircle2 size={13} /> {savingId === r.id ? 'Saving…' : 'Mark Paid'}
        </button>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            title="Send a WhatsApp reminder"
            className="flex items-center gap-1 whitespace-nowrap rounded-sm border border-green-700/40 px-2.5 py-1 text-xs font-medium text-green-800 hover:bg-green-50"
          >
            <MessageCircle size={13} /> Remind
          </a>
        )}
      </div>
    )
  }

  const phoneLink = (r) =>
    r.member.phone ? (
      <a href={`tel:${r.member.phone}`} className="text-maroon-deep hover:underline">
        {r.member.phone}
      </a>
    ) : (
      <span className="text-stone">—</span>
    )

  const emptyText =
    rows && rows.length === 0
      ? 'Nothing pending for this month. (If dues haven’t been generated yet, do that in Member Dues.)'
      : 'No member matches that search.'

  const q = search.trim().toLowerCase()
  const shown = (rows || []).filter(
    (r) => !q || [r.member.member_code, r.member.name, r.member.phone].some((v) => (v || '').toLowerCase().includes(q))
  )
  const total = (rows || []).reduce((s, r) => s + Number(r.amount || 0), 0)
  const declared = (rows || []).filter((r) => r.status === 'declared').length

  return (
    <AdminModal
      title={`Unpaid — ${monthLabel(month)}`}
      subtitle={
        rows === null
          ? 'Loading…'
          : `${rows.length} member${rows.length === 1 ? '' : 's'} · ₹${total.toLocaleString('en-IN')} pending` +
            (declared ? ` · ${declared} say they've paid (check and mark paid)` : '')
      }
      onClose={onClose}
      toolbar={
        <label className="relative block">
          <span className="sr-only">Search unpaid members</span>
          <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-stone" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by member ID, name or phone…"
            className="w-full border border-gold/40 bg-cream py-2 pl-9 pr-3 text-sm text-ink focus:border-saffron"
          />
        </label>
      }
    >
      {error && <p className="px-5 pt-4 text-sm text-red-700">{error}</p>}
      {rows !== null && (
        <table className="hidden w-full text-left text-sm sm:table">
          <thead className="sticky top-0 bg-cream-deep text-xs uppercase tracking-wide text-stone">
            <tr>
              <th className="px-5 py-2 font-medium">Member ID</th>
              <th className="px-3 py-2 font-medium">Name</th>
              <th className="px-3 py-2 font-medium">Phone</th>
              <th className="px-3 py-2 font-medium">Amount</th>
              <th className="px-3 py-2 font-medium">Status</th>
              <th className="px-3 py-2 pr-5 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/15">
            {shown.map((r) => (
              <tr key={r.id}>
                <td className="whitespace-nowrap px-5 py-2.5 font-ledger text-xs text-maroon">{r.member.member_code || '—'}</td>
                <td className="px-3 py-2.5 font-medium text-ink">{r.member.name}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-xs">{phoneLink(r)}</td>
                <td className="whitespace-nowrap px-3 py-2.5 font-ledger text-ink">₹{Number(r.amount)}</td>
                <td className="whitespace-nowrap px-3 py-2.5 text-xs">{statusBadge(r)}</td>
                <td className="px-3 py-2.5 pr-5">{actions(r)}</td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-8 text-center text-stone">
                  {emptyText}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Phones: one card per member instead of a wide table */}
      {rows !== null && (
        <ul className="divide-y divide-gold/15 sm:hidden">
          {shown.map((r) => (
            <li key={r.id} className="space-y-2 px-5 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-ink">{r.member.name}</p>
                  <p className="font-ledger text-xs text-maroon">{r.member.member_code || '—'}</p>
                </div>
                <div className="text-right">
                  <p className="font-ledger text-ink">₹{Number(r.amount)}</p>
                  <div className="text-xs">{statusBadge(r)}</div>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 text-xs">
                {phoneLink(r)}
                {actions(r)}
              </div>
            </li>
          ))}
          {shown.length === 0 && <li className="px-5 py-8 text-center text-sm text-stone">{emptyText}</li>}
        </ul>
      )}
    </AdminModal>
  )
}

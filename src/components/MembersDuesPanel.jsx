import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Clock, Plus, Download } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Field } from './FormField'

function currentMonthStart() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

function monthLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

function csvEscape(value) {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function downloadCSV(filename, headers, rows) {
  const lines = [headers.map(csvEscape).join(','), ...rows.map((row) => row.map(csvEscape).join(','))]
  const blob = new Blob(['\ufeff' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export default function MembersDuesPanel() {
  const [members, setMembers] = useState([])
  const [dues, setDues] = useState([])
  const [loading, setLoading] = useState(true)
  const [newMember, setNewMember] = useState({ name: '', phone: '', member_type: 'regular' })
  const [saving, setSaving] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(currentMonthStart())

  const thisMonth = currentMonthStart()

  function loadData() {
    setLoading(true)
    Promise.all([
      supabase.from('members').select('*').order('name'),
      supabase.from('dues').select('*'),
    ]).then(([{ data: membersData }, { data: duesData }]) => {
      setMembers(membersData || [])
      setDues(duesData || [])
      setLoading(false)
    })
  }

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel('dues-tab-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => loadData())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dues' }, () => loadData())
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function handleAddMember(e) {
    e.preventDefault()
    if (!newMember.name) return
    setSaving(true)
    await supabase.from('members').insert({
      name: newMember.name,
      phone: newMember.phone || null,
      member_type: newMember.member_type,
      monthly_due: newMember.member_type === 'karyakarni' ? 200 : 100,
      source: 'manual',
    })
    setNewMember({ name: '', phone: '', member_type: 'regular' })
    setSaving(false)
    loadData()
  }

  async function verifyDue(due) {
    setSaving(true)
    await supabase.from('dues').update({ status: 'verified', paid: true, paid_date: new Date().toISOString().slice(0, 10) }).eq('id', due.id)
    setSaving(false)
    loadData()
  }

  function duesForMember(memberId) {
    return dues.filter((d) => d.member_id === memberId)
  }

  function pendingMonths(memberId) {
    return duesForMember(memberId).filter((d) => d.status !== 'verified')
  }

  function exportThisMonthCSV() {
    const rows = members.map((m) => {
      const due = duesForMember(m.id).find((d) => d.due_month === selectedMonth)
      const pending = pendingMonths(m.id)
      return [
        m.name,
        m.phone || '',
        m.member_type === 'karyakarni' ? 'Executive Committee' : 'Regular',
        due ? (due.status === 'verified' ? 'Paid' : due.status === 'declared' ? 'Declared' : 'Unpaid') : 'Not generated',
        due?.paid_date || '',
        pending.length > 0 ? pending.map((d) => monthLabel(d.due_month)).join('; ') : 'Clear',
      ]
    })
    downloadCSV(
      `dues-${selectedMonth}.csv`,
      ['Name', 'Phone', 'Membership Type', `Status — ${monthLabel(selectedMonth)}`, 'Paid Date', 'Pending Months'],
      rows
    )
  }

  function exportFullHistoryCSV() {
    const rows = dues
      .slice()
      .sort((a, b) => (a.due_month < b.due_month ? 1 : -1))
      .map((d) => {
        const m = members.find((mem) => mem.id === d.member_id)
        return [
          m?.name || 'Unknown',
          m?.phone || '',
          monthLabel(d.due_month),
          m?.monthly_due ?? '',
          d.status === 'verified' ? 'Paid' : d.status === 'declared' ? 'Declared' : 'Unpaid',
          d.paid_date || '',
        ]
      })
    downloadCSV('dues-full-history.csv', ['Name', 'Phone', 'Month', 'Amount (₹)', 'Status', 'Paid Date'], rows)
  }

  const totalMembers = members.length
  const paidThisMonth = dues.filter((d) => d.due_month === selectedMonth && d.status === 'verified').length
  const awaitingVerification = dues.filter((d) => d.status === 'declared').length

  const availableMonths = Array.from(new Set([thisMonth, ...dues.map((d) => d.due_month)]))
    .sort()
    .reverse()

  if (loading) return <p className="text-stone">Loading members…</p>

  return (
    <div className="space-y-8">
      {/* SUMMARY */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="ledger-plaque p-5">
          <span className="ledger-number">Total Members</span>
          <p className="mt-1 font-display text-2xl font-bold text-maroon-deep">{totalMembers}</p>
        </div>
        <div className="ledger-plaque p-5">
          <span className="ledger-number">Paid — {monthLabel(selectedMonth)}</span>
          <p className="mt-1 font-display text-2xl font-bold text-green-700">{paidThisMonth}</p>
        </div>
        <div className="ledger-plaque p-5">
          <span className="ledger-number">Unpaid — {monthLabel(selectedMonth)}</span>
          <p className="mt-1 font-display text-2xl font-bold text-red-700">{totalMembers - paidThisMonth}</p>
        </div>
        <div className="ledger-plaque p-5">
          <span className={`ledger-number ${awaitingVerification > 0 ? 'text-red-700' : ''}`}>Awaiting Verify</span>
          <p className={`mt-1 font-display text-2xl font-bold ${awaitingVerification > 0 ? 'text-red-700' : 'text-maroon-deep'}`}>
            {awaitingVerification}
          </p>
        </div>
      </div>

      <form onSubmit={handleAddMember} className="ledger-plaque flex flex-wrap items-end gap-4 p-6">
        <Field
          id="name"
          label="Member Name"
          type="text"
          value={newMember.name}
          onChange={(e) => setNewMember((v) => ({ ...v, name: e.target.value }))}
          className="min-w-[160px] flex-1"
        />
        <Field
          id="phone"
          label="Phone"
          type="tel"
          value={newMember.phone}
          onChange={(e) => setNewMember((v) => ({ ...v, phone: e.target.value }))}
          className="min-w-[140px] flex-1"
        />
        <div className="min-w-[220px]">
          <label htmlFor="member_type" className="mb-1.5 block text-sm font-medium text-maroon-deep">
            Membership Type
          </label>
          <select
            id="member_type"
            value={newMember.member_type}
            onChange={(e) => setNewMember((v) => ({ ...v, member_type: e.target.value }))}
            className="w-full border border-gold/40 bg-cream-paper px-3.5 py-2.5 text-sm text-ink focus:border-saffron"
          >
            <option value="regular">Regular — ₹100/month</option>
            <option value="karyakarni">Executive Committee — ₹200/month</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
        >
          <Plus size={16} /> Add Member
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-maroon-deep">Dues — {monthLabel(selectedMonth)}</h3>
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <label htmlFor="month_filter" className="mr-2 text-xs font-medium text-stone">
              Month:
            </label>
            <select
              id="month_filter"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border border-gold/40 bg-cream-paper px-3 py-1.5 text-sm text-ink focus:border-saffron"
            >
              {availableMonths.map((m) => (
                <option key={m} value={m}>
                  {monthLabel(m)}
                  {m === thisMonth ? ' (Current)' : ''}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={exportThisMonthCSV}
            className="flex items-center gap-1.5 rounded-sm border border-gold/50 px-3 py-1.5 text-xs font-medium text-ink hover:border-saffron"
          >
            <Download size={13} /> Export This Month
          </button>
          <button
            type="button"
            onClick={exportFullHistoryCSV}
            className="flex items-center gap-1.5 rounded-sm border border-gold/50 px-3 py-1.5 text-xs font-medium text-ink hover:border-saffron"
          >
            <Download size={13} /> Export Full History
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead>
            <tr className="border-b border-gold/30 text-xs uppercase tracking-wide text-stone">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Phone</th>
              <th className="py-2 pr-4 font-medium">{monthLabel(selectedMonth)}</th>
              <th className="py-2 pr-4 font-medium">Pending Months</th>
              <th className="py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/15">
            {members.map((m) => {
              const pending = pendingMonths(m.id)
              const thisMonthDue = duesForMember(m.id).find((d) => d.due_month === selectedMonth)
              return (
                <tr key={m.id}>
                  <td className="py-3 pr-4 font-medium text-ink">{m.name}</td>
                  <td className="py-3 pr-4 text-xs text-stone">{m.phone || '—'}</td>
                  <td className="py-3 pr-4">
                    {!thisMonthDue ? (
                      <span className="text-xs text-stone">not generated</span>
                    ) : thisMonthDue.status === 'verified' ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-green-700">
                        <CheckCircle2 size={14} /> Paid
                      </span>
                    ) : thisMonthDue.status === 'declared' ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-saffron">
                        <Clock size={14} /> Declared
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-700">
                        <XCircle size={14} /> Unpaid
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {pending.length > 0 ? (
                      <span className="font-ledger text-xs text-red-700">
                        {pending.map((d) => monthLabel(d.due_month)).join(', ')}
                      </span>
                    ) : (
                      <span className="font-ledger text-xs text-green-700">Clear</span>
                    )}
                  </td>
                  <td className="py-3">
                    {thisMonthDue && thisMonthDue.status !== 'verified' && (
                      <button
                        onClick={() => verifyDue(thisMonthDue)}
                        disabled={saving}
                        className="rounded-sm border border-gold/50 px-3 py-1.5 text-xs font-medium text-ink hover:border-saffron disabled:opacity-60"
                      >
                        Mark Verified
                      </button>
                    )}
                  </td>
                </tr>
              )
            })}
            {members.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-stone">
                  No members yet — add one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-stone">
        Members pay via the &ldquo;Pay Monthly Due&rdquo; button on the Membership page (phone number lookup)
        — those show as <strong>Declared</strong> here until you verify against the bank/UPI statement.
        &ldquo;Mark Verified&rdquo; also works for cash payments collected directly.
      </p>
    </div>
  )
}


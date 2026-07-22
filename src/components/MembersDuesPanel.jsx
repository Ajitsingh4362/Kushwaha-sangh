import { useEffect, useState } from 'react'
import { CheckCircle2, XCircle, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Field } from './FormField'

function currentMonthStart() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

function monthLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

export default function MembersDuesPanel() {
  const [members, setMembers] = useState([])
  const [dues, setDues] = useState([])
  const [loading, setLoading] = useState(true)
  const [newMember, setNewMember] = useState({ name: '', phone: '', monthly_due: '' })
  const [saving, setSaving] = useState(false)

  const month = currentMonthStart()

  async function loadData() {
    setLoading(true)
    const { data: membersData } = await supabase.from('members').select('*').order('name')
    const { data: duesData } = await supabase.from('dues').select('*')
    setMembers(membersData || [])
    setDues(duesData || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleAddMember(e) {
    e.preventDefault()
    if (!newMember.name || !newMember.monthly_due) return
    setSaving(true)
    await supabase.from('members').insert({
      name: newMember.name,
      phone: newMember.phone || null,
      monthly_due: parseFloat(newMember.monthly_due),
    })
    setNewMember({ name: '', phone: '', monthly_due: '' })
    setSaving(false)
    loadData()
  }

  async function generateThisMonth() {
    setSaving(true)
    const rows = members
      .filter((m) => m.active)
      .map((m) => ({ member_id: m.id, due_month: month, amount: m.monthly_due }))
    if (rows.length) {
      await supabase.from('dues').upsert(rows, { onConflict: 'member_id,due_month', ignoreDuplicates: true })
    }
    setSaving(false)
    loadData()
  }

  async function togglePaid(due) {
    setSaving(true)
    await supabase
      .from('dues')
      .update({ paid: !due.paid, paid_date: !due.paid ? new Date().toISOString().slice(0, 10) : null })
      .eq('id', due.id)
    setSaving(false)
    loadData()
  }

  function duesForMember(memberId) {
    return dues.filter((d) => d.member_id === memberId)
  }

  function currentMonthDue(memberId) {
    return dues.find((d) => d.member_id === memberId && d.due_month === month)
  }

  function pendingCount(memberId) {
    return duesForMember(memberId).filter((d) => !d.paid).length
  }

  if (loading) return <p className="text-stone">Loading members…</p>

  return (
    <div className="space-y-8">
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
          label="Phone (optional)"
          type="tel"
          value={newMember.phone}
          onChange={(e) => setNewMember((v) => ({ ...v, phone: e.target.value }))}
          className="min-w-[140px] flex-1"
        />
        <Field
          id="monthly_due"
          label="Monthly Due (₹)"
          type="number"
          value={newMember.monthly_due}
          onChange={(e) => setNewMember((v) => ({ ...v, monthly_due: e.target.value }))}
          className="w-36"
        />
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
        >
          <Plus size={16} /> Add Member
        </button>
      </form>

      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-maroon-deep">Dues — {monthLabel(month)}</h3>
        <button
          onClick={generateThisMonth}
          disabled={saving}
          className="rounded-sm border border-maroon-deep px-4 py-2 text-xs font-semibold text-maroon-deep hover:bg-maroon-deep hover:text-cream-paper disabled:opacity-60"
        >
          Generate This Month&rsquo;s Dues
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-gold/30 text-xs uppercase tracking-wide text-stone">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Monthly Due</th>
              <th className="py-2 pr-4 font-medium">This Month</th>
              <th className="py-2 pr-4 font-medium">Pending Months</th>
              <th className="py-2 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/15">
            {members.map((m) => {
              const due = currentMonthDue(m.id)
              const pending = pendingCount(m.id)
              return (
                <tr key={m.id}>
                  <td className="py-3 pr-4 font-medium text-ink">{m.name}</td>
                  <td className="py-3 pr-4 text-stone">₹{m.monthly_due}</td>
                  <td className="py-3 pr-4">
                    {!due ? (
                      <span className="text-xs text-stone">not generated</span>
                    ) : due.paid ? (
                      <span className="flex items-center gap-1 text-xs font-medium text-green-700">
                        <CheckCircle2 size={14} /> Paid
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-700">
                        <XCircle size={14} /> Unpaid
                      </span>
                    )}
                  </td>
                  <td className="py-3 pr-4">
                    {pending > 0 ? (
                      <span className="font-ledger text-xs text-red-700">{pending} month(s) due</span>
                    ) : (
                      <span className="font-ledger text-xs text-green-700">Clear</span>
                    )}
                  </td>
                  <td className="py-3">
                    {due && (
                      <button
                        onClick={() => togglePaid(due)}
                        disabled={saving}
                        className="rounded-sm border border-gold/50 px-3 py-1.5 text-xs font-medium text-ink hover:border-saffron disabled:opacity-60"
                      >
                        Mark {due.paid ? 'Unpaid' : 'Paid'}
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
    </div>
  )
}

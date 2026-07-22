import { useEffect, useState } from 'react'
import { Plus, Info } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Field } from './FormField'

export default function DonationsPanel() {
  const [donations, setDonations] = useState([])
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [donorType, setDonorType] = useState('member') // 'member' | 'other'
  const [form, setForm] = useState({
    member_id: '',
    donor_name: '',
    amount: '',
    is_anonymous: false,
    note: '',
  })

  async function loadData() {
    setLoading(true)
    const [{ data: donationsData }, { data: membersData }] = await Promise.all([
      supabase
        .from('donations')
        .select('*, members(name)')
        .order('created_at', { ascending: false }),
      supabase.from('members').select('id, name').order('name'),
    ])
    setDonations(donationsData || [])
    setMembers(membersData || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.amount) return
    if (donorType === 'member' && !form.member_id) return
    setSaving(true)

    const selectedMember = members.find((m) => m.id === form.member_id)

    await supabase.from('donations').insert({
      member_id: donorType === 'member' ? form.member_id : null,
      donor_name: form.is_anonymous
        ? null
        : donorType === 'member'
          ? selectedMember?.name
          : form.donor_name || null,
      is_anonymous: form.is_anonymous,
      amount: parseFloat(form.amount),
      note: form.note || null,
      payment_method: 'manual',
    })

    setForm({ member_id: '', donor_name: '', amount: '', is_anonymous: false, note: '' })
    setSaving(false)
    loadData()
  }

  const total = donations.reduce((sum, d) => sum + Number(d.amount), 0)

  if (loading) return <p className="text-stone">Loading donations…</p>

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-2.5 border border-gold/30 bg-cream-deep/40 p-4 text-sm text-stone">
        <Info size={16} className="mt-0.5 shrink-0 text-saffron" />
        <p>
          Most donors are Sangh members — pick their name from the dropdown so it links to their member
          record. Only use &ldquo;Someone else&rdquo; for one-off donors who aren&rsquo;t registered members.
        </p>
      </div>

      <form onSubmit={handleAdd} className="ledger-plaque space-y-4 p-6">
        <div className="flex gap-4 text-sm">
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              checked={donorType === 'member'}
              onChange={() => setDonorType('member')}
              className="accent-maroon"
            />
            A Sangh member
          </label>
          <label className="flex items-center gap-1.5">
            <input
              type="radio"
              checked={donorType === 'other'}
              onChange={() => setDonorType('other')}
              className="accent-maroon"
            />
            Someone else
          </label>
        </div>

        <div className="flex flex-wrap items-end gap-4">
          {donorType === 'member' ? (
            <div className="min-w-[200px] flex-1">
              <label htmlFor="member_id" className="mb-1.5 block text-sm font-medium text-maroon-deep">
                Member
              </label>
              <select
                id="member_id"
                value={form.member_id}
                onChange={(e) => setForm((v) => ({ ...v, member_id: e.target.value }))}
                className="w-full border border-gold/40 bg-cream-paper px-3.5 py-2.5 text-sm text-ink focus:border-saffron"
              >
                <option value="">Select a member…</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              {members.length === 0 && (
                <p className="mt-1 text-xs text-stone">
                  No members added yet — add them first in the Member Dues tab.
                </p>
              )}
            </div>
          ) : (
            <Field
              id="donor_name"
              label="Donor Name"
              type="text"
              value={form.donor_name}
              disabled={form.is_anonymous}
              onChange={(e) => setForm((v) => ({ ...v, donor_name: e.target.value }))}
              className="min-w-[160px] flex-1"
            />
          )}
          <Field
            id="amount"
            label="Amount (₹)"
            type="number"
            value={form.amount}
            onChange={(e) => setForm((v) => ({ ...v, amount: e.target.value }))}
            className="w-32"
          />
          <Field
            id="note"
            label="Note (optional)"
            type="text"
            value={form.note}
            onChange={(e) => setForm((v) => ({ ...v, note: e.target.value }))}
            className="min-w-[160px] flex-1"
          />
          <label className="flex items-center gap-2 pb-2.5 text-sm text-stone">
            <input
              type="checkbox"
              checked={form.is_anonymous}
              onChange={(e) => setForm((v) => ({ ...v, is_anonymous: e.target.checked }))}
              className="accent-maroon"
            />
            Show as anonymous
          </label>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-1.5 rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
          >
            <Plus size={16} /> Add Donation
          </button>
        </div>
      </form>

      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-maroon-deep">All Donations</h3>
        <span className="font-ledger text-sm text-gold-deep">Total: ₹{total.toLocaleString('en-IN')}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-gold/30 text-xs uppercase tracking-wide text-stone">
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Donor</th>
              <th className="py-2 pr-4 font-medium">Member?</th>
              <th className="py-2 pr-4 font-medium">Amount</th>
              <th className="py-2 font-medium">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/15">
            {donations.map((d) => (
              <tr key={d.id}>
                <td className="py-3 pr-4 text-stone">
                  {new Date(d.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </td>
                <td className="py-3 pr-4 font-medium text-ink">
                  {d.is_anonymous ? 'Anonymous' : d.members?.name || d.donor_name || '—'}
                </td>
                <td className="py-3 pr-4 text-stone">{d.member_id ? 'Yes' : 'No'}</td>
                <td className="py-3 pr-4 text-ink">₹{Number(d.amount).toLocaleString('en-IN')}</td>
                <td className="py-3 text-stone">{d.note || '—'}</td>
              </tr>
            ))}
            {donations.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-stone">
                  No donations recorded yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

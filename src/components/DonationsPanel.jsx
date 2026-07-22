import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Field } from './FormField'

export default function DonationsPanel() {
  const [donations, setDonations] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ donor_name: '', amount: '', is_anonymous: false, note: '' })

  async function loadData() {
    setLoading(true)
    const { data } = await supabase.from('donations').select('*').order('created_at', { ascending: false })
    setDonations(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.amount) return
    setSaving(true)
    await supabase.from('donations').insert({
      donor_name: form.is_anonymous ? null : form.donor_name || null,
      is_anonymous: form.is_anonymous,
      amount: parseFloat(form.amount),
      note: form.note || null,
      payment_method: 'manual',
    })
    setForm({ donor_name: '', amount: '', is_anonymous: false, note: '' })
    setSaving(false)
    loadData()
  }

  const total = donations.reduce((sum, d) => sum + Number(d.amount), 0)

  if (loading) return <p className="text-stone">Loading donations…</p>

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="ledger-plaque flex flex-wrap items-end gap-4 p-6">
        <Field
          id="donor_name"
          label="Donor Name"
          type="text"
          value={form.donor_name}
          disabled={form.is_anonymous}
          onChange={(e) => setForm((v) => ({ ...v, donor_name: e.target.value }))}
          className="min-w-[160px] flex-1"
        />
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
          Anonymous
        </label>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
        >
          <Plus size={16} /> Add Donation
        </button>
      </form>

      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-maroon-deep">All Donations</h3>
        <span className="font-ledger text-sm text-gold-deep">Total: ₹{total.toLocaleString('en-IN')}</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead>
            <tr className="border-b border-gold/30 text-xs uppercase tracking-wide text-stone">
              <th className="py-2 pr-4 font-medium">Date</th>
              <th className="py-2 pr-4 font-medium">Donor</th>
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
                <td className="py-3 pr-4 font-medium text-ink">{d.is_anonymous ? 'Anonymous' : d.donor_name || '—'}</td>
                <td className="py-3 pr-4 text-ink">₹{Number(d.amount).toLocaleString('en-IN')}</td>
                <td className="py-3 text-stone">{d.note || '—'}</td>
              </tr>
            ))}
            {donations.length === 0 && (
              <tr>
                <td colSpan={4} className="py-6 text-center text-stone">
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

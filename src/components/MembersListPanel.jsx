import { useEffect, useState } from 'react'
import { Plus, Globe, UserPlus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Field } from './FormField'

export default function MembersListPanel() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    occupation: '',
    monthly_due: '',
  })

  async function loadData() {
    setLoading(true)
    const { data } = await supabase.from('members').select('*').order('created_at', { ascending: false })
    setMembers(data || [])
    setLoading(false)
  }

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel('members-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => {
        loadData()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.name) return
    setSaving(true)
    await supabase.from('members').insert({
      name: form.name,
      phone: form.phone || null,
      email: form.email || null,
      address: form.address || null,
      occupation: form.occupation || null,
      monthly_due: form.monthly_due ? parseFloat(form.monthly_due) : 0,
      source: 'manual',
    })
    setForm({ name: '', phone: '', email: '', address: '', occupation: '', monthly_due: '' })
    setSaving(false)
    loadData()
  }

  const websiteCount = members.filter((m) => m.source === 'website').length

  if (loading) return <p className="text-stone">Loading members…</p>

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="ledger-plaque space-y-4 p-6">
        <div className="flex items-center gap-2">
          <UserPlus size={18} className="text-saffron" />
          <h3 className="font-display text-lg font-semibold text-maroon-deep">Add a Member Manually</h3>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field id="name" label="Full Name" type="text" value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} />
          <Field id="phone" label="Phone" type="tel" value={form.phone} onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))} />
          <Field id="email" label="Email" type="email" value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} />
          <Field id="address" label="Address" type="text" value={form.address} onChange={(e) => setForm((v) => ({ ...v, address: e.target.value }))} className="sm:col-span-2" />
          <Field id="occupation" label="Occupation" type="text" value={form.occupation} onChange={(e) => setForm((v) => ({ ...v, occupation: e.target.value }))} />
          <Field
            id="monthly_due"
            label="Monthly Due (₹, optional)"
            type="number"
            value={form.monthly_due}
            onChange={(e) => setForm((v) => ({ ...v, monthly_due: e.target.value }))}
          />
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
        >
          <Plus size={16} /> Add Member
        </button>
      </form>

      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-maroon-deep">All Members</h3>
        <span className="text-sm text-stone">
          {members.length} total · {websiteCount} from website applications
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-gold/30 text-xs uppercase tracking-wide text-stone">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Contact</th>
              <th className="py-2 pr-4 font-medium">Address</th>
              <th className="py-2 pr-4 font-medium">Occupation</th>
              <th className="py-2 pr-4 font-medium">Monthly Due</th>
              <th className="py-2 font-medium">Source</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/15">
            {members.map((m) => (
              <tr key={m.id}>
                <td className="py-3 pr-4 font-medium text-ink">{m.name}</td>
                <td className="py-3 pr-4 text-xs text-stone">
                  {[m.phone, m.email].filter(Boolean).join(' / ') || '—'}
                </td>
                <td className="py-3 pr-4 text-xs text-stone">{m.address || '—'}</td>
                <td className="py-3 pr-4 text-stone">{m.occupation || '—'}</td>
                <td className="py-3 pr-4 text-ink">₹{Number(m.monthly_due || 0)}</td>
                <td className="py-3">
                  {m.source === 'website' ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-saffron">
                      <Globe size={13} /> Website
                    </span>
                  ) : (
                    <span className="text-xs text-stone">Manual</span>
                  )}
                </td>
              </tr>
            ))}
            {members.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-stone">
                  No members yet — add one above, or wait for a website application.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

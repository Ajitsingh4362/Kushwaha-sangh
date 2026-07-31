import { useEffect, useState } from 'react'
import { Plus, Globe, UserPlus, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Field } from './FormField'

const KARYAKARNI_TARGET = 21

function dueFor(type) {
  return type === 'karyakarni' ? 200 : 100
}

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
    member_type: 'regular',
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
      member_type: form.member_type,
      monthly_due: dueFor(form.member_type),
      source: 'manual',
    })
    setForm({ name: '', phone: '', email: '', address: '', occupation: '', member_type: 'regular' })
    setSaving(false)
    loadData()
  }

  async function handleTypeChange(member, newType) {
    setSaving(true)
    await supabase
      .from('members')
      .update({ member_type: newType, monthly_due: dueFor(newType) })
      .eq('id', member.id)
    setSaving(false)
    loadData()
  }

  const websiteCount = members.filter((m) => m.source === 'website').length
  const karyakarniCount = members.filter((m) => m.member_type === 'karyakarni').length

  if (loading) return <p className="text-stone">Loading members…</p>

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="ledger-plaque p-5">
          <span className="ledger-number">Total Members</span>
          <p className="mt-1 font-display text-2xl font-bold text-maroon-deep">{members.length}</p>
        </div>
        <div className="ledger-plaque p-5">
          <span className="ledger-number">Executive Committee</span>
          <p className="mt-1 font-display text-2xl font-bold text-maroon-deep">
            {karyakarniCount} <span className="text-sm font-normal text-stone">/ {KARYAKARNI_TARGET}</span>
          </p>
        </div>
        <div className="ledger-plaque p-5">
          <span className="ledger-number">From Website</span>
          <p className="mt-1 font-display text-2xl font-bold text-maroon-deep">{websiteCount}</p>
        </div>
      </div>

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
          <div>
            <label htmlFor="member_type" className="mb-1.5 block text-sm font-medium text-maroon-deep">
              Membership Type
            </label>
            <select
              id="member_type"
              value={form.member_type}
              onChange={(e) => setForm((v) => ({ ...v, member_type: e.target.value }))}
              className="w-full border border-gold/40 bg-cream-paper px-3.5 py-2.5 text-sm text-ink focus:border-saffron"
            >
              <option value="regular">Regular — ₹100/month</option>
              <option value="karyakarni">Executive Committee (Karyakarni) — ₹200/month</option>
            </select>
          </div>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
        >
          <Plus size={16} /> Add Member
        </button>
      </form>

      <div>
        <h3 className="font-display text-lg font-semibold text-maroon-deep">All Members</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="border-b border-gold/30 text-xs uppercase tracking-wide text-stone">
              <th className="py-2 pr-4 font-medium">Name</th>
              <th className="py-2 pr-4 font-medium">Contact</th>
              <th className="py-2 pr-4 font-medium">Address</th>
              <th className="py-2 pr-4 font-medium">Occupation</th>
              <th className="py-2 pr-4 font-medium">Type</th>
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
                <td className="py-3 pr-4">
                  <select
                    value={m.member_type}
                    onChange={(e) => handleTypeChange(m, e.target.value)}
                    disabled={saving}
                    className="border border-gold/30 bg-cream-paper px-2 py-1 text-xs text-ink disabled:opacity-60"
                  >
                    <option value="regular">Regular</option>
                    <option value="karyakarni">Executive Committee</option>
                  </select>
                  {m.member_type === 'karyakarni' && (
                    <Star size={12} className="ml-1.5 inline text-saffron" fill="currentColor" />
                  )}
                </td>
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
                <td colSpan={7} className="py-6 text-center text-stone">
                  No members yet — add one above, or wait for a website application.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-stone">
        Changing a member&rsquo;s type here also updates their monthly due (₹100 for Regular, ₹200 for
        Executive Committee) — new dues generated after the change use the new amount.
      </p>
    </div>
  )
}

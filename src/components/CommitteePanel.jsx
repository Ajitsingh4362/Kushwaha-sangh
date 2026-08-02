import { useEffect, useState } from 'react'
import { Plus, Trash2, Upload, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { compressImage } from '../lib/compressImage'
import { Field } from './FormField'

const TIERS = [
  { value: 'president', label: 'President (Adhyaksh)' },
  { value: 'officer', label: 'Officer (Secretary/Treasurer/VP)' },
  { value: 'member', label: 'Executive Member' },
]

export default function CommitteePanel() {
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [file, setFile] = useState(null)
  const [form, setForm] = useState({ name: '', designation: '', reg_no: '', tier: 'member' })
  const [search, setSearch] = useState('')
  const [filterTier, setFilterTier] = useState('all')

  function loadData() {
    setLoading(true)
    supabase
      .from('committee_members')
      .select('*')
      .order('display_order')
      .order('created_at')
      .then(({ data }) => {
        setMembers(data || [])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()
    const channel = supabase
      .channel('committee-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'committee_members' }, () => loadData())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.name || !form.designation) return
    setError('')
    setSaving(true)

    let photo_url = null
    if (file) {
      const compressed = await compressImage(file)
      const path = `${Date.now()}-${compressed.name}`
      const { error: uploadError } = await supabase.storage.from('committee-photos').upload(path, compressed)
      if (uploadError) {
        setSaving(false)
        setError('Photo upload failed. Please try again.')
        return
      }
      photo_url = supabase.storage.from('committee-photos').getPublicUrl(path).data.publicUrl
    }

    await supabase.from('committee_members').insert({
      name: form.name,
      designation: form.designation,
      reg_no: form.reg_no || null,
      tier: form.tier,
      photo_url,
    })

    setForm({ name: '', designation: '', reg_no: '', tier: 'member' })
    setFile(null)
    setSaving(false)
    loadData()
  }

  async function handleDelete(member) {
    setSaving(true)
    await supabase.from('committee_members').delete().eq('id', member.id)
    setSaving(false)
    loadData()
  }

  const filteredMembers = members.filter((m) => {
    const q = search.toLowerCase()
    const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.designation.toLowerCase().includes(q)
    const matchesTier = filterTier === 'all' || m.tier === filterTier
    return matchesSearch && matchesTier
  })

  if (loading) return <p className="text-stone">Loading committee…</p>

  return (
    <div className="space-y-8">
      <form onSubmit={handleAdd} className="ledger-plaque space-y-4 p-6">
        <h3 className="font-display text-lg font-semibold text-maroon-deep">Add Committee Member</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field id="name" label="Name" type="text" value={form.name} onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))} />
          <Field
            id="designation"
            label="Designation"
            type="text"
            value={form.designation}
            onChange={(e) => setForm((v) => ({ ...v, designation: e.target.value }))}
          />
          <Field id="reg_no" label="Registry No. (optional)" type="text" value={form.reg_no} onChange={(e) => setForm((v) => ({ ...v, reg_no: e.target.value }))} />
          <div>
            <label htmlFor="tier" className="mb-1.5 block text-sm font-medium text-maroon-deep">
              Role Tier
            </label>
            <select
              id="tier"
              value={form.tier}
              onChange={(e) => setForm((v) => ({ ...v, tier: e.target.value }))}
              className="w-full border border-gold/40 bg-cream-paper px-3.5 py-2.5 text-sm text-ink focus:border-saffron"
            >
              {TIERS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-maroon-deep">
            <Upload size={14} /> Photo (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="text-sm text-stone"
          />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
        >
          <Plus size={16} /> {saving ? 'Saving…' : 'Add Member'}
        </button>
      </form>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-maroon-deep">
            Committee ({filteredMembers.length}{filteredMembers.length !== members.length ? ` of ${members.length}` : ''})
          </h3>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-stone" />
              <input
                type="text"
                placeholder="Search name or designation…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="border border-gold/40 bg-cream-paper py-1.5 pl-8 pr-3 text-sm text-ink focus:border-saffron"
              />
            </div>
            <select
              value={filterTier}
              onChange={(e) => setFilterTier(e.target.value)}
              className="border border-gold/40 bg-cream-paper px-3 py-1.5 text-sm text-ink focus:border-saffron"
            >
              <option value="all">All tiers</option>
              {TIERS.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filteredMembers.map((m) => (
            <div key={m.id} className="ledger-plaque flex flex-col items-center p-4 text-center">
              {m.photo_url ? (
                <img src={m.photo_url} alt={m.name} className="h-20 w-20 rounded-md object-cover" />
              ) : (
                <div className="grid h-20 w-20 place-items-center rounded-md border-2 border-gold bg-maroon-deep font-display font-semibold text-gold">
                  {m.name.slice(0, 1)}
                </div>
              )}
              <p className="mt-2 text-sm font-semibold text-maroon-deep">{m.name}</p>
              <p className="text-xs text-saffron">{m.designation}</p>
              {m.reg_no && <p className="mt-1 font-ledger text-[0.65rem] text-gold-deep">{m.reg_no}</p>}
              <button
                onClick={() => handleDelete(m)}
                disabled={saving}
                className="mt-2 flex items-center gap-1 text-xs text-red-700 hover:underline disabled:opacity-60"
              >
                <Trash2 size={12} /> Remove
              </button>
            </div>
          ))}
          {filteredMembers.length === 0 && (
            <p className="col-span-full text-center text-stone">
              {members.length === 0 ? 'No committee members yet.' : 'No members match your search/filter.'}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

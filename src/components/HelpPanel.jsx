import { useEffect, useState } from 'react'
import { Search, Trash2, Phone, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

const STATUS_LABELS = {
  new: { label: 'New', color: 'text-red-700', icon: Clock },
  in_progress: { label: 'In Progress', color: 'text-amber-700', icon: Loader2 },
  resolved: { label: 'Resolved', color: 'text-green-700', icon: CheckCircle2 },
}

export default function HelpPanel() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  function loadData() {
    setLoading(true)
    supabase
      .from('help_requests')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setRequests(data || [])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()
    const channel = supabase
      .channel('help-requests-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'help_requests' }, () => loadData())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  async function updateStatus(id, status) {
    setSaving(true)
    await supabase.from('help_requests').update({ status }).eq('id', id)
    setSaving(false)
    loadData()
  }

  async function handleDelete(req) {
    if (!window.confirm(`Delete the help request from "${req.name}"?`)) return
    setSaving(true)
    await supabase.from('help_requests').delete().eq('id', req.id)
    setSaving(false)
    loadData()
  }

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase()
    const matchesSearch = !q || r.name.toLowerCase().includes(q) || r.phone.includes(q) || r.category.toLowerCase().includes(q)
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const newCount = requests.filter((r) => r.status === 'new').length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className="ledger-plaque p-5">
          <span className="ledger-number">New Requests</span>
          <p className="mt-1 font-display text-2xl font-bold text-red-700">{newCount}</p>
        </div>
        <div className="ledger-plaque p-5">
          <span className="ledger-number">In Progress</span>
          <p className="mt-1 font-display text-2xl font-bold text-amber-700">
            {requests.filter((r) => r.status === 'in_progress').length}
          </p>
        </div>
        <div className="ledger-plaque p-5">
          <span className="ledger-number">Resolved</span>
          <p className="mt-1 font-display text-2xl font-bold text-green-700">
            {requests.filter((r) => r.status === 'resolved').length}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-maroon-deep">
          Requests ({filtered.length}{filtered.length !== requests.length ? ` of ${requests.length}` : ''})
        </h3>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-stone" />
            <input
              type="text"
              placeholder="Search name, phone, category…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="min-w-[220px] border border-gold/40 bg-cream-paper py-1.5 pl-8 pr-3 text-sm text-ink focus:border-saffron"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gold/40 bg-cream-paper px-3 py-1.5 text-sm text-ink focus:border-saffron"
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>
      </div>

      {loading ? (
        <p className="text-stone">Loading…</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => {
            const statusInfo = STATUS_LABELS[r.status]
            return (
              <div key={r.id} className="ledger-plaque p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-display font-semibold text-maroon-deep">{r.name}</p>
                    <a href={`tel:${r.phone}`} className="mt-0.5 flex items-center gap-1 text-sm text-stone hover:text-maroon-deep">
                      <Phone size={13} /> {r.phone}
                    </a>
                    <p className="mt-1 text-xs text-stone">
                      {r.category} · {new Date(r.created_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {r.message && <p className="mt-2 text-sm text-ink">{r.message}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`flex items-center gap-1 text-xs font-medium ${statusInfo.color}`}>
                      <statusInfo.icon size={13} /> {statusInfo.label}
                    </span>
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r.id, e.target.value)}
                      disabled={saving}
                      className="border border-gold/40 bg-cream-paper px-2 py-1 text-xs text-ink focus:border-saffron"
                    >
                      <option value="new">New</option>
                      <option value="in_progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <button
                      onClick={() => handleDelete(r)}
                      disabled={saving}
                      className="flex items-center gap-1 text-xs font-medium text-red-700 hover:underline disabled:opacity-60"
                    >
                      <Trash2 size={12} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <p className="ledger-plaque p-6 text-center text-sm text-stone">
              {requests.length === 0 ? 'No help requests yet.' : 'No requests match your search/filter.'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

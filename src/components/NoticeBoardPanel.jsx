import { useEffect, useState } from 'react'
import { Plus, Trash2, Upload, Eye, EyeOff, Timer } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { compressImage } from '../lib/compressImage'
import { Field, TextAreaField } from './FormField'

export default function NoticeBoardPanel() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [file, setFile] = useState(null)
  const [form, setForm] = useState({ title: '', body: '' })
  const [delaySeconds, setDelaySeconds] = useState('0')
  const [savingDelay, setSavingDelay] = useState(false)

  function loadData() {
    setLoading(true)
    supabase
      .from('notices')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setNotices(data || [])
        setLoading(false)
      })
  }

  function loadDelay() {
    supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'notice_popup_delay_seconds')
      .single()
      .then(({ data }) => {
        if (data) setDelaySeconds(data.value)
      })
  }

  useEffect(() => {
    loadData()
    loadDelay()
    const channel = supabase
      .channel('notices-admin-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notices' }, () => loadData())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  async function handleSaveDelay(e) {
    e.preventDefault()
    setSavingDelay(true)
    await supabase
      .from('site_settings')
      .update({ value: String(Math.max(1, parseInt(delaySeconds, 10) || 10)) })
      .eq('key', 'notice_popup_delay_seconds')
    setSavingDelay(false)
  }

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.title) return
    setError('')
    setSaving(true)

    let image_url = null
    if (file) {
      const compressed = await compressImage(file)
      const path = `${Date.now()}-${compressed.name}`
      const { error: uploadError } = await supabase.storage.from('notice-photos').upload(path, compressed)
      if (uploadError) {
        setSaving(false)
        setError('Photo upload failed. Please try again.')
        return
      }
      image_url = supabase.storage.from('notice-photos').getPublicUrl(path).data.publicUrl
    }

    await supabase.from('notices').insert({ title: form.title, body: form.body || null, image_url })

    setForm({ title: '', body: '' })
    setFile(null)
    setSaving(false)
    loadData()
  }

  async function toggleActive(notice) {
    setSaving(true)
    await supabase.from('notices').update({ active: !notice.active }).eq('id', notice.id)
    setSaving(false)
    loadData()
  }

  async function handleDelete(notice) {
    setSaving(true)
    await supabase.from('notices').delete().eq('id', notice.id)
    setSaving(false)
    loadData()
  }

  if (loading) return <p className="text-stone">Loading notices…</p>

  return (
    <div className="space-y-8">
      <form onSubmit={handleSaveDelay} className="ledger-plaque flex flex-wrap items-end gap-4 p-6">
        <div>
          <label htmlFor="delay" className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-maroon-deep">
            <Timer size={14} /> Repeat Every (seconds)
          </label>
          <input
            id="delay"
            type="number"
            min="1"
            value={delaySeconds}
            onChange={(e) => setDelaySeconds(e.target.value)}
            className="w-32 border border-gold/40 bg-cream-paper px-3.5 py-2.5 text-sm text-ink focus:border-saffron"
          />
        </div>
        <button
          type="submit"
          disabled={savingDelay}
          className="rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
        >
          {savingDelay ? 'Saving…' : 'Save'}
        </button>
        <p className="w-full text-xs text-stone">
          The notice pop-up reappears on this schedule while a visitor is on the site — e.g. set to 10
          to have it pop up every 10 seconds, even after they close it.
        </p>
      </form>

      <form onSubmit={handleAdd} className="ledger-plaque space-y-4 p-6">
        <h3 className="font-display text-lg font-semibold text-maroon-deep">Post a Notice</h3>
        <Field id="title" label="Title" type="text" value={form.title} onChange={(e) => setForm((v) => ({ ...v, title: e.target.value }))} />
        <TextAreaField id="body" label="Details (optional)" value={form.body} onChange={(e) => setForm((v) => ({ ...v, body: e.target.value }))} />
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-maroon-deep">
            <Upload size={14} /> Photo (optional)
          </label>
          <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-sm text-stone" />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
        >
          <Plus size={16} /> {saving ? 'Posting…' : 'Post Notice'}
        </button>
        <p className="text-xs text-stone">
          Active notices show as a pop-up on the website (most recent one) and appear on the News &amp;
          Notices page.
        </p>
      </form>

      <div>
        <h3 className="font-display text-lg font-semibold text-maroon-deep">All Notices ({notices.length})</h3>
        <div className="mt-4 space-y-4">
          {notices.map((n) => (
            <div key={n.id} className="ledger-plaque flex flex-wrap items-start justify-between gap-4 p-5">
              <div className="flex gap-4">
                {n.image_url && (
                  <img src={n.image_url} alt={n.title} className="h-16 w-16 shrink-0 rounded-sm object-cover" />
                )}
                <div className="text-sm">
                  <p className="font-display text-base font-semibold text-maroon-deep">{n.title}</p>
                  {n.body && <p className="mt-1 text-stone">{n.body}</p>}
                  <p className="mt-1 text-xs text-stone">
                    {new Date(n.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} ·{' '}
                    {n.active ? <span className="text-green-700">Active</span> : <span className="text-stone">Hidden</span>}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => toggleActive(n)}
                  disabled={saving}
                  className="flex items-center gap-1.5 rounded-sm border border-gold/50 px-3 py-1.5 text-xs font-medium text-ink hover:border-saffron disabled:opacity-60"
                >
                  {n.active ? <EyeOff size={13} /> : <Eye size={13} />} {n.active ? 'Hide' : 'Show'}
                </button>
                <button
                  onClick={() => handleDelete(n)}
                  disabled={saving}
                  className="flex items-center gap-1 text-xs text-red-700 hover:underline disabled:opacity-60"
                >
                  <Trash2 size={12} /> Delete
                </button>
              </div>
            </div>
          ))}
          {notices.length === 0 && <p className="ledger-plaque p-5 text-center text-sm text-stone">No notices posted yet.</p>}
        </div>
      </div>
    </div>
  )
}

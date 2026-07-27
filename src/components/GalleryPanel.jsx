import { useEffect, useState } from 'react'
import { Plus, Trash2, Upload } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { compressImage } from '../lib/compressImage'
import { Field } from './FormField'

const CATEGORIES = [
  { value: 'events', label: 'Sangh Events' },
  { value: 'ceremonies', label: 'Felicitation Ceremonies' },
  { value: 'health', label: 'Health Camps' },
  { value: 'hostel', label: "Hostel Life" },
]

export default function GalleryPanel() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [file, setFile] = useState(null)
  const [category, setCategory] = useState('events')
  const [caption, setCaption] = useState('')

  function loadData() {
    setLoading(true)
    supabase
      .from('gallery_photos')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setPhotos(data || [])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()
    const channel = supabase
      .channel('gallery-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'gallery_photos' }, () => loadData())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  async function handleUpload(e) {
    e.preventDefault()
    if (!file) return
    setError('')
    setSaving(true)

    const compressed = await compressImage(file)
    const path = `${Date.now()}-${compressed.name}`
    const { error: uploadError } = await supabase.storage.from('gallery-photos').upload(path, compressed)
    if (uploadError) {
      setSaving(false)
      setError('Photo upload failed. Please try again.')
      return
    }
    const url = supabase.storage.from('gallery-photos').getPublicUrl(path).data.publicUrl

    await supabase.from('gallery_photos').insert({ url, category, caption: caption || null })

    setFile(null)
    setCaption('')
    setSaving(false)
    loadData()
  }

  async function handleDelete(photo) {
    setSaving(true)
    await supabase.from('gallery_photos').delete().eq('id', photo.id)
    setSaving(false)
    loadData()
  }

  if (loading) return <p className="text-stone">Loading gallery…</p>

  return (
    <div className="space-y-8">
      <form onSubmit={handleUpload} className="ledger-plaque space-y-4 p-6">
        <h3 className="font-display text-lg font-semibold text-maroon-deep">Upload Photo</h3>
        <div className="flex flex-wrap items-end gap-4">
          <div className="min-w-[180px]">
            <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-maroon-deep">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-gold/40 bg-cream-paper px-3.5 py-2.5 text-sm text-ink focus:border-saffron"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <Field
            id="caption"
            label="Caption (optional)"
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            className="min-w-[180px] flex-1"
          />
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-maroon-deep">
              <Upload size={14} /> Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-sm text-stone"
            />
          </div>
          <button
            type="submit"
            disabled={saving || !file}
            className="flex items-center gap-1.5 rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
          >
            <Plus size={16} /> {saving ? 'Uploading…' : 'Upload'}
          </button>
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
      </form>

      <div>
        <h3 className="font-display text-lg font-semibold text-maroon-deep">Gallery ({photos.length})</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((p) => (
            <div key={p.id} className="group relative aspect-square overflow-hidden border border-gold/40">
              <img src={p.url} alt={p.caption || p.category} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/50 px-2 py-1">
                <span className="text-[0.65rem] text-cream-paper">{p.category}</span>
                <button onClick={() => handleDelete(p)} disabled={saving} className="text-cream-paper hover:text-red-300">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
          {photos.length === 0 && <p className="col-span-full text-center text-stone">No photos yet.</p>}
        </div>
      </div>
    </div>
  )
}

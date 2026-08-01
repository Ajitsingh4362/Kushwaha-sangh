import { useEffect, useState } from 'react'
import { Plus, Trash2, Upload, X, Pencil, Film, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { compressImage } from '../lib/compressImage'
import { uploadVideoToCloudinary, isCloudinaryConfigured } from '../lib/cloudinary'
import { Field, TextAreaField, SelectField } from './FormField'

export const PROGRAM_CATEGORIES = [
  'Blood Donation Camp',
  'Health Checkup Camp',
  'Cultural Event',
  'Felicitation Ceremony',
  'Meeting',
  'Relief / Welfare Drive',
  'Other',
]

const EMPTY_FORM = {
  id: null,
  title: '',
  category: PROGRAM_CATEGORIES[0],
  program_date: '',
  location: '',
  description: '',
  participant_count: '',
}

export default function ProgramsPanel() {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState(EMPTY_FORM)
  const [participants, setParticipants] = useState([]) // [{ name, detail }]
  const [participantName, setParticipantName] = useState('')
  const [participantDetail, setParticipantDetail] = useState('')

  const [existingPhotos, setExistingPhotos] = useState([]) // urls already saved (when editing)
  const [newPhotoFiles, setNewPhotoFiles] = useState([])
  const [existingVideoUrl, setExistingVideoUrl] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [videoProgress, setVideoProgress] = useState(0)

  function loadData() {
    setLoading(true)
    supabase
      .from('programs')
      .select('*')
      .order('program_date', { ascending: false })
      .then(({ data }) => {
        setPrograms(data || [])
        setLoading(false)
      })
  }

  useEffect(() => {
    loadData()
    const channel = supabase
      .channel('programs-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'programs' }, () => loadData())
      .subscribe()
    return () => supabase.removeChannel(channel)
  }, [])

  function resetForm() {
    setForm(EMPTY_FORM)
    setParticipants([])
    setParticipantName('')
    setParticipantDetail('')
    setExistingPhotos([])
    setNewPhotoFiles([])
    setExistingVideoUrl('')
    setVideoFile(null)
    setVideoProgress(0)
    setError('')
  }

  function handleEdit(program) {
    setForm({
      id: program.id,
      title: program.title || '',
      category: program.category || PROGRAM_CATEGORIES[0],
      program_date: program.program_date || '',
      location: program.location || '',
      description: program.description || '',
      participant_count: program.participant_count ?? '',
    })
    setParticipants(Array.isArray(program.participants) ? program.participants : [])
    setExistingPhotos(Array.isArray(program.photos) ? program.photos : [])
    setExistingVideoUrl(program.video_url || '')
    setNewPhotoFiles([])
    setVideoFile(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function addParticipant() {
    if (!participantName.trim()) return
    setParticipants((p) => [...p, { name: participantName.trim(), detail: participantDetail.trim() }])
    setParticipantName('')
    setParticipantDetail('')
  }

  function removeParticipant(idx) {
    setParticipants((p) => p.filter((_, i) => i !== idx))
  }

  function removeExistingPhoto(url) {
    setExistingPhotos((p) => p.filter((u) => u !== url))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.program_date) {
      setError('Title and date are required.')
      return
    }
    setError('')
    setSaving(true)

    try {
      // Upload any newly-added photos
      const uploadedPhotoUrls = []
      for (const file of newPhotoFiles) {
        const compressed = await compressImage(file)
        const path = `${Date.now()}-${compressed.name}`
        const { error: uploadError } = await supabase.storage.from('program-photos').upload(path, compressed)
        if (uploadError) throw new Error('Photo upload failed. Please try again.')
        uploadedPhotoUrls.push(supabase.storage.from('program-photos').getPublicUrl(path).data.publicUrl)
      }

      // Upload video to Cloudinary, if a new one was picked
      let videoUrl = existingVideoUrl
      if (videoFile) {
        if (!isCloudinaryConfigured) throw new Error('Cloudinary is not configured yet — video upload is unavailable.')
        setVideoProgress(0)
        const result = await uploadVideoToCloudinary(videoFile, setVideoProgress)
        videoUrl = result.url
      }

      const payload = {
        title: form.title.trim(),
        category: form.category,
        program_date: form.program_date,
        location: form.location.trim() || null,
        description: form.description.trim() || null,
        participant_count: form.participant_count === '' ? participants.length || null : Number(form.participant_count),
        participants,
        photos: [...existingPhotos, ...uploadedPhotoUrls],
        video_url: videoUrl || null,
      }

      if (form.id) {
        const { error: updateError } = await supabase.from('programs').update(payload).eq('id', form.id)
        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase.from('programs').insert(payload)
        if (insertError) throw insertError
      }

      resetForm()
      loadData()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
      setVideoProgress(0)
    }
  }

  async function handleDelete(program) {
    if (!window.confirm(`Delete "${program.title}"? This cannot be undone.`)) return
    setSaving(true)
    await supabase.from('programs').delete().eq('id', program.id)
    setSaving(false)
    loadData()
  }

  return (
    <div className="space-y-8">
      <form onSubmit={handleSubmit} className="ledger-plaque space-y-5 p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-semibold text-maroon-deep">
            {form.id ? 'Edit Program' : 'Add New Program'}
          </h3>
          {form.id && (
            <button type="button" onClick={resetForm} className="flex items-center gap-1 text-sm text-stone hover:text-maroon-deep">
              <X size={14} /> Cancel edit
            </button>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            id="title"
            label="Program Title"
            type="text"
            placeholder="e.g. Blood Donation Camp — Sitamarhi Sadar Hospital"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          />
          <SelectField
            id="category"
            label="Category"
            options={PROGRAM_CATEGORIES}
            value={form.category}
            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
          />
          <Field
            id="program_date"
            label="Date"
            type="date"
            value={form.program_date}
            onChange={(e) => setForm((f) => ({ ...f, program_date: e.target.value }))}
          />
          <Field
            id="location"
            label="Location / Hospital Name"
            type="text"
            placeholder="e.g. Sadar Hospital, Sitamarhi"
            value={form.location}
            onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
          />
        </div>

        <TextAreaField
          id="description"
          label="Description"
          placeholder="Kya hua, kaise hua, kitne log involve the — sab likhein."
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
        />

        {/* Participants */}
        <div>
          <p className="mb-1.5 text-sm font-medium text-maroon-deep">
            Participants / Donors {participants.length > 0 && `(${participants.length})`}
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <Field
              id="participant_name"
              label="Name"
              type="text"
              className="min-w-[160px] flex-1"
              value={participantName}
              onChange={(e) => setParticipantName(e.target.value)}
            />
            <Field
              id="participant_detail"
              label="Detail (blood group, etc.)"
              type="text"
              className="min-w-[160px] flex-1"
              value={participantDetail}
              onChange={(e) => setParticipantDetail(e.target.value)}
            />
            <button
              type="button"
              onClick={addParticipant}
              className="flex items-center gap-1 rounded-sm border border-gold/40 px-3.5 py-2.5 text-sm font-medium text-maroon-deep hover:border-saffron"
            >
              <Plus size={15} /> Add
            </button>
          </div>
          {participants.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-2">
              {participants.map((p, idx) => (
                <li key={idx} className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-cream-paper px-3 py-1 text-xs text-ink">
                  {p.name}
                  {p.detail && <span className="text-stone">· {p.detail}</span>}
                  <button type="button" onClick={() => removeParticipant(idx)} className="text-stone hover:text-red-700">
                    <X size={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-xs text-stone">
            Total count field ("Participant Count" below) auto-fills from this list if left blank — useful when you only know the number, not every name.
          </p>
          <Field
            id="participant_count"
            label="Participant / Donor Count (optional if list above is filled)"
            type="number"
            min="0"
            className="mt-3 max-w-[220px]"
            value={form.participant_count}
            onChange={(e) => setForm((f) => ({ ...f, participant_count: e.target.value }))}
          />
        </div>

        {/* Photos */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-maroon-deep">
            <Upload size={14} /> Photos
          </label>
          {existingPhotos.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {existingPhotos.map((url) => (
                <div key={url} className="relative h-16 w-16 overflow-hidden rounded-sm border border-gold/40">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExistingPhoto(url)}
                    className="absolute right-0 top-0 bg-black/60 p-0.5 text-cream-paper"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setNewPhotoFiles(Array.from(e.target.files || []))}
            className="text-sm text-stone"
          />
          {newPhotoFiles.length > 0 && <p className="mt-1 text-xs text-stone">{newPhotoFiles.length} new photo(s) selected</p>}
        </div>

        {/* Video */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-maroon-deep">
            <Film size={14} /> Video (uploaded to Cloudinary)
          </label>
          {existingVideoUrl && !videoFile && (
            <video src={existingVideoUrl} controls className="mb-2 h-32 rounded-sm border border-gold/40" />
          )}
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
            className="text-sm text-stone"
          />
          {!isCloudinaryConfigured && (
            <p className="mt-1 text-xs text-amber-700">
              Cloudinary env vars missing — video upload is disabled until VITE_CLOUDINARY_CLOUD_NAME and
              VITE_CLOUDINARY_UPLOAD_PRESET are set.
            </p>
          )}
          {saving && videoFile && (
            <div className="mt-2 flex items-center gap-2 text-xs text-stone">
              <Loader2 size={13} className="animate-spin" /> Uploading video… {videoProgress}%
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-1.5 rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
        >
          {form.id ? <Pencil size={16} /> : <Plus size={16} />}
          {saving ? 'Saving…' : form.id ? 'Update Program' : 'Add Program'}
        </button>
      </form>

      <div>
        <h3 className="font-display text-lg font-semibold text-maroon-deep">All Programs ({programs.length})</h3>
        {loading ? (
          <p className="mt-4 text-stone">Loading…</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <div key={p.id} className="ledger-plaque space-y-2 p-4">
                {p.photos?.[0] && (
                  <img src={p.photos[0]} alt="" className="h-32 w-full rounded-sm object-cover" />
                )}
                <p className="eyebrow text-maroon/70">{p.category}</p>
                <p className="font-display font-semibold text-maroon-deep">{p.title}</p>
                <p className="text-xs text-stone">
                  {p.program_date} {p.location && `· ${p.location}`}
                </p>
                {p.participant_count != null && (
                  <p className="text-xs text-stone">{p.participant_count} participants</p>
                )}
                <div className="flex gap-3 pt-1">
                  <button onClick={() => handleEdit(p)} className="flex items-center gap-1 text-xs font-medium text-maroon-deep hover:underline">
                    <Pencil size={12} /> Edit
                  </button>
                  <button onClick={() => handleDelete(p)} disabled={saving} className="flex items-center gap-1 text-xs font-medium text-red-700 hover:underline">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            ))}
            {programs.length === 0 && <p className="col-span-full text-center text-stone">No programs added yet.</p>}
          </div>
        )}
      </div>
    </div>
  )
}

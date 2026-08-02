import { useEffect, useState } from 'react'
import { Plus, Trash2, Upload, X, Pencil, Film, Loader2, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { compressImage } from '../lib/compressImage'
import { uploadVideoToCloudinary, isCloudinaryConfigured } from '../lib/cloudinary'
import { generateCertificatePdf } from '../lib/certificate'
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
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [formKey, setFormKey] = useState(0)
  const [participants, setParticipants] = useState([]) // [{ name, detail }]
  const [participantName, setParticipantName] = useState('')
  const [participantDetail, setParticipantDetail] = useState('')

  const [existingPhotos, setExistingPhotos] = useState([]) // urls already saved (when editing)
  const [newPhotoFiles, setNewPhotoFiles] = useState([])
  const [existingVideoUrl, setExistingVideoUrl] = useState('')
  const [videoFile, setVideoFile] = useState(null)
  const [videoProgress, setVideoProgress] = useState(0)

  const [existingThumbnailUrl, setExistingThumbnailUrl] = useState('')
  const [existingThumbnailType, setExistingThumbnailType] = useState('')
  const [thumbnailFile, setThumbnailFile] = useState(null)
  const [thumbnailProgress, setThumbnailProgress] = useState(0)
  const [certProgress, setCertProgress] = useState('')

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
    setFormKey((k) => k + 1)
    setForm(EMPTY_FORM)
    setParticipants([])
    setParticipantName('')
    setParticipantDetail('')
    setExistingPhotos([])
    setNewPhotoFiles([])
    setExistingVideoUrl('')
    setVideoFile(null)
    setVideoProgress(0)
    setExistingThumbnailUrl('')
    setExistingThumbnailType('')
    setThumbnailFile(null)
    setThumbnailProgress(0)
    setError('')
  }

  function handleEdit(program) {
    setFormKey((k) => k + 1)
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
    setExistingThumbnailUrl(program.thumbnail_url || '')
    setExistingThumbnailType(program.thumbnail_type || '')
    setNewPhotoFiles([])
    setVideoFile(null)
    setThumbnailFile(null)
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

      // Upload thumbnail (single image OR single video), if a new one was picked
      let thumbnailUrl = existingThumbnailUrl
      let thumbnailType = existingThumbnailType
      if (thumbnailFile) {
        if (thumbnailFile.type.startsWith('video/')) {
          if (!isCloudinaryConfigured) throw new Error('Cloudinary is not configured yet — thumbnail video upload is unavailable.')
          setThumbnailProgress(0)
          const result = await uploadVideoToCloudinary(thumbnailFile, setThumbnailProgress)
          thumbnailUrl = result.url
          thumbnailType = 'video'
        } else {
          const compressed = await compressImage(thumbnailFile)
          const path = `thumb-${Date.now()}-${compressed.name}`
          const { error: thumbUploadError } = await supabase.storage.from('program-photos').upload(path, compressed)
          if (thumbUploadError) throw new Error('Thumbnail upload failed. Please try again.')
          thumbnailUrl = supabase.storage.from('program-photos').getPublicUrl(path).data.publicUrl
          thumbnailType = 'image'
        }
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
        thumbnail_url: thumbnailUrl || null,
        thumbnail_type: thumbnailUrl ? thumbnailType : null,
      }

      let programId = form.id
      if (form.id) {
        const { error: updateError } = await supabase.from('programs').update(payload).eq('id', form.id)
        if (updateError) throw updateError
      } else {
        const { data: inserted, error: insertError } = await supabase.from('programs').insert(payload).select('id').single()
        if (insertError) throw insertError
        programId = inserted.id
      }

      // Auto-generate a certificate PDF for any participant who doesn't have one yet.
      if (participants.length > 0) {
        const needsCert = participants.some((p) => !p.certificate_url)
        if (needsCert) {
          const updatedParticipants = []
          for (let i = 0; i < participants.length; i++) {
            const p = participants[i]
            if (p.certificate_url) {
              updatedParticipants.push(p)
              continue
            }
            setCertProgress(`Generating certificates… ${i + 1}/${participants.length}`)
            try {
              const { blob, certificateId } = await generateCertificatePdf({
                participantName: p.name,
                programTitle: form.title.trim(),
                programDate: form.program_date,
                location: form.location.trim() || null,
              })
              const path = `${programId}/${certificateId}.pdf`
              const { error: certUploadError } = await supabase.storage.from('certificates').upload(path, blob, {
                contentType: 'application/pdf',
                upsert: true,
              })
              if (certUploadError) {
                updatedParticipants.push(p)
                continue
              }
              const certUrl = supabase.storage.from('certificates').getPublicUrl(path).data.publicUrl
              updatedParticipants.push({ ...p, certificate_url: certUrl, certificate_id: certificateId })
            } catch {
              // If certificate generation fails for one participant (e.g. offline),
              // keep going — the program save itself should never be blocked by this.
              updatedParticipants.push(p)
            }
          }
          setCertProgress('')
          await supabase.from('programs').update({ participants: updatedParticipants }).eq('id', programId)
        }
      }

      resetForm()
      loadData()
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSaving(false)
      setVideoProgress(0)
      setThumbnailProgress(0)
      setCertProgress('')
    }
  }

  async function handleDelete(program) {
    if (!window.confirm(`Delete "${program.title}"? This cannot be undone.`)) return
    setSaving(true)
    await supabase.from('programs').delete().eq('id', program.id)
    setSaving(false)
    loadData()
  }

  const filteredPrograms = programs.filter((p) => {
    const q = search.toLowerCase()
    const matchesSearch = !q || p.title.toLowerCase().includes(q) || (p.location || '').toLowerCase().includes(q)
    const matchesCategory = filterCategory === 'all' || p.category === filterCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-8">
      <form key={formKey} onSubmit={handleSubmit} className="ledger-plaque space-y-5 p-6">
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

        {/* Thumbnail — single image or video used as the card cover */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-maroon-deep">
            <Upload size={14} /> Thumbnail (single image or video — shown as the card cover)
          </label>
          {existingThumbnailUrl && !thumbnailFile && (
            <div className="mb-2">
              {existingThumbnailType === 'video' ? (
                <video src={existingThumbnailUrl} muted className="h-24 rounded-sm border border-gold/40" />
              ) : (
                <img src={existingThumbnailUrl} alt="" className="h-24 rounded-sm border border-gold/40 object-cover" />
              )}
            </div>
          )}
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
            className="text-sm text-stone"
          />
          {thumbnailFile && <p className="mt-1 text-xs text-stone">Selected: {thumbnailFile.name}</p>}
          {saving && thumbnailFile && thumbnailFile.type.startsWith('video/') && (
            <div className="mt-2 flex items-center gap-2 text-xs text-stone">
              <Loader2 size={13} className="animate-spin" /> Uploading thumbnail video… {thumbnailProgress}%
            </div>
          )}
        </div>

        {/* Photos — multiple images shown in the gallery on the detail page */}
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-sm font-medium text-maroon-deep">
            <Upload size={14} /> Gallery Photos (multiple)
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
            <Film size={14} /> Program Video (main video, shown on the detail page)
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

        {certProgress && (
          <div className="flex items-center gap-2 text-xs text-stone">
            <Loader2 size={13} className="animate-spin" /> {certProgress}
          </div>
        )}
        <p className="text-xs text-stone">
          A certificate is automatically generated for every participant listed above when you save — no extra
          step needed. Certificates are downloadable from this program&rsquo;s public page.
        </p>

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
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-maroon-deep">
            All Programs ({filteredPrograms.length}{filteredPrograms.length !== programs.length ? ` of ${programs.length}` : ''})
          </h3>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search size={14} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-stone" />
              <input
                type="text"
                placeholder="Search title or location…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="min-w-[200px] border border-gold/40 bg-cream-paper py-1.5 pl-8 pr-3 text-sm text-ink focus:border-saffron"
              />
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gold/40 bg-cream-paper px-3 py-1.5 text-sm text-ink focus:border-saffron"
            >
              <option value="all">All categories</option>
              {PROGRAM_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
        {loading ? (
          <p className="mt-4 text-stone">Loading…</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPrograms.map((p) => (
              <div key={p.id} className="ledger-plaque space-y-2 p-4">
                {(p.thumbnail_url || p.photos?.[0]) && (
                  p.thumbnail_url && p.thumbnail_type === 'video' ? (
                    <video src={p.thumbnail_url} muted className="h-32 w-full rounded-sm object-cover" />
                  ) : (
                    <img src={p.thumbnail_url || p.photos[0]} alt="" className="h-32 w-full rounded-sm object-cover" />
                  )
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
            {filteredPrograms.length === 0 && (
              <p className="col-span-full text-center text-stone">
                {programs.length === 0 ? 'No programs added yet.' : 'No programs match your search/filter.'}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


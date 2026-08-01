import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

export default function NoticePopup() {
  const [notice, setNotice] = useState(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!isSupabaseConfigured) return

    let intervalId

    async function load() {
      const [{ data: noticeData }, { data: settingData }] = await Promise.all([
        supabase.from('notices').select('*').eq('active', true).order('created_at', { ascending: false }).limit(1),
        supabase.from('site_settings').select('value').eq('key', 'notice_popup_delay_seconds').single(),
      ])

      const latest = noticeData?.[0]
      if (!latest) return

      setNotice(latest)

      const intervalMs = Math.max(1, parseInt(settingData?.value, 10) || 10) * 1000

      // Show once right away, then keep reappearing every `intervalMs`.
      setOpen(true)
      intervalId = setInterval(() => setOpen(true), intervalMs)
    }
    load()

    return () => clearInterval(intervalId)
  }, [])

  function handleClose() {
    setOpen(false)
  }

  if (!open || !notice) return null

  return (
    // notranslate: keep this popup's language fixed regardless of the
    // site-wide translate toggle, per request.
    <div className="notranslate fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-5" onClick={handleClose}>
      <div className="ledger-plaque relative w-full max-w-sm overflow-hidden p-0 text-center" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={handleClose}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 rounded-full bg-black/30 p-1 text-cream-paper hover:bg-black/50"
        >
          <X size={18} />
        </button>
        {notice.image_url && <img src={notice.image_url} alt={notice.title} className="h-48 w-full object-cover" />}
        <div className="p-6">
          <span className="eyebrow text-maroon/70">Notice</span>
          <h3 className="mt-1 font-display text-lg font-semibold text-maroon-deep">{notice.title}</h3>
          {notice.body && <p className="mt-2 text-sm text-stone">{notice.body}</p>}
          <button
            type="button"
            onClick={handleClose}
            className="mt-5 rounded-sm bg-maroon-deep px-5 py-2 text-sm font-semibold text-cream-paper"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}

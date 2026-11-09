import { useEffect } from 'react'
import { X } from 'lucide-react'

// Shared popup shell for the admin dashboard. Closes on ✕, Escape or a
// click outside, and stops the page behind from scrolling while open.
export default function AdminModal({ title, subtitle, onClose, toolbar, footer, children }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:p-6" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="flex max-h-[90vh] w-full max-w-3xl flex-col border border-gold/40 bg-cream-paper shadow-xl sm:max-h-[85vh]"
      >
        <div className="flex items-start justify-between gap-4 border-b border-gold/30 px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-maroon-deep">{title}</h2>
            {subtitle && <p className="text-xs text-stone">{subtitle}</p>}
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-stone hover:text-maroon-deep">
            <X size={22} />
          </button>
        </div>
        {toolbar && <div className="border-b border-gold/20 px-5 py-3">{toolbar}</div>}
        <div className="flex-1 overflow-auto">{children}</div>
        {footer && <div className="border-t border-gold/30 px-5 py-3">{footer}</div>}
      </div>
    </div>
  )
}

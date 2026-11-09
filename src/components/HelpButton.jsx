import { useState } from 'react'
import { HelpCircle, X, CheckCircle2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

// Values stay in English because the admin panel reads them; the
// visitor sees the Hindi label.
const CATEGORIES = [
  'Medical / Blood Donation',
  'Financial Assistance',
  'Membership Query',
  'Program / Event Query',
  'Donation Query',
  'General',
]

const CATEGORY_HI = {
  'Medical / Blood Donation': 'चिकित्सा / रक्तदान',
  'Financial Assistance': 'आर्थिक सहायता',
  'Membership Query': 'सदस्यता संबंधी सवाल',
  'Program / Event Query': 'कार्यक्रम संबंधी सवाल',
  'Donation Query': 'दान संबंधी सवाल',
  General: 'सामान्य',
}

export default function HelpButton() {
  const [open, setOpen] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', phone: '', category: CATEGORIES[CATEGORIES.length - 1], message: '' })

  function closeAndReset() {
    setOpen(false)
    setTimeout(() => {
      setSubmitted(false)
      setForm({ name: '', phone: '', category: CATEGORIES[CATEGORIES.length - 1], message: '' })
      setError('')
    }, 300)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      setError('कृपया अपना नाम और फ़ोन नंबर बताएँ।')
      return
    }
    setError('')
    setSaving(true)
    const { error: insertError } = await supabase.from('help_requests').insert({
      name: form.name.trim(),
      phone: form.phone.trim(),
      category: form.category,
      message: form.message.trim() || null,
    })
    setSaving(false)
    if (insertError) {
      setError('कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।')
      return
    }
    setSubmitted(true)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="मदद लें"
        className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-maroon-deep text-cream-paper shadow-lg shadow-black/25 transition hover:scale-105 focus-visible:outline-2 focus-visible:outline-saffron"
      >
        <HelpCircle size={26} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center" onClick={closeAndReset}>
          <div
            className="ledger-plaque w-full max-w-md p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {submitted ? (
              <div className="py-6 text-center">
                <CheckCircle2 size={40} className="mx-auto text-green-700" />
                <p className="mt-3 font-display text-lg font-semibold text-maroon-deep">अनुरोध प्राप्त हुआ</p>
                <p className="mt-1 text-sm text-stone">
                  धन्यवाद! संघ से कोई जल्द ही आपसे संपर्क करेगा।
                </p>
                <button
                  onClick={closeAndReset}
                  className="mt-5 rounded-sm bg-maroon-deep px-5 py-2 text-sm font-semibold text-cream-paper"
                >
                  बंद करें
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold text-maroon-deep">मदद चाहिए?</h3>
                  <button type="button" onClick={closeAndReset} aria-label="बंद करें" className="text-stone hover:text-maroon-deep">
                    <X size={20} />
                  </button>
                </div>
                <p className="text-sm text-stone">
                  कुछ जानकारी दें, संघ जल्द से जल्द आपसे संपर्क करेगा।
                </p>

                <div>
                  <label htmlFor="help_name" className="mb-1 block text-sm font-medium text-maroon-deep">
                    आपका नाम
                  </label>
                  <input
                    id="help_name"
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gold/40 bg-cream-paper px-3 py-2 text-sm text-ink focus:border-saffron"
                  />
                </div>

                <div>
                  <label htmlFor="help_phone" className="mb-1 block text-sm font-medium text-maroon-deep">
                    फ़ोन नंबर
                  </label>
                  <input
                    id="help_phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                    className="w-full border border-gold/40 bg-cream-paper px-3 py-2 text-sm text-ink focus:border-saffron"
                  />
                </div>

                <div>
                  <label htmlFor="help_category" className="mb-1 block text-sm font-medium text-maroon-deep">
                    किस बारे में मदद चाहिए
                  </label>
                  <select
                    id="help_category"
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full border border-gold/40 bg-cream-paper px-3 py-2 text-sm text-ink focus:border-saffron"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {CATEGORY_HI[c] || c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="help_message" className="mb-1 block text-sm font-medium text-maroon-deep">
                    विवरण (वैकल्पिक)
                  </label>
                  <textarea
                    id="help_message"
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                    className="w-full border border-gold/40 bg-cream-paper px-3 py-2 text-sm text-ink focus:border-saffron"
                  />
                </div>

                {error && <p className="text-sm text-red-700">{error}</p>}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
                >
                  {saving ? 'भेजा जा रहा है…' : 'अनुरोध भेजें'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}

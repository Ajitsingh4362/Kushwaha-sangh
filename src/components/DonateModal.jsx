import { useState } from 'react'
import { X, CheckCircle2 } from 'lucide-react'
import QRCode from 'react-qr-code'
import { donationMethods } from '../data/content'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { Field } from './FormField'
import { useDonateModal } from '../lib/DonateModalContext'

// ---------------------------------------------------------------
// CURRENT DONATE FLOW (active): details form -> QR -> self-declare paid
// ---------------------------------------------------------------
// Step 1: donor fills name/email/phone/amount
// Step 2: those details are saved to Supabase (status: 'declared') and
//         the UPI QR is shown
// Step 3: donor clicks "I've Paid" once done — modal closes
// The committee then cross-checks bank/UPI statements against these
// "declared" entries in the admin panel and marks them "Verified".
//
// This exists because there's no live payment gateway wired in yet to
// auto-confirm payment. Once a real Razorpay account is active, this
// can be swapped for a Razorpay checkout flow that auto-records
// confirmed payments instead of relying on self-declaration.
// ---------------------------------------------------------------

const STEP = { FORM: 'form', QR: 'qr', DONE: 'done' }

export default function DonateModal() {
  const { open, closeModal } = useDonateModal()
  const [step, setStep] = useState(STEP.FORM)
  const [form, setForm] = useState({ name: '', email: '', phone: '', amount: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function resetAndClose() {
    closeModal()
    setStep(STEP.FORM)
    setForm({ name: '', email: '', phone: '', amount: '' })
    setError('')
  }

  async function handleFormSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.name || !form.amount) {
      setError('कृपया अपना नाम और राशि दर्ज करें।')
      return
    }

    if (!isSupabaseConfigured) {
      setStep(STEP.QR)
      return
    }

    setSaving(true)
    const { error: insertError } = await supabase.from('donations').insert({
      donor_name: form.name,
      donor_email: form.email || null,
      donor_phone: form.phone || null,
      amount: parseFloat(form.amount),
      status: 'declared',
      payment_method: 'upi_qr',
    })
    setSaving(false)

    if (insertError) {
      setError('आपकी जानकारी सेव नहीं हो पाई, फिर भी आप नीचे स्कैन करके भुगतान कर सकते हैं।')
    }
    setStep(STEP.QR)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
      <div className="ledger-plaque relative w-full max-w-xs p-7 text-center">
        <button
          type="button"
          onClick={resetAndClose}
          aria-label="बंद करें"
          className="absolute right-3 top-3 text-stone hover:text-maroon"
        >
          <X size={20} />
        </button>

        {step === STEP.FORM && (
          <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
            <h3 className="text-center font-display text-lg font-semibold text-maroon-deep">आपकी जानकारी</h3>
            <Field
              id="name"
              label="पूरा नाम"
              type="text"
              value={form.name}
              onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
              required
            />
            <Field
              id="email"
              label="ईमेल (वैकल्पिक)"
              type="email"
              value={form.email}
              onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
            />
            <Field
              id="phone"
              label="फ़ोन (वैकल्पिक)"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))}
            />
            <Field
              id="amount"
              label="राशि (₹)"
              type="number"
              value={form.amount}
              onChange={(e) => setForm((v) => ({ ...v, amount: e.target.value }))}
              required
            />
            {error && <p className="text-xs text-red-700">{error}</p>}
            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-sm bg-saffron px-5 py-2.5 text-sm font-semibold text-maroon-deep disabled:opacity-60"
            >
              {saving ? 'सेव हो रहा है…' : 'भुगतान के लिए आगे बढ़ें'}
            </button>
          </form>
        )}

        {step === STEP.QR && (
          <>
            <h3 className="font-display text-lg font-semibold text-maroon-deep">दान के लिए स्कैन करें</h3>
            <p className="mt-1 text-xs text-stone">
              भुगतान के लिए किसी भी UPI ऐप (Google Pay, PhonePe, Paytm आदि) से स्कैन करें।
            </p>
            <div className="mx-auto mt-5 w-fit bg-white p-3">
              <QRCode
                value={`upi://pay?pa=${donationMethods.upiId}&pn=Kushwaha%20Sangh&am=${form.amount || ''}&cu=INR`}
                size={180}
              />
            </div>
            <p className="mt-4 font-ledger text-sm text-ink">{donationMethods.upiId}</p>
            {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
            <button
              type="button"
              onClick={() => setStep(STEP.DONE)}
              className="mt-5 w-full rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper"
            >
              मैंने भुगतान कर दिया
            </button>
          </>
        )}

        {step === STEP.DONE && (
          <div className="flex flex-col items-center py-4">
            <CheckCircle2 size={40} className="text-saffron" />
            <p className="mt-3 font-display text-lg font-semibold text-maroon-deep">धन्यवाद! 🙏</p>
            <p className="mt-1 text-sm text-stone">
              समिति जल्द ही संघ के रिकॉर्ड से आपके भुगतान का सत्यापन करेगी।
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="mt-5 rounded-sm bg-maroon-deep px-5 py-2 text-sm font-semibold text-cream-paper"
            >
              बंद करें
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

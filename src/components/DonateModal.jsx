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
      setError('Please enter your name and amount.')
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
      setError('Could not save your details, but you can still scan and pay below.')
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
          aria-label="Close"
          className="absolute right-3 top-3 text-stone hover:text-maroon"
        >
          <X size={20} />
        </button>

        {step === STEP.FORM && (
          <form onSubmit={handleFormSubmit} className="space-y-4 text-left">
            <h3 className="text-center font-display text-lg font-semibold text-maroon-deep">Your Details</h3>
            <Field
              id="name"
              label="Full Name"
              type="text"
              value={form.name}
              onChange={(e) => setForm((v) => ({ ...v, name: e.target.value }))}
              required
            />
            <Field
              id="email"
              label="Email (optional)"
              type="email"
              value={form.email}
              onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
            />
            <Field
              id="phone"
              label="Phone (optional)"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((v) => ({ ...v, phone: e.target.value }))}
            />
            <Field
              id="amount"
              label="Amount (₹)"
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
              {saving ? 'Saving…' : 'Continue to Pay'}
            </button>
          </form>
        )}

        {step === STEP.QR && (
          <>
            <h3 className="font-display text-lg font-semibold text-maroon-deep">Scan to Donate</h3>
            <p className="mt-1 text-xs text-stone">
              Test QR — replace with the Sangh&rsquo;s real UPI QR before launch.
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
              I&rsquo;ve Paid
            </button>
          </>
        )}

        {step === STEP.DONE && (
          <div className="flex flex-col items-center py-4">
            <CheckCircle2 size={40} className="text-saffron" />
            <p className="mt-3 font-display text-lg font-semibold text-maroon-deep">Thank you! 🙏</p>
            <p className="mt-1 text-sm text-stone">
              The committee will verify your payment against Sangh records shortly.
            </p>
            <button
              type="button"
              onClick={resetAndClose}
              className="mt-5 rounded-sm bg-maroon-deep px-5 py-2 text-sm font-semibold text-cream-paper"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

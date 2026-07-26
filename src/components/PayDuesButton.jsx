import { useState } from 'react'
import { X, CheckCircle2, Search } from 'lucide-react'
import QRCode from 'react-qr-code'
import { supabase } from '../lib/supabase'
import { donationMethods } from '../data/content'
import { Field } from './FormField'

const STEP = { PHONE: 'phone', LIST: 'list', QR: 'qr', DONE: 'done', CLEAR: 'clear' }

function monthLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
}

export default function PayDuesButton() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(STEP.PHONE)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [memberName, setMemberName] = useState('')
  const [pending, setPending] = useState([])

  function resetAndClose() {
    setOpen(false)
    setStep(STEP.PHONE)
    setPhone('')
    setError('')
    setMemberName('')
    setPending([])
  }

  async function handleLookup(e) {
    e.preventDefault()
    setError('')
    if (!phone.trim()) return
    setLoading(true)
    const { data, error: rpcError } = await supabase.rpc('get_my_pending_dues', { p_phone: phone })
    setLoading(false)

    if (rpcError) {
      setError('Something went wrong. Please try again.')
      return
    }
    if (!data || data.length === 0) {
      setStep(STEP.CLEAR)
      return
    }
    setMemberName(data[0].member_name)
    setPending(data)
    setStep(STEP.LIST)
  }

  async function handleMarkPaid() {
    setLoading(true)
    const dueIds = pending.map((d) => d.due_id)
    const { error: rpcError } = await supabase.rpc('declare_dues_paid', { p_phone: phone, p_due_ids: dueIds })
    setLoading(false)
    if (rpcError) {
      setError('Could not save — please try again or contact the committee.')
      return
    }
    setStep(STEP.DONE)
  }

  const total = pending.reduce((sum, d) => sum + Number(d.amount), 0)

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-sm border border-maroon-deep px-6 py-3 text-sm font-semibold text-maroon-deep transition hover:bg-maroon-deep hover:text-cream-paper"
      >
        Pay Monthly Due
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
          <div className="ledger-plaque relative w-full max-w-sm p-7 text-center">
            <button
              type="button"
              onClick={resetAndClose}
              aria-label="Close"
              className="absolute right-3 top-3 text-stone hover:text-maroon"
            >
              <X size={20} />
            </button>

            {step === STEP.PHONE && (
              <form onSubmit={handleLookup} className="space-y-4 text-left">
                <h3 className="text-center font-display text-lg font-semibold text-maroon-deep">
                  Pay Your Monthly Due
                </h3>
                <p className="text-center text-sm text-stone">
                  Enter the phone number you registered with as a member.
                </p>
                <p className="rounded-sm bg-cream-deep/60 p-2.5 text-center text-xs text-stone">
                  Note: our online records start from <strong>August 2026</strong>. The Sangh itself has
                  been active for 10 years, but dues from before this system was built aren&rsquo;t tracked
                  here.
                </p>
                <Field
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                {error && <p className="text-xs text-red-700">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-1.5 rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
                >
                  <Search size={15} /> {loading ? 'Checking…' : 'Check My Dues'}
                </button>
              </form>
            )}

            {step === STEP.CLEAR && (
              <div className="flex flex-col items-center py-4">
                <CheckCircle2 size={40} className="text-saffron" />
                <p className="mt-3 font-display text-lg font-semibold text-maroon-deep">All clear! 🎉</p>
                <p className="mt-1 text-sm text-stone">
                  No pending dues found for this number — either you&rsquo;re fully paid up, or this number
                  isn&rsquo;t registered yet. Contact the committee if that seems wrong.
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

            {step === STEP.LIST && (
              <div className="text-left">
                <h3 className="text-center font-display text-lg font-semibold text-maroon-deep">
                  Hi {memberName}
                </h3>
                <p className="mt-1 text-center text-sm text-stone">You have {pending.length} month(s) pending:</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {pending.map((d) => (
                    <li key={d.due_id} className="flex justify-between border-b border-gold/20 pb-1.5">
                      <span>{monthLabel(d.due_month)}</span>
                      <span className="font-ledger text-gold-deep">
                        ₹{Number(d.amount)}
                        {d.status === 'declared' && <span className="ml-1 text-[0.65rem] text-stone">(pending verify)</span>}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between font-display font-semibold text-maroon-deep">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(STEP.QR)}
                  className="mt-5 w-full rounded-sm bg-saffron px-5 py-2.5 text-sm font-semibold text-maroon-deep"
                >
                  Continue to Pay
                </button>
              </div>
            )}

            {step === STEP.QR && (
              <>
                <h3 className="font-display text-lg font-semibold text-maroon-deep">Scan &amp; Pay ₹{total}</h3>
                <p className="mt-1 text-xs text-stone">
                  Test QR — replace with the Sangh&rsquo;s real UPI QR before launch.
                </p>
                <div className="mx-auto mt-5 w-fit bg-white p-3">
                  <QRCode value={`upi://pay?pa=${donationMethods.upiId}&pn=Kushwaha%20Sangh&am=${total}&cu=INR`} size={180} />
                </div>
                <p className="mt-4 font-ledger text-sm text-ink">{donationMethods.upiId}</p>
                {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
                <button
                  type="button"
                  onClick={handleMarkPaid}
                  disabled={loading}
                  className="mt-5 w-full rounded-sm bg-maroon-deep px-5 py-2.5 text-sm font-semibold text-cream-paper disabled:opacity-60"
                >
                  {loading ? 'Saving…' : "I've Paid"}
                </button>
              </>
            )}

            {step === STEP.DONE && (
              <div className="flex flex-col items-center py-4">
                <CheckCircle2 size={40} className="text-saffron" />
                <p className="mt-3 font-display text-lg font-semibold text-maroon-deep">Thank you! 🙏</p>
                <p className="mt-1 text-sm text-stone">
                  The committee will verify your payment shortly and clear it from your record.
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
      )}
    </>
  )
}

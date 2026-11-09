import { useState } from 'react'
import { X, CheckCircle2, Search } from 'lucide-react'
import QRCode from 'react-qr-code'
import { supabase } from '../lib/supabase'
import { donationMethods } from '../data/content'
import { Field } from './FormField'

const STEP = { PHONE: 'phone', LIST: 'list', QR: 'qr', DONE: 'done', CLEAR: 'clear' }

function monthLabel(dateStr) {
  return new Date(dateStr).toLocaleDateString('hi-IN', { month: 'long', year: 'numeric' })
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
      setError('कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।')
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
      setError('जानकारी सेव नहीं हो पाई। कृपया दोबारा कोशिश करें या समिति से संपर्क करें।')
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
        मासिक शुल्क भरें
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-5">
          <div className="ledger-plaque relative w-full max-w-sm p-7 text-center">
            <button
              type="button"
              onClick={resetAndClose}
              aria-label="बंद करें"
              className="absolute right-3 top-3 text-stone hover:text-maroon"
            >
              <X size={20} />
            </button>

            {step === STEP.PHONE && (
              <form onSubmit={handleLookup} className="space-y-4 text-left">
                <h3 className="text-center font-display text-lg font-semibold text-maroon-deep">
                  अपना मासिक शुल्क भरें
                </h3>
                <p className="text-center text-sm text-stone">
                  सदस्यता के समय दर्ज कराया गया अपना फ़ोन नंबर डालें।
                </p>
                <p className="rounded-sm bg-cream-deep/60 p-2.5 text-center text-xs text-stone">
                  ध्यान दें: हमारा ऑनलाइन रिकॉर्ड <strong>अगस्त 2026</strong> से शुरू होता है। संघ 10 वर्षों से
                  सक्रिय है, लेकिन इस व्यवस्था के शुरू होने से पहले का बकाया शुल्क यहाँ दर्ज नहीं है।
                </p>
                <Field
                  id="phone"
                  label="फ़ोन नंबर"
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
                  <Search size={15} /> {loading ? 'जाँच हो रही है…' : 'मेरा बकाया देखें'}
                </button>
              </form>
            )}

            {step === STEP.CLEAR && (
              <div className="flex flex-col items-center py-4">
                <CheckCircle2 size={40} className="text-saffron" />
                <p className="mt-3 font-display text-lg font-semibold text-maroon-deep">कोई बकाया नहीं! 🎉</p>
                <p className="mt-1 text-sm text-stone">
                  इस नंबर पर कोई बकाया शुल्क नहीं मिला। या तो आपका पूरा भुगतान हो चुका है, या यह नंबर अभी
                  पंजीकृत नहीं है। अगर यह गलत लगे तो समिति से संपर्क करें।
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

            {step === STEP.LIST && (
              <div className="text-left">
                <h3 className="text-center font-display text-lg font-semibold text-maroon-deep">
                  नमस्ते, {memberName}
                </h3>
                <p className="mt-1 text-center text-sm text-stone">आपके {pending.length} महीने का शुल्क बकाया है:</p>
                <ul className="mt-4 space-y-2 text-sm">
                  {pending.map((d) => (
                    <li key={d.due_id} className="flex justify-between border-b border-gold/20 pb-1.5">
                      <span>{monthLabel(d.due_month)}</span>
                      <span className="font-ledger text-gold-deep">
                        ₹{Number(d.amount)}
                        {d.status === 'declared' && <span className="ml-1 text-[0.65rem] text-stone">(सत्यापन बाकी)</span>}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between font-display font-semibold text-maroon-deep">
                  <span>कुल</span>
                  <span>₹{total}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(STEP.QR)}
                  className="mt-5 w-full rounded-sm bg-saffron px-5 py-2.5 text-sm font-semibold text-maroon-deep"
                >
                  भुगतान के लिए आगे बढ़ें
                </button>
              </div>
            )}

            {step === STEP.QR && (
              <>
                <h3 className="font-display text-lg font-semibold text-maroon-deep">स्कैन करके ₹{total} भरें</h3>
                <p className="mt-1 text-xs text-stone">
                  भुगतान के लिए किसी भी UPI ऐप (Google Pay, PhonePe, Paytm आदि) से स्कैन करें।
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
                  {loading ? 'सेव हो रहा है…' : 'मैंने भुगतान कर दिया'}
                </button>
              </>
            )}

            {step === STEP.DONE && (
              <div className="flex flex-col items-center py-4">
                <CheckCircle2 size={40} className="text-saffron" />
                <p className="mt-3 font-display text-lg font-semibold text-maroon-deep">धन्यवाद! 🙏</p>
                <p className="mt-1 text-sm text-stone">
                  समिति जल्द ही आपके भुगतान का सत्यापन करके इसे आपके रिकॉर्ड से हटा देगी।
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
      )}
    </>
  )
}
